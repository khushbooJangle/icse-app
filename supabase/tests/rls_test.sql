-- RLS verification. Runs as the `authenticated` role (NOT the table owner,
-- who bypasses RLS) so the policies are genuinely exercised.
\set ON_ERROR_STOP on

-- Supabase grants these automatically; a local Postgres does not.
grant usage on schema public to authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;

-- Stand in for "signed in as this person".
create or replace function test_become(p_uid uuid, p_email text)
returns void language plpgsql as $$
begin
  perform set_config('test.uid', p_uid::text, false);
  perform set_config('request.jwt.claims', json_build_object('email', p_email)::text, false);
end $$;

-- Fixed uuids so assertions can refer to them.
insert into auth.users (id, email) values
  ('11111111-1111-1111-1111-111111111111','tutor1@example.com'),
  ('22222222-2222-2222-2222-222222222222','tutor2@example.com'),
  ('33333333-3333-3333-3333-333333333333','student1@example.com'),
  ('44444444-4444-4444-4444-444444444444','student2@example.com'),
  ('55555555-5555-5555-5555-555555555555','parent1@example.com');

-- ---------------------------------------------------------------------------
-- Build the two tenants through the real signup RPCs.
-- ---------------------------------------------------------------------------
select test_become('11111111-1111-1111-1111-111111111111','tutor1@example.com');
set role authenticated;
select public.join_as_tutor('Tutor One');
reset role;

select test_become('22222222-2222-2222-2222-222222222222','tutor2@example.com');
set role authenticated;
select public.join_as_tutor('Tutor Two');
reset role;

-- Capture the codes while still the table owner. A student genuinely CANNOT
-- read the tutors table (that is the point of the policy) — in the real app the
-- tutor tells them the code and they type it in.
select invite_code as t1code from public.tutors
 where id = '11111111-1111-1111-1111-111111111111' \gset
select invite_code as t2code from public.tutors
 where id = '22222222-2222-2222-2222-222222222222' \gset

-- Students redeem their tutor's code.
select test_become('33333333-3333-3333-3333-333333333333','student1@example.com');
set role authenticated;
select public.redeem_invite_code(:'t1code', 'Student One');
reset role;

select test_become('44444444-4444-4444-4444-444444444444','student2@example.com');
set role authenticated;
select public.redeem_invite_code(:'t2code', 'Student Two');
reset role;

-- Parent redeems Student One's parent code (again captured as owner).
select parent_invite_code as s1code from public.profiles
 where id = '33333333-3333-3333-3333-333333333333' \gset

select test_become('55555555-5555-5555-5555-555555555555','parent1@example.com');
set role authenticated;
select public.redeem_invite_code(:'s1code', 'Parent One');
reset role;

\echo '--- setup complete, roles assigned: ---'
select id, role, display_name, tutor_id, parent_of from public.profiles order by role, display_name;

-- ---------------------------------------------------------------------------
-- TENANT ISOLATION
-- ---------------------------------------------------------------------------
do $$
declare n int; begin
  perform test_become('11111111-1111-1111-1111-111111111111','tutor1@example.com');
  set local role authenticated;

  -- Tutor One sees themselves + Student One, and must NOT see Tutor Two's side.
  select count(*) into n from public.profiles
   where id = '44444444-4444-4444-4444-444444444444';
  assert n = 0, 'LEAK: Tutor One can see Tutor Two''s student';

  select count(*) into n from public.profiles
   where id = '33333333-3333-3333-3333-333333333333';
  assert n = 1, 'Tutor One cannot see their own student';

  select count(*) into n from public.tutors
   where id = '22222222-2222-2222-2222-222222222222';
  assert n = 0, 'LEAK: Tutor One can read Tutor Two''s row (and invite code)';
end $$;
\echo 'OK  tutor cannot see another tutor''s roster or invite code'

-- Student progress is private to their own tenant.
do $$
declare n int; begin
  perform test_become('33333333-3333-3333-3333-333333333333','student1@example.com');
  set local role authenticated;
  insert into public.progress (student_id, subject_id, chapter_slug, studied, quiz_best_score)
  values ('33333333-3333-3333-3333-333333333333',
          (select id from public.subjects limit 1), 'loops', true, 90);

  -- Writing progress for somebody else must be refused by the WITH CHECK.
  begin
    insert into public.progress (student_id, subject_id, chapter_slug)
    values ('44444444-4444-4444-4444-444444444444',
            (select id from public.subjects limit 1), 'loops');
    raise exception 'LEAK: student wrote progress onto another student';
  exception when insufficient_privilege or check_violation then
    null;  -- expected
  end;
end $$;
\echo 'OK  student cannot write progress for another student'

do $$
declare n int; begin
  perform test_become('22222222-2222-2222-2222-222222222222','tutor2@example.com');
  set local role authenticated;
  select count(*) into n from public.progress
   where student_id = '33333333-3333-3333-3333-333333333333';
  assert n = 0, 'LEAK: Tutor Two can read Tutor One''s student progress';
end $$;
\echo 'OK  tutor cannot read another tenant''s progress'

do $$
declare n int; begin
  perform test_become('11111111-1111-1111-1111-111111111111','tutor1@example.com');
  set local role authenticated;
  select count(*) into n from public.progress
   where student_id = '33333333-3333-3333-3333-333333333333';
  assert n = 1, 'Tutor One cannot read their OWN student''s progress';
end $$;
\echo 'OK  tutor can read their own student''s progress'

do $$
declare n int; begin
  perform test_become('55555555-5555-5555-5555-555555555555','parent1@example.com');
  set local role authenticated;
  select count(*) into n from public.progress
   where student_id = '33333333-3333-3333-3333-333333333333';
  assert n = 1, 'Parent cannot read their linked student''s progress';
  select count(*) into n from public.progress
   where student_id = '44444444-4444-4444-4444-444444444444';
  assert n = 0, 'LEAK: parent can read an unrelated student''s progress';
end $$;
\echo 'OK  parent sees only their own child''s progress'

-- ---------------------------------------------------------------------------
-- ROLE ESCALATION
-- ---------------------------------------------------------------------------
do $$
begin
  perform test_become('33333333-3333-3333-3333-333333333333','student1@example.com');
  set local role authenticated;
  begin
    update public.profiles set role = 'super_admin'
     where id = '33333333-3333-3333-3333-333333333333';
    raise exception 'ESCALATION: student promoted themselves to super_admin';
  exception when raise_exception then
    if sqlerrm like 'ESCALATION%' then raise; end if;  -- real failure
  end;

  begin
    update public.profiles set tutor_id = '22222222-2222-2222-2222-222222222222'
     where id = '33333333-3333-3333-3333-333333333333';
    raise exception 'ESCALATION: student moved themselves to another roster';
  exception when raise_exception then
    if sqlerrm like 'ESCALATION%' then raise; end if;
  end;
end $$;
\echo 'OK  student cannot change their own role or tutor'

-- ---------------------------------------------------------------------------
-- DOUBTS (Section 12)
-- ---------------------------------------------------------------------------
do $$
declare d_id uuid; n int; begin
  -- Student raises a doubt.
  perform test_become('33333333-3333-3333-3333-333333333333','student1@example.com');
  set local role authenticated;
  insert into public.doubts (student_id, subject_id, chapter_slug, question_text)
  values ('33333333-3333-3333-3333-333333333333',
          (select id from public.subjects limit 1), 'loops', 'Why does do-while run once?')
  returning id into d_id;

  -- Illegal jump: open -> resolved without a reply.
  begin
    update public.doubts set status = 'resolved' where id = d_id;
    raise exception 'BAD: student skipped straight to resolved';
  exception when raise_exception then
    if sqlerrm like 'BAD:%' then raise; end if;
  end;

  perform set_config('test.doubt', d_id::text, false);
end $$;
\echo 'OK  student cannot resolve a doubt that has no reply'

do $$
declare d_id uuid := current_setting('test.doubt')::uuid; n int; begin
  -- The WRONG tutor must not see it.
  perform test_become('22222222-2222-2222-2222-222222222222','tutor2@example.com');
  set local role authenticated;
  select count(*) into n from public.doubts where id = d_id;
  assert n = 0, 'LEAK: another tutor can read this doubt';
end $$;
\echo 'OK  a doubt is invisible to other tutors'

do $$
declare d_id uuid := current_setting('test.doubt')::uuid; n int; begin
  -- PARENTS MUST NEVER SEE DOUBTS AT ALL (APP_PLAN 12.2).
  perform test_become('55555555-5555-5555-5555-555555555555','parent1@example.com');
  set local role authenticated;
  select count(*) into n from public.doubts;
  assert n = 0, 'LEAK: parent can see the doubts table';
end $$;
\echo 'OK  parent cannot see the doubts table at all'

do $$
declare d_id uuid := current_setting('test.doubt')::uuid; n int; begin
  -- The right tutor replies.
  perform test_become('11111111-1111-1111-1111-111111111111','tutor1@example.com');
  set local role authenticated;
  select count(*) into n from public.doubts where id = d_id;
  assert n = 1, 'Tutor One cannot see their own student''s doubt';
  update public.doubts
     set tutor_reply = 'Because the condition is checked after the body runs.',
         status = 'replied', replied_at = now()
   where id = d_id;
end $$;
\echo 'OK  the student''s own tutor can read and reply'

do $$
declare d_id uuid := current_setting('test.doubt')::uuid; s text; begin
  perform test_become('33333333-3333-3333-3333-333333333333','student1@example.com');
  set local role authenticated;

  -- Student must not be able to rewrite the tutor's answer.
  begin
    update public.doubts set tutor_reply = 'I said so' where id = d_id;
    raise exception 'BAD: student edited the tutor reply';
  exception when raise_exception then
    if sqlerrm like 'BAD:%' then raise; end if;
  end;

  -- replied -> discuss, then discuss -> resolved (the two legal student moves).
  update public.doubts set status = 'discuss'  where id = d_id;
  update public.doubts set status = 'resolved' where id = d_id;
  select status into s from public.doubts where id = d_id;
  assert s = 'resolved', 'student could not close out their own doubt';
end $$;
\echo 'OK  student can self-close but cannot edit the reply'

-- ---------------------------------------------------------------------------
-- SUPER ADMIN
-- ---------------------------------------------------------------------------
do $$
declare n int; begin
  -- Promote Tutor One by hand, simulating you doing it in the SQL Editor:
  -- no JWT, so auth.uid() is null and the admin exemption applies.
  perform set_config('test.uid', '', false);
  update public.profiles set role = 'super_admin'
   where id = '11111111-1111-1111-1111-111111111111';

  perform test_become('11111111-1111-1111-1111-111111111111','tutor1@example.com');
  set local role authenticated;
  select count(*) into n from public.profiles;
  assert n = 5, format('super admin should see all 5 profiles, saw %s', n);
  select count(*) into n from public.doubts;
  assert n = 1, 'super admin should see all doubts';
end $$;
\echo 'OK  super admin sees across every tenant'

\echo ''
\echo '================================================='
\echo ' ALL RLS CHECKS PASSED'
\echo '================================================='
