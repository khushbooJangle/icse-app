-- ============================================================================
-- Migration 002 — time-on-task heartbeat
--
-- RUN THIS ONCE: Supabase dashboard -> SQL Editor -> New query -> paste -> Run.
-- Safe to run more than once (create or replace).
--
-- Everything else in stage 3 is plain queries; this exists because "add 30 to
-- whatever is already there" cannot be expressed through the JS client without
-- reading the row first, and a read-then-write loses counts when two tabs
-- overlap.
-- ============================================================================

create or replace function public.bump_activity(p_subject_id uuid, p_seconds integer)
returns void
language plpgsql
-- SECURITY INVOKER (the default) on purpose: this runs as the CALLER, so the
-- daily_activity RLS policy still applies and a student can only ever add time
-- to their own row. The SECURITY DEFINER helpers elsewhere bypass RLS; this one
-- must not.
security invoker
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Not signed in';
  end if;

  -- The client sends a fixed 30s tick. Anything outside a sane range is either
  -- a bug or someone trying to inflate their time, so refuse it rather than
  -- trusting whatever number arrives.
  if p_seconds is null or p_seconds <= 0 or p_seconds > 300 then
    raise exception 'Implausible heartbeat interval: %', p_seconds;
  end if;

  insert into public.daily_activity (student_id, subject_id, activity_date, seconds_active)
  values (auth.uid(), p_subject_id, current_date, p_seconds)
  on conflict (student_id, subject_id, activity_date)
  do update set seconds_active = public.daily_activity.seconds_active + excluded.seconds_active;
end
$$;

revoke all on function public.bump_activity(uuid, integer) from public, anon;
grant execute on function public.bump_activity(uuid, integer) to authenticated;
