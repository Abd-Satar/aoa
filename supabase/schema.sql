-- ===========================================================================
--  A.O.A — As-Sattar Online Academy
--  Database schema for the admin-editable content.
--
--  HOW TO RUN THIS
--  1. Create a project at https://supabase.com and wait until it finishes
--     setting up (the dashboard stops saying "Setting up project").
--  2. Open the project, go to  SQL Editor  ->  New query
--  3. Paste this whole file in and press Run
--  4. Then follow "GRANTING YOURSELF ADMIN" at the bottom
--
--  Safe to run more than once — everything is IF NOT EXISTS / OR REPLACE.
--
--  IF "Run" FAILS WITH  Failed to fetch (api.supabase.com)
--  That is your browser not reaching Supabase — no SQL ran, nothing is
--  half-applied, and it is safe to try again. In order:
--    a. Press Run again. It is often a one-off.
--    b. Check the project has finished provisioning, and is not paused.
--    c. Turn off ad-blocking / privacy extensions for supabase.com, or open
--       the dashboard in a private window. These commonly block the API.
--    d. Off any VPN or company network? Try another connection.
--    e. Still failing: run it in parts. The file is divided into PART 1..5
--       below. Select one part with the mouse and press Run — the SQL editor
--       executes only the selected text. Do them in order. Whichever part
--       fails is then the one to send me.
-- ===========================================================================

-- ###########################################################################
-- PART 1 of 5 — who is allowed to edit
-- ###########################################################################

-- ---------------------------------------------------------------------------
-- Who is allowed to edit the site.
--
-- Being able to log in is NOT enough. A row must exist here for the account
-- as well, so an accidental public sign-up can never write content.
-- ---------------------------------------------------------------------------
create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  email      text,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

-- Used by every policy below. SECURITY DEFINER so it can read `admins`
-- without the caller needing rights on that table.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.admins a where a.user_id = auth.uid()
  );
$$;

drop policy if exists "admins readable by admins" on public.admins;
create policy "admins readable by admins"
  on public.admins for select
  using (public.is_admin());

-- ###########################################################################
-- PART 2 of 5 — the content tables
-- ###########################################################################

-- ---------------------------------------------------------------------------
-- Content tables
--
-- Shared conventions:
--   sort_order  lower shows first
--   published   false hides it from the public site but keeps it in admin
--   slug        the URL segment, where the thing has its own page
-- ---------------------------------------------------------------------------

create table if not exists public.teachers (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  name        text not null,
  title       text,
  role        text not null default '',
  credentials text[] not null default '{}',
  body        text[] not null default '{}',
  image_url   text,
  placeholder text not null default 'Portrait',
  sort_order  int  not null default 0,
  published   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.programs (
  id         uuid primary key default gen_random_uuid(),
  kicker     text not null default '',
  title      text not null,
  body       text not null default '',
  meta       text not null default '',
  sort_order int  not null default 0,
  published  boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.faqs (
  id         uuid primary key default gen_random_uuid(),
  question   text not null,
  answer     text not null default '',
  sort_order int  not null default 0,
  published  boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Stories of the prophets and other readings.
create table if not exists public.stories (
  id         uuid primary key default gen_random_uuid(),
  slug       text not null unique,
  title      text not null,
  audience   text not null default 'everyone'
             check (audience in ('children', 'adults', 'everyone')),
  summary    text not null default '',
  source     text,
  -- Markdown-ish body: `## ` headings, `> ` quotes, blank line between paras.
  content    text not null default '',
  sort_order int  not null default 0,
  published  boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Student testimonials. Only publish with the student's permission.
create table if not exists public.testimonials (
  id         uuid primary key default gen_random_uuid(),
  quote      text not null,
  source     text not null default '',
  sort_order int  not null default 0,
  published  boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Single-row-per-key store for contact details, the āyah, YouTube strip, etc.
create table if not exists public.settings (
  key        text primary key,
  value      text not null default '',
  updated_at timestamptz not null default now()
);

-- Enrolment enquiries submitted from the site's "Enroll now" form.
--
-- Unlike every other table here, the PUBLIC may insert (that is the whole
-- point) but may NOT read. Enquiries contain people's email addresses, so
-- select/update/delete are admin-only — see PART 4.
create table if not exists public.enquiries (
  id         uuid primary key default gen_random_uuid(),
  email      text not null,
  note       text,
  handled    boolean not null default false,
  created_at timestamptz not null default now()
);

-- ###########################################################################
-- PART 3 of 5 — keep updated_at current
-- ###########################################################################
-- ---------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare t text;
begin
  foreach t in array array['teachers','programs','faqs','stories','testimonials','settings']
  loop
    execute format('drop trigger if exists touch_%1$s on public.%1$s', t);
    execute format(
      'create trigger touch_%1$s before update on public.%1$s
       for each row execute function public.touch_updated_at()', t);
  end loop;
end $$;

-- ###########################################################################
-- PART 4 of 5 — security rules  (needs PART 1 and PART 2)
-- ###########################################################################

-- ---------------------------------------------------------------------------
-- Row level security
--
-- Anyone (including logged-out visitors) may READ published rows.
-- Only accounts listed in `admins` may read drafts or write anything.
-- ---------------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array['teachers','programs','faqs','stories','testimonials']
  loop
    execute format('alter table public.%I enable row level security', t);

    execute format('drop policy if exists "public reads published" on public.%I', t);
    execute format(
      'create policy "public reads published" on public.%I
       for select using (published = true or public.is_admin())', t);

    execute format('drop policy if exists "admins write" on public.%I', t);
    execute format(
      'create policy "admins write" on public.%I
       for all using (public.is_admin()) with check (public.is_admin())', t);
  end loop;
end $$;

-- Enquiries: write-only for the public, readable only by admins.
alter table public.enquiries enable row level security;

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

alter table public.settings enable row level security;

drop policy if exists "settings readable by all" on public.settings;
create policy "settings readable by all"
  on public.settings for select using (true);

drop policy if exists "settings written by admins" on public.settings;
create policy "settings written by admins"
  on public.settings for all
  using (public.is_admin()) with check (public.is_admin());

-- ###########################################################################
-- PART 5 of 5 — starting values  (needs PART 2)
-- ###########################################################################

-- ---------------------------------------------------------------------------
-- Seed: the settings the site reads. Values here match what is currently
-- hard-coded, so nothing changes until you edit them in the admin.
-- ---------------------------------------------------------------------------
insert into public.settings (key, value) values
  ('contact_email',  'satarmoyosore@gmail.com'),
  ('contact_phone',  '+234 703 522 6583'),
  ('contact_phone_href', '+2347035226583'),
  ('youtube_url',    'https://youtube.com/@satarmoyosore6147'),
  ('instagram_url',  'https://www.instagram.com/abdsatar_moyosore'),
  ('youtube_text',   'Every Friday our teachers publish a short tafsīr of one page — free, no enrolment needed.'),
  ('youtube_label',  'Watch the weekly series'),
  ('ayah_arabic',    'وَلَقَدْ يَسَّرْنَا ٱلْقُرْءَانَ لِلذِّكْرِ فَهَلْ مِن مُّدَّكِرٍ'),
  ('ayah_text',      '“And We have certainly made the Qur''an easy to remember. So is there any who will remember?”'),
  ('ayah_source',    '— Sūrat al-Qamar, 54:17')
on conflict (key) do nothing;

-- ===========================================================================
--  GRANTING YOURSELF ADMIN
--
--  1. In Supabase go to  Authentication -> Users -> Add user
--     Create one with your email and a password, and tick
--     "Auto Confirm User".
--
--  2. Run this, with your email in place of the one below:
--
--       insert into public.admins (user_id, email)
--       select id, email from auth.users where email = 'you@example.com'
--       on conflict (user_id) do nothing;
--
--  3. Sign in at  /admin/login
--
--  To revoke someone, delete their row from public.admins — they keep the
--  ability to log in but can no longer read drafts or write anything.
-- ===========================================================================
