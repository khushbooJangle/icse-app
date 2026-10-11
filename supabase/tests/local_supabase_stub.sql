-- Minimal stand-ins for the Supabase-managed pieces, so schema.sql can be
-- executed against a plain local Postgres to check it actually parses and runs.
-- Throwaway only — never part of the app.

create extension if not exists pgcrypto;

-- Supabase ships these roles; plain Postgres does not.
do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'anon') then
    create role anon nologin;
  end if;
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then
    create role authenticated nologin;
  end if;
end $$;

create schema if not exists auth;

create table if not exists auth.users (
  id    uuid primary key default gen_random_uuid(),
  email text unique
);

-- Supabase derives these from the request JWT. Here they read a GUC we can set
-- by hand in the tests below.
create or replace function auth.uid()
returns uuid
language sql
stable
as $$
  select nullif(current_setting('test.uid', true), '')::uuid
$$;
