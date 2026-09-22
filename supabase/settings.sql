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
  ('about_kicker',         'ABOUT'),
  ('about_heading',        'Halo, saya Farhan.'),
  ('about_role',           'Creative Designer · Indonesia'),
  ('about_bio',            'Enam tahun mengerjakan identitas visual untuk brand kecil hingga menengah: branding, logo, jersey & apparel, serta kebutuhan konten digital. Tiga hal yang selalu saya pegang: clarity, character, consistency.'),
  ('about_skills',         E'Adobe Illustrator\nAdobe Photoshop\nInDesign\nFigma\nCanva\nCorelDRAW'),
  ('about_stat_value',     '98'),
  ('about_stat_suffix',    '%'),
  ('about_stat_label',     'Klien kembali untuk project berikutnya.'),
  ('about_principles_title','Principles'),
  ('about_principles',     E'Clarity — pesan terbaca lebih dulu\nCharacter — punya ciri, bukan template\nConsistency — konsisten di semua media'),
  ('featured_kicker',      'FEATURED WORK'),
  ('featured_title_1',     'ARVA'),
  ('featured_title_2',     'Identity'),
  ('featured_intro',       'Brand identity lengkap untuk studio kreatif ARVA: logo suite, palet warna, tipografi, stationery, signage, dan aset digital.'),
  ('featured_main_badge',  'Featured · Branding'),
  ('featured_main_title',  'ARVA — Brand Identity System'),
  ('featured_main_desc',   'Logo suite, palet warna, tipografi, dan guideline dalam satu papan identitas.'),
  ('featured_card1_badge', 'Stationery'),
  ('featured_card1_title', 'Business Card, Letterhead & Tag'),
  ('featured_card2_badge', 'Environmental'),
  ('featured_card2_title', 'Blade Signage & Facade'),
  ('featured_card3_badge', 'Digital'),
  ('featured_card3_title', 'Social Feed System'),
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
