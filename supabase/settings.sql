-- ============================================================
-- site_settings — teks & tautan yang bisa diatur dari panel admin
-- (dipakai section Contact untuk sekarang; tinggal tambah key kalau
--  nanti mau bagian lain ikut bisa diatur)
-- Idempotent: aman dijalankan berulang.
-- ============================================================

create table if not exists public.site_settings (
  key        text primary key,
  value      text not null default '',
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

drop policy if exists "public read settings" on public.site_settings;
create policy "public read settings"
  on public.site_settings for select
  using (true);

grant usage on schema public to anon, authenticated;
grant select on public.site_settings to anon, authenticated;

-- ------------------------------------------------------------
-- Nilai awal = teks yang sekarang masih hardcode di ContactFooter
-- ------------------------------------------------------------
insert into public.site_settings (key, value) values
  ('contact_kicker',       'CONTACT'),
  ('contact_heading_1',    'Mari kerjakan'),
  ('contact_heading_2',    'project Anda.'),
  ('contact_description',  'Ceritakan kebutuhan brand Anda, dan saya bantu susun arah visualnya. Balasan biasanya di hari yang sama.'),
  ('contact_email',        'hello@farhanraka.design'),
  ('social_instagram',     '#'),
  ('social_behance',       '#'),
  ('social_whatsapp',      '#'),
  ('footer_left',          '© 2026 Farhan Raka.K. All rights reserved.'),
  ('footer_right',         'Creative Designer · Visual Design · Branding')
on conflict (key) do nothing;
