-- ===========================================================================
--  ADDS THE MISSING `enquiries` TABLE
--
--  Run this on its own in  SQL Editor -> New query.
--
--  WHY YOU NEED IT
--  The "Enroll now" form writes to public.enquiries. That table was added to
--  schema.sql after your first run, and the copy that was pasted back in did
--  not include it, so the form has nowhere to write and shows
--  "Something went wrong saving that."
--
--  This is the same SQL that is already inside schema.sql, pulled out so it
--  runs on its own. Safe to run more than once.
--  Requires public.is_admin(), which PART 1 of schema.sql created.
-- ===========================================================================

create table if not exists public.enquiries (
  id         uuid primary key default gen_random_uuid(),
  email      text not null,
  note       text,
  handled    boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.enquiries enable row level security;

-- The public may INSERT (that is the whole point of the form) but may NOT
-- read. Enquiries hold people's email addresses, so select/update/delete are
-- admin-only. Without the insert policy the form fails silently for everyone.
drop policy if exists "anyone may submit an enquiry" on public.enquiries;
create policy "anyone may submit an enquiry"
  on public.enquiries for insert with check (true);

drop policy if exists "only admins read enquiries" on public.enquiries;
create policy "only admins read enquiries"
  on public.enquiries for select using (public.is_admin());

drop policy if exists "only admins update enquiries" on public.enquiries;
create policy "only admins update enquiries"
  on public.enquiries for update
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "only admins delete enquiries" on public.enquiries;
create policy "only admins delete enquiries"
  on public.enquiries for delete using (public.is_admin());

-- PostgREST caches the schema. Creating a table through the SQL editor
-- normally reloads it automatically, but ask explicitly so a stale cache
-- cannot leave the new table returning 404.
notify pgrst, 'reload schema';

-- ---------------------------------------------------------------------------
-- Check it worked. This should return one row, named "enquiries":
--
--   select table_name from information_schema.tables
--   where table_schema = 'public' and table_name = 'enquiries';
--
-- And this should list four policies:
--
--   select policyname, cmd from pg_policies
--   where schemaname = 'public' and tablename = 'enquiries';
-- ---------------------------------------------------------------------------
