-- ===========================================================================
--  A.O.A — counselling requests
--
--  Adds the table behind the /counselling form. Run it in the Supabase SQL
--  editor:  SQL Editor -> New query -> paste -> Run. Safe to run more than
--  once.
--
--  THESE ROWS ARE THE MOST SENSITIVE DATA ON THE SITE.
--  Someone writing here may be describing a crisis of faith, a marriage, a
--  family situation, or their mental health, and may be a child. Treat this
--  table accordingly:
--    - it is insert-only for the public, exactly like enquiries;
--    - nothing about it is ever rendered on a public page;
--    - delete rows once they have been dealt with, rather than keeping them.
-- ===========================================================================

create table if not exists public.counselling_requests (
  id             uuid primary key default gen_random_uuid(),

  -- A first name is enough. People asking for help should not have to
  -- identify themselves fully before they can ask.
  name           text not null check (char_length(name) between 1 and 120),

  -- How to reply, and where. Kept as two columns rather than guessing from
  -- the format of the string.
  contact_method text not null default 'email'
                 check (contact_method in ('email', 'whatsapp')),
  contact_detail text not null check (char_length(contact_detail) between 3 and 320),

  topic          text          check (topic is null or char_length(topic) <= 120),

  -- A request, not a promise. The site says plainly that it cannot always be
  -- met, and the admin sees the preference so it can be honoured when possible.
  prefer_female  boolean not null default false,

  message        text not null check (char_length(message) between 1 and 4000),

  status         text not null default 'new'
                 check (status in ('new', 'answered', 'closed')),

  created_at     timestamptz not null default now()
);

create index if not exists counselling_requests_created_at_idx
  on public.counselling_requests (created_at desc);

-- ---------------------------------------------------------------------------
-- Row level security
--
-- Public may INSERT. Nobody may SELECT, UPDATE or DELETE except the server,
-- which uses the service-role key and is gated by the admin session check in
-- src/lib/admin/actions.ts. The anon key the public site reads with never
-- satisfies is_admin(), so every policy below denies it.
-- ---------------------------------------------------------------------------
alter table public.counselling_requests enable row level security;

drop policy if exists "anyone may ask for counselling" on public.counselling_requests;
create policy "anyone may ask for counselling"
  on public.counselling_requests for insert with check (true);

drop policy if exists "only admins read counselling" on public.counselling_requests;
create policy "only admins read counselling"
  on public.counselling_requests for select using (public.is_admin());

drop policy if exists "only admins update counselling" on public.counselling_requests;
create policy "only admins update counselling"
  on public.counselling_requests for update
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "only admins delete counselling" on public.counselling_requests;
create policy "only admins delete counselling"
  on public.counselling_requests for delete using (public.is_admin());

-- ===========================================================================
--  CHECK IT WORKED — should return one row with rowsecurity = true:
--
--    select tablename, rowsecurity from pg_tables
--    where schemaname = 'public' and tablename = 'counselling_requests';
-- ===========================================================================
