-- ============================================================================
-- ICSE Study App — full database schema + Row Level Security
-- APP_PLAN.md Sections 11 (multi-tenant backend) and 12 (doubts)
--
-- HOW TO RUN: paste this whole file into the Supabase SQL Editor and press Run.
-- It is safe to run once on a fresh project. To start over, run the TEARDOWN
-- block at the bottom of this file first, then run this again.
--
-- WHAT THIS CREATES
--   8 tables      subjects, tutors, profiles, invites, progress,
--                 paper_attempts, daily_activity, doubts
--   helpers       small SECURITY DEFINER functions used inside RLS policies
--   RPCs          ensure_profile / join_as_tutor / redeem_invite_code
--   RLS           every table locked down per APP_PLAN 11.9 and 12.2
--
-- ORDER MATTERS: tables are created before the functions that reference them,
-- because Postgres validates a `language sql` function body at creation time.
--
-- NOTE ON TABLE COUNT: APP_PLAN 11.4 lists six tables and 12.2 adds `doubts`.
-- This schema has one more than that — `paper_attempts` — because papers are
-- per-year (icse-2023) and global to a student, which does not fit `progress`'s
-- per-chapter grain. Agreed with Khushboo before writing this file.
-- ============================================================================


-- ============================================================================
-- 1. TABLES
-- ============================================================================

-- ---- subjects --------------------------------------------------------------
-- One row today (Computer Applications). Exists from day one so that adding a
-- second subject later is an INSERT, not a migration (APP_PLAN 11.6).
create table public.subjects (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  display_name text not null,
  created_at   timestamptz not null default now()
);

-- ---- tutors ----------------------------------------------------------------
-- A tutor is a TENANT OWNER. `id` deliberately equals profiles.id for the same
-- person (APP_PLAN 11.2) so the join is never ambiguous.
create table public.tutors (
  id           uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  invite_code  text unique not null,
  created_at   timestamptz not null default now()
);

-- ---- profiles --------------------------------------------------------------
-- Exactly one row per authenticated user, whatever their role.
create table public.profiles (
  id                 uuid primary key references auth.users(id) on delete cascade,
  role               text not null check (role in ('super_admin','tutor','student','parent')),
  display_name       text not null,
  tutor_id           uuid references public.profiles(id) on delete set null,
  parent_of          uuid references public.profiles(id) on delete set null,
  parent_invite_code text unique,
  created_at         timestamptz not null default now(),

  -- Shape rules, enforced by the database rather than trusted to app code.
  -- Every student sits on exactly one tutor's roster...
  constraint student_needs_tutor
    check (role <> 'student' or tutor_id is not null),
  -- ...and nobody else carries a tutor_id.
  constraint only_students_have_tutor
    check (role = 'student' or tutor_id is null),
  -- Every parent is linked to exactly one student...
  constraint parent_needs_student
    check (role <> 'parent' or parent_of is not null),
  -- ...and nobody else carries parent_of.
  constraint only_parents_have_parent_of
    check (role = 'parent' or parent_of is null),
  -- Only students hand out a parent code.
  constraint only_students_have_parent_code
    check (role = 'student' or parent_invite_code is null),
  -- Self-linking block (APP_PLAN 11.3), belt-and-braces alongside the RPC check.
  constraint no_self_tutor  check (tutor_id is distinct from id),
  constraint no_self_parent check (parent_of is distinct from id)
);

create index profiles_tutor_id_idx  on public.profiles (tutor_id);
create index profiles_parent_of_idx on public.profiles (parent_of);

-- ---- invites ---------------------------------------------------------------
-- Email invites (APP_PLAN 11.3). A tutor invites a student; a student invites
-- a parent. At sign-in these take priority over typed codes.
create table public.invites (
  id          uuid primary key default gen_random_uuid(),
  email       text not null,
  role        text not null check (role in ('student','parent')),
  tutor_id    uuid references public.profiles(id) on delete cascade,
  student_id  uuid references public.profiles(id) on delete cascade,
  status      text not null default 'pending' check (status in ('pending','accepted')),
  created_at  timestamptz not null default now(),
  accepted_at timestamptz,

  -- A student invite points at a tutor; a parent invite points at a student.
  -- Exactly one, never both, never neither.
  constraint invite_target_matches_role check (
    (role = 'student' and tutor_id is not null and student_id is null) or
    (role = 'parent'  and student_id is not null and tutor_id is null)
  )
);

-- One pending invite per email address at a time. Without this, two pending
-- invites for the same person would make "which one do I accept?" ambiguous at
-- sign-in. Accepted invites are not covered, so history is kept.
create unique index invites_one_pending_per_email
  on public.invites (lower(email)) where status = 'pending';

create index invites_tutor_id_idx   on public.invites (tutor_id);
create index invites_student_id_idx on public.invites (student_id);

-- ---- progress --------------------------------------------------------------
-- Replaces the localStorage keys from APP_PLAN 4. One row per student, per
-- subject, per chapter.
create table public.progress (
  student_id          uuid not null references public.profiles(id) on delete cascade,
  subject_id          uuid not null references public.subjects(id) on delete cascade,
  chapter_slug        text not null,
  studied             boolean not null default false,
  quiz_best_score     integer not null default 0 check (quiz_best_score between 0 and 100),
  -- Counts of the auto-graded question types behind that score, per Section 10.
  -- Self-marked "short" answers are excluded from scoring and so are not counted.
  quiz_type_breakdown jsonb   not null default '{"mcq": 0, "code": 0}'::jsonb,
  last_active         timestamptz not null default now(),

  primary key (student_id, subject_id, chapter_slug)
);

-- ---- paper_attempts --------------------------------------------------------
-- Past papers are per-YEAR and global to the student, not per-chapter, so they
-- cannot live on `progress` without duplicating one list across every chapter
-- row. One row here = one paper the student has ticked off.
create table public.paper_attempts (
  student_id   uuid not null references public.profiles(id) on delete cascade,
  subject_id   uuid not null references public.subjects(id) on delete cascade,
  paper_id     text not null,                    -- e.g. 'icse-2023'
  attempted_at timestamptz not null default now(),

  primary key (student_id, subject_id, paper_id)
);

-- ---- daily_activity --------------------------------------------------------
-- Time-on-task, written by a 30s heartbeat that runs ONLY while the tab is
-- visible (Page Visibility API — APP_PLAN 11.4). Named activity_date rather
-- than `date` to avoid colliding with the SQL type name.
create table public.daily_activity (
  student_id     uuid not null references public.profiles(id) on delete cascade,
  subject_id     uuid not null references public.subjects(id) on delete cascade,
  activity_date  date not null default current_date,
  seconds_active integer not null default 0 check (seconds_active >= 0),

  primary key (student_id, subject_id, activity_date)
);

-- ---- doubts (APP_PLAN Section 12) -----------------------------------------
-- One question, one tutor reply, no threading.
create table public.doubts (
  id            uuid primary key default gen_random_uuid(),
  student_id    uuid not null references public.profiles(id) on delete cascade,
  subject_id    uuid not null references public.subjects(id) on delete cascade,
  chapter_slug  text not null,
  question_text text not null check (length(trim(question_text)) > 0),
  tutor_reply   text,
  status        text not null default 'open'
                check (status in ('open','replied','resolved','discuss')),
  created_at    timestamptz not null default now(),
  replied_at    timestamptz
);

create index doubts_student_id_idx on public.doubts (student_id);
create index doubts_status_idx     on public.doubts (status);


-- ============================================================================
-- 2. SEED DATA
-- ============================================================================
insert into public.subjects (slug, display_name)
values ('computer-applications', 'Computer Applications')
on conflict (slug) do nothing;


-- ============================================================================
-- 3. HELPER FUNCTIONS (used inside the RLS policies in section 4)
-- ============================================================================
-- WHY THESE EXIST — the single most important thing in this file.
--
-- An RLS policy on `profiles` that needs to ask "what is my role?" would have
-- to SELECT from `profiles` — which re-triggers the same policy, forever.
-- Postgres aborts with "infinite recursion detected in policy".
--
-- SECURITY DEFINER makes a function run as its OWNER instead of the caller, so
-- it bypasses RLS and the recursion never starts. That is a real privilege
-- escalation tool, so each one below is deliberately tiny, read-only, and
-- returns a single fact about the CURRENT user only — never arbitrary rows.
-- `set search_path = public` stops anyone shadowing the tables they reference.

-- The current user's role, or null if they have no profile yet.
create or replace function public.my_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'super_admin'
  )
$$;

-- For a parent: the id of the one student they are linked to.
create or replace function public.my_student_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select parent_of from public.profiles where id = auth.uid()
$$;

-- Is `target` a student on the CURRENT user's roster? (tutor check)
create or replace function public.is_my_student(target uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = target and tutor_id = auth.uid()
  )
$$;

-- The signed-in user's email, straight from their JWT.
create or replace function public.my_email()
returns text
language sql
stable
as $$
  select lower(nullif(current_setting('request.jwt.claims', true)::jsonb ->> 'email', ''))
$$;

-- ---------------------------------------------------------------------------
-- SUPER ADMIN ALLOWLIST  <<< EDIT THIS BEFORE YOUR FIRST SIGN-IN >>>
-- ---------------------------------------------------------------------------
-- APP_PLAN 11.3 says the Super Admin allowlist is hardcoded. It is listed here
-- in SQL — not only in app code — because this is the copy that actually
-- ENFORCES the rule. A list that lives only in the browser bundle can be
-- bypassed by calling the API directly with the public anon key, which would
-- let anyone make themselves a Super Admin.
--
-- Keep this in sync with src/config/superAdmins.ts (that copy is for UI only).
create or replace function public.is_super_admin_email(addr text)
returns boolean
language sql
immutable
as $$
  select lower(addr) in (
    'khushboojangle@gmail.com'
    -- add further addresses here, comma-separated, if you ever need a second
    -- Super Admin. Mirror any change in src/config/superAdmins.ts.
  )
$$;

-- Generates a short, human-readable pairing code.
-- Ambiguous characters (0/O, 1/I/L) are left out so a code read aloud or
-- written on paper does not get mistyped.
create or replace function public.gen_invite_code()
returns text
language plpgsql
as $$
declare
  alphabet text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  code     text;
  i        int;
begin
  loop
    code := '';
    for i in 1..6 loop
      code := code || substr(alphabet, floor(random() * length(alphabet))::int + 1, 1);
    end loop;
    -- Re-roll on the astronomically unlikely collision with either code column.
    exit when not exists (select 1 from public.tutors where invite_code = code)
          and not exists (select 1 from public.profiles where parent_invite_code = code);
  end loop;
  return code;
end
$$;


-- ============================================================================
-- 4. ROW LEVEL SECURITY
-- ============================================================================
-- Turn RLS on everywhere. Until a policy explicitly allows something, the
-- answer is no — a table with RLS enabled and zero policies returns zero rows,
-- which is the safe direction to fail.
alter table public.subjects       enable row level security;
alter table public.tutors         enable row level security;
alter table public.profiles       enable row level security;
alter table public.invites        enable row level security;
alter table public.progress       enable row level security;
alter table public.paper_attempts enable row level security;
alter table public.daily_activity enable row level security;
alter table public.doubts         enable row level security;

-- ---- subjects: shared reference data, readable by anyone signed in ---------
create policy subjects_read on public.subjects
  for select to authenticated
  using (true);

-- ---- tutors ---------------------------------------------------------------
-- A tutor reads and edits only their own row; Super Admin reads all.
-- Nobody reads other tutors' invite_codes: code redemption goes through the
-- redeem_invite_code() RPC below, which looks codes up with elevated rights.
create policy tutors_read_own on public.tutors
  for select to authenticated
  using (id = auth.uid() or public.is_super_admin());

create policy tutors_update_own on public.tutors
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- ---- profiles -------------------------------------------------------------
-- Note every clause below compares a COLUMN to auth.uid(), or calls one of the
-- SECURITY DEFINER helpers — never a plain sub-select on profiles, which would
-- recurse.
create policy profiles_read on public.profiles
  for select to authenticated
  using (
    id = auth.uid()                       -- yourself
    or tutor_id = auth.uid()              -- a tutor reading their roster
    or id = public.my_student_id()        -- a parent reading their one student
    or public.is_super_admin()            -- cross-tenant visibility
  );

-- Users may edit their own display_name. Role, tutor_id, parent_of and the
-- invite code are deliberately NOT editable here — they are set once by the
-- signup RPCs. The trigger below enforces that.
create policy profiles_update_own on public.profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- There is intentionally NO insert policy on profiles. All profile creation
-- goes through the RPCs in section 5, so nobody can insert themselves a row
-- with role = 'super_admin'.

create or replace function public.guard_profile_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- No auth.uid() means this is not a browser user: it is the SQL Editor, a
  -- migration, or a service_role key. Those are already trusted (RLS blocks
  -- anon entirely), and blocking them here would stop you fixing a bad row by
  -- hand — which is exactly what you need during setup.
  if auth.uid() is null then
    return new;
  end if;
  if public.is_super_admin() then
    return new;  -- support/moderation can fix rows
  end if;
  if new.role               is distinct from old.role
  or new.tutor_id           is distinct from old.tutor_id
  or new.parent_of          is distinct from old.parent_of
  or new.parent_invite_code is distinct from old.parent_invite_code then
    raise exception 'Only display_name can be changed on your own profile';
  end if;
  return new;
end
$$;

create trigger profiles_guard_update
  before update on public.profiles
  for each row execute function public.guard_profile_update();

-- ---- invites --------------------------------------------------------------
create policy invites_read on public.invites
  for select to authenticated
  using (
    tutor_id = auth.uid()                 -- tutor sees invites they sent
    or student_id = auth.uid()            -- student sees parent-invites they sent
    or lower(email) = public.my_email()   -- the invited person, at sign-in
    or public.is_super_admin()
  );

-- A tutor may invite a student; a student may invite a parent. The WITH CHECK
-- stops a student from inventing a student-invite onto someone else's roster.
create policy invites_create on public.invites
  for insert to authenticated
  with check (
    (role = 'student' and tutor_id = auth.uid()     and public.my_role() in ('tutor','super_admin'))
    or (role = 'parent' and student_id = auth.uid() and public.my_role() = 'student')
  );

create policy invites_delete_own on public.invites
  for delete to authenticated
  using (tutor_id = auth.uid() or student_id = auth.uid() or public.is_super_admin());

-- ---- progress -------------------------------------------------------------
-- The shape repeats for paper_attempts and daily_activity: the student owns the
-- rows, their tutor and their parent may read, Super Admin may read everything.
create policy progress_student_all on public.progress
  for all to authenticated
  using (student_id = auth.uid())
  with check (student_id = auth.uid());

create policy progress_read_by_others on public.progress
  for select to authenticated
  using (
    public.is_my_student(student_id)        -- their tutor
    or student_id = public.my_student_id()  -- their parent
    or public.is_super_admin()
  );

-- ---- paper_attempts -------------------------------------------------------
create policy paper_attempts_student_all on public.paper_attempts
  for all to authenticated
  using (student_id = auth.uid())
  with check (student_id = auth.uid());

create policy paper_attempts_read_by_others on public.paper_attempts
  for select to authenticated
  using (
    public.is_my_student(student_id)
    or student_id = public.my_student_id()
    or public.is_super_admin()
  );

-- ---- daily_activity -------------------------------------------------------
create policy daily_activity_student_all on public.daily_activity
  for all to authenticated
  using (student_id = auth.uid())
  with check (student_id = auth.uid());

create policy daily_activity_read_by_others on public.daily_activity
  for select to authenticated
  using (
    public.is_my_student(student_id)
    or student_id = public.my_student_id()
    or public.is_super_admin()
  );

-- ---- doubts (APP_PLAN 12.2) -----------------------------------------------
-- PARENTS ARE ABSENT FROM THESE POLICIES ON PURPOSE. A doubt is an academic
-- help channel between student and tutor, not a progress metric, so there is
-- no parent clause anywhere below — a parent querying this table gets nothing.
create policy doubts_student_read on public.doubts
  for select to authenticated
  using (student_id = auth.uid());

create policy doubts_student_create on public.doubts
  for insert to authenticated
  with check (student_id = auth.uid() and status = 'open' and tutor_reply is null);

create policy doubts_student_update on public.doubts
  for update to authenticated
  using (student_id = auth.uid())
  with check (student_id = auth.uid());

create policy doubts_tutor_read on public.doubts
  for select to authenticated
  using (public.is_my_student(student_id) or public.is_super_admin());

create policy doubts_tutor_update on public.doubts
  for update to authenticated
  using (public.is_my_student(student_id) or public.is_super_admin())
  with check (public.is_my_student(student_id) or public.is_super_admin());

-- RLS chooses which ROWS you may touch; it cannot stop you writing the wrong
-- COLUMN. Both student and tutor are the same database role (`authenticated`),
-- so column privileges can't separate them either. This trigger does:
-- a student may only move the status along a legal path and may never touch
-- the reply text; a tutor writes the reply.
create or replace function public.guard_doubt_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Same admin exemption as guard_profile_update above.
  if auth.uid() is null or public.is_super_admin() then
    return new;
  end if;

  -- The student who raised it.
  if auth.uid() = old.student_id then
    if new.tutor_reply is distinct from old.tutor_reply then
      raise exception 'A student cannot edit the tutor reply';
    end if;
    if new.question_text is distinct from old.question_text then
      raise exception 'A doubt cannot be reworded after it is submitted';
    end if;
    -- Legal student transitions, per APP_PLAN 12.1:
    --   replied -> resolved ("Understood")
    --   replied -> discuss  ("Let's discuss")
    --   discuss -> resolved (after the live conversation happened)
    if new.status <> old.status
       and not (
            (old.status = 'replied' and new.status in ('resolved','discuss'))
         or (old.status = 'discuss' and new.status = 'resolved')
       ) then
      raise exception 'A student cannot move a doubt from % to %', old.status, new.status;
    end if;
    return new;
  end if;

  -- The tutor whose roster the student is on.
  if public.is_my_student(old.student_id) then
    if new.student_id is distinct from old.student_id
    or new.question_text is distinct from old.question_text then
      raise exception 'A tutor may only write the reply';
    end if;
    if new.status <> old.status and new.status <> 'replied' then
      raise exception 'A tutor can only move a doubt to replied';
    end if;
    return new;
  end if;

  raise exception 'Not allowed to update this doubt';
end
$$;

create trigger doubts_guard_update
  before update on public.doubts
  for each row execute function public.guard_doubt_update();


-- ============================================================================
-- 5. SIGNUP RPCs
-- ============================================================================
-- Profile creation runs through these instead of a plain INSERT, for two
-- reasons: a direct insert policy would let someone set their own role to
-- 'super_admin', and code redemption has to read OTHER people's invite codes,
-- which RLS rightly forbids. SECURITY DEFINER lets these do both safely
-- because each one hardcodes exactly what it is willing to write.

-- Called immediately after Google sign-in, every time.
-- Returns the caller's profile, creating one only where APP_PLAN 11.3 says it
-- should be automatic: a Super Admin allowlist hit, or a pending email invite.
-- Otherwise returns needs_signup so the app can show "Join as Tutor / I have a
-- code". Invites take priority over codes, exactly as 11.3 specifies.
create or replace function public.ensure_profile()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  uid      uuid := auth.uid();
  addr     text := public.my_email();
  fallback text;
  existing public.profiles%rowtype;
  inv      public.invites%rowtype;
begin
  if uid is null then
    raise exception 'Not signed in';
  end if;

  fallback := coalesce(nullif(split_part(coalesce(addr, ''), '@', 1), ''), 'User');

  select * into existing from public.profiles where id = uid;
  if found then
    return jsonb_build_object('status','ok','role',existing.role);
  end if;

  -- 1. Super Admin allowlist.
  if public.is_super_admin_email(addr) then
    insert into public.profiles (id, role, display_name)
    values (uid, 'super_admin', fallback);
    -- 11.2: a Super Admin who also teaches has a tutors row too. Creating it
    -- up front means their own roster works without a second signup step.
    insert into public.tutors (id, display_name, invite_code)
    values (uid, fallback, public.gen_invite_code())
    on conflict (id) do nothing;
    return jsonb_build_object('status','ok','role','super_admin');
  end if;

  -- 2. Pending email invite for this exact address.
  select * into inv
  from public.invites
  where lower(email) = addr and status = 'pending'
  limit 1;

  if found then
    if inv.role = 'student' then
      insert into public.profiles (id, role, display_name, tutor_id, parent_invite_code)
      values (uid, 'student', fallback, inv.tutor_id, public.gen_invite_code());
    else
      -- Guard the same self-link case the code path blocks.
      if inv.student_id = uid then
        raise exception 'You cannot be your own parent';
      end if;
      insert into public.profiles (id, role, display_name, parent_of)
      values (uid, 'parent', fallback, inv.student_id);
    end if;

    update public.invites
      set status = 'accepted', accepted_at = now()
      where id = inv.id;

    return jsonb_build_object('status','ok','role',inv.role,'via','invite');
  end if;

  -- 3. No profile and no invite — the app shows the two-route signup screen.
  return jsonb_build_object('status','needs_signup');
end
$$;

-- "Join as Tutor" — no code required (APP_PLAN 11.3).
create or replace function public.join_as_tutor(p_display_name text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  uid  uuid := auth.uid();
  name text := nullif(trim(p_display_name), '');
  code text;
begin
  if uid is null then
    raise exception 'Not signed in';
  end if;
  if exists (select 1 from public.profiles where id = uid) then
    raise exception 'You already have a profile';
  end if;

  name := coalesce(name, nullif(split_part(coalesce(public.my_email(), ''), '@', 1), ''), 'Tutor');
  code := public.gen_invite_code();

  insert into public.profiles (id, role, display_name) values (uid, 'tutor', name);
  insert into public.tutors (id, display_name, invite_code) values (uid, name, code);

  return jsonb_build_object('status','ok','role','tutor','invite_code',code);
end
$$;

-- "I have a code" — one field. The code itself says which role you get:
-- a tutor's code makes you a student, a student's code makes you a parent.
create or replace function public.redeem_invite_code(p_code text, p_display_name text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  uid  uuid := auth.uid();
  code text := upper(trim(p_code));
  name text := nullif(trim(p_display_name), '');
  t_id uuid;
  s_id uuid;
begin
  if uid is null then
    raise exception 'Not signed in';
  end if;
  if exists (select 1 from public.profiles where id = uid) then
    raise exception 'You already have a profile';
  end if;

  name := coalesce(name, nullif(split_part(coalesce(public.my_email(), ''), '@', 1), ''), 'User');

  -- Does it match a tutor's roster code?
  select id into t_id from public.tutors where invite_code = code;
  if t_id is not null then
    -- APP_PLAN 11.3: block self-linking rather than silently allowing a decoy.
    if t_id = uid then
      raise exception 'That is your own tutor code — you cannot join your own roster';
    end if;
    insert into public.profiles (id, role, display_name, tutor_id, parent_invite_code)
    values (uid, 'student', name, t_id, public.gen_invite_code());
    return jsonb_build_object('status','ok','role','student');
  end if;

  -- Does it match a student's parent code?
  select id into s_id from public.profiles where parent_invite_code = code;
  if s_id is not null then
    if s_id = uid then
      raise exception 'You cannot be your own parent';
    end if;
    insert into public.profiles (id, role, display_name, parent_of)
    values (uid, 'parent', name, s_id);
    return jsonb_build_object('status','ok','role','parent');
  end if;

  raise exception 'That code was not recognised. Check it and try again.';
end
$$;

-- Only signed-in users may call these; none are reachable anonymously.
revoke all on function public.ensure_profile()               from public, anon;
revoke all on function public.join_as_tutor(text)            from public, anon;
revoke all on function public.redeem_invite_code(text, text) from public, anon;
grant execute on function public.ensure_profile()               to authenticated;
grant execute on function public.join_as_tutor(text)            to authenticated;
grant execute on function public.redeem_invite_code(text, text) to authenticated;


-- ============================================================================
-- TEARDOWN — only if you need to start the schema over.
-- Uncomment, run it, then run this file again from the top.
-- THIS DELETES ALL APP DATA (it does not delete Supabase Auth users; remove
-- those under Authentication → Users if you want a truly clean slate).
-- ============================================================================
-- drop table if exists public.doubts, public.daily_activity, public.paper_attempts,
--                      public.progress, public.invites, public.profiles,
--                      public.tutors, public.subjects cascade;
-- drop function if exists public.ensure_profile, public.join_as_tutor,
--                         public.redeem_invite_code, public.my_role,
--                         public.is_super_admin, public.my_student_id,
--                         public.is_my_student, public.my_email,
--                         public.is_super_admin_email, public.gen_invite_code,
--                         public.guard_profile_update, public.guard_doubt_update cascade;
