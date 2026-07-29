-- ===========================================================================
--  A.O.A — registrations
--
--  Adds the table behind the /register form. Run this in the Supabase SQL
--  editor the same way you ran schema.sql:  SQL Editor -> New query -> paste
--  -> Run. Safe to run more than once.
--
--  Until you run it, /register will accept nothing and will tell the visitor
--  to email instead — it fails visibly rather than silently losing someone.
-- ===========================================================================

create table if not exists public.registrations (
  id           uuid primary key default gen_random_uuid(),

  -- Who is filling the form in.
  full_name    text not null check (char_length(full_name) between 1 and 120),
  email        text not null check (char_length(email) between 3 and 320),
  phone        text not null check (char_length(phone) between 3 and 40),
  location     text          check (location is null or char_length(location) <= 120),

  -- Who the classes are actually for. 'self' means the two are the same
  -- person, in which case student_name and student_age stay null.
  student_type text not null default 'self'
               check (student_type in ('self', 'child', 'other')),
  student_name text          check (student_name is null or char_length(student_name) <= 120),
  student_age  text          check (student_age is null or char_length(student_age) <= 40),

  -- Free text rather than a foreign key to programs: programmes can be
  -- renamed or retired in the admin, and a registration should keep saying
  -- what the person actually chose on the day.
  program      text          check (program is null or char_length(program) <= 160),
  language     text not null default 'English'
               check (language in ('English', 'Arabic', 'Yoruba')),
  level        text          check (level is null or char_length(level) <= 80),
  availability text          check (availability is null or char_length(availability) <= 400),
  note         text          check (note is null or char_length(note) <= 2000),

  -- Where the person has got to, tracked from the admin.
  status       text not null default 'new'
               check (status in ('new', 'contacted', 'enrolled', 'declined')),

  created_at   timestamptz not null default now()
);

-- Newest first is the only order the admin list uses.
create index if not exists registrations_created_at_idx
  on public.registrations (created_at desc);

-- ---------------------------------------------------------------------------
-- Row level security
--
-- Same shape as `enquiries`, and for the same reason: anyone may submit one,
-- nobody but the server may read them back. These rows hold names, email
-- addresses, phone numbers and children's ages, so a leak here is a real one.
--
-- The site reads with the anon key, which never satisfies is_admin(), so the
-- select/update/delete policies below deny it. The admin screens go through
-- the server using the service-role key, which bypasses RLS entirely and is
-- gated by the session check in src/lib/admin/actions.ts instead.
-- ---------------------------------------------------------------------------
alter table public.registrations enable row level security;

drop policy if exists "anyone may register" on public.registrations;
create policy "anyone may register"
  on public.registrations for insert with check (true);

drop policy if exists "only admins read registrations" on public.registrations;
create policy "only admins read registrations"
  on public.registrations for select using (public.is_admin());

drop policy if exists "only admins update registrations" on public.registrations;
create policy "only admins update registrations"
  on public.registrations for update
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "only admins delete registrations" on public.registrations;
create policy "only admins delete registrations"
  on public.registrations for delete using (public.is_admin());

-- ===========================================================================
--  CHECK IT WORKED
--
--  Run this afterwards. It should return one row, with rowsecurity = true:
--
--    select tablename, rowsecurity from pg_tables
--    where schemaname = 'public' and tablename = 'registrations';
-- ===========================================================================
