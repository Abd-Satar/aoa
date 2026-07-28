-- ===========================================================================
--  ONE-TIME CORRECTION
--
--  Run this once, in  SQL Editor -> New query, after re-running schema.sql.
--
--  WHY THIS EXISTS
--  The seed block in schema.sql uses `on conflict (key) do nothing`, so that
--  re-running the schema can never overwrite something you have since edited
--  in the admin. The trade-off is that rows seeded by an EARLIER run keep
--  their old values forever.
--
--  Your project was seeded before the email, the YouTube channel and the
--  house style (no em dashes) were settled, so those rows are stale and the
--  database is overriding the corrected values in the repository.
--
--  This is safe to run more than once. It only touches these six keys.
-- ===========================================================================

insert into public.settings (key, value) values
  ('contact_email',  'satarmoyosore@gmail.com'),
  ('youtube_url',    'https://youtube.com/@satarmoyosore6147'),
  ('instagram_url',  'https://www.instagram.com/abdsatar_moyosore'),
  ('youtube_text',   'Every Friday our teachers publish a short tafsīr of one page. Free, no enrolment needed.'),
  ('ayah_source',    'Sūrat al-Qamar, 54:17'),
  ('ayah_text',      '“And We have certainly made the Qur''an easy to remember. So is there any who will remember?”')
on conflict (key) do update set value = excluded.value;

-- Check the result:
--   select key, value from public.settings order by key;
--
-- Anything else you want to change from here on, change in the admin at
-- /admin/settings rather than in SQL.
