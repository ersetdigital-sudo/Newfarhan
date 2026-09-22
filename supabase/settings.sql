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
  ('footer_right',         'Creative Designer · Visual Design · Branding'),

  -- Halaman /project: hero, galeri, dan Case Study (tab "Beranda & Project")
  ('project_eyebrow',      'Brand Identity System · 2025'),
  ('project_title',        'ARVA'),
  ('project_intro',        'Identitas visual menyeluruh: logo suite, sistem warna dan tipografi, stationery, signage toko, sampai template konten sosial media yang bisa dijalankan sendiri oleh tim.'),
  ('project_meta',         E'Klien|ARVA\nLayanan|Identity & Brand System\nDurasi|6 minggu\nPeran|Designer & Art Direction'),
  ('gallery_kicker',       'GALLERY'),
  ('gallery_title',        'Galeri'),
  ('gallery_hint',         'Klik gambar untuk lihat versi besar'),
  ('case_kicker',          'CASE STUDY'),
  ('case_title_1',         'From idea'),
  ('case_title_2',         'to visual.'),
  ('case_steps',           E'Discover\nConcept\nDesign & Refine'),
  ('case_palette',         E'#14131A Ink\n#F26A21 Orange\n#F5B324 Amber\n#F7F1E7 Cream'),
  ('case_palette_label',   'Palet final brand'),
  ('case_blocks',          E'Discover\nARVA sudah punya pelanggan tetap, tapi tampilannya belum satu suara: logo dipakai dalam tiga versi berbeda, warna toko dan warna konten tidak sama, dan setiap materi promosi dibuat ulang dari nol. Audit awal memetakan seluruh titik sentuh brand lalu menetapkan satu arah: tenang, hangat, dan terlihat mapan.\n\nConcept\nArah visual dibangun dari kombinasi bentuk geometris sederhana dan palet ink–orange–amber di atas dasar cream. Hasilnya satu sistem yang rapi: primary logo, monogram, versi horizontal, aturan ruang kosong, dan pasangan tipografi untuk judul dan teks panjang.\n\nDesign & Refine\nSistem diturunkan ke materi nyata: stationery suite siap cetak, signage dan facade toko, serta template feed sosial media yang bisa diisi sendiri oleh tim. Semua aturan dirangkum dalam brand guideline 18 halaman beserta file siap produksi.'),
  ('case_stats',           E'40|%|Engagement naik\n18||Halaman guideline\n24||Titik sentuh brand'),
  ('case_quote',           'Sekarang brand kami kelihatan rapi di mana pun dipasang, dan timnya gampang ikut aturannya.'),
  ('case_quote_by',        '— Dimas, owner ARVA')
on conflict (key) do nothing;
