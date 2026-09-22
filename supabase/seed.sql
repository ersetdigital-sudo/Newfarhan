-- ============================================================
-- Seed: isi database dengan konten yang sekarang masih hardcode
-- di src/data/portfolio.ts, biar site nggak pernah kosong.
-- Idempotent: pakai on conflict do nothing.
-- ============================================================

insert into public.portfolio_items
  (slug, title, category, subtitle, description, image_url, image_alt, sort_order)
values
  ('nexus-fc', 'Nexus FC — Away Kit', 'apparel', 'Jersey & Apparel',
   'Away kit untuk klub semi-pro: artwork siap produksi, mockup depan-belakang, dan aturan penempatan nomor serta sponsor.',
   '/images/132bd8bb-ae48-44cf-b43f-5dd97e720f23.png', 'Nexus FC — away kit', 1),

  ('the-arrival', 'The Arrival — Poster Campaign', 'poster', 'Banner & Poster',
   'Poster campaign untuk event desain: tipografi besar, komposisi geometris tajam, dan file siap cetak ukuran A1.',
   '/images/cc73ed0e-0a76-449d-8c46-204beb344c96.png', 'The Arrival — poster campaign', 2),

  ('urban-archetype', 'Urban Archetype — Apparel', 'apparel', 'Jersey & Apparel',
   'Seri apparel hoodie dan tee dengan artwork grafis, label jahit, serta hang tag yang satu bahasa visual.',
   '/images/fc0d4e32-6788-4c4c-9865-e36c196b516e.png', 'Urban Archetype — apparel', 3),

  ('verde-botanica', 'Verde Botanica — Packaging', 'branding', 'Branding',
   'Identitas dan kemasan skincare botanis: label bottle, karton sekunder, dan panduan foto produk.',
   '/images/9f5ca154-2407-4b03-8cd2-a5cb95e446f8.png', 'Verde Botanica — packaging', 4),

  ('verde-logo', 'Verde — Logo Presentation', 'logo', 'Logo Design',
   'Identitas Verde: logo daun minimalis, wordmark sans-serif berspasi lebar, versi light-dark, app icon, serta penerapan di kartu nama dan cetak emboss.',
   '/images/1fc73f62-8d18-4caa-b9e7-aa026d06f1b5.png', 'Verde — logo presentation', 5),

  ('halcyon-logo', 'Halcyon — Logo & Identity', 'logo', 'Logo Design',
   'Identitas Halcyon: wordmark serif dengan ikon spark, monogram H, versi light–dark–navy, palet navy–gold–cream, serta penerapan di kartu nama dan signage.',
   '/images/9c7784d6-e8ed-41b3-a14b-c56300b96634.png', 'Halcyon — logo & identity', 6),

  ('oos-nexa', 'OOS NEXA — Brand Identity', 'logo', 'Logo Design',
   'Brand identity OOS NEXA: wordmark custom bersudut tajam dengan chevron oranye, ikon/mark dan secondary mark, palet Nexa Orange–Deep Black–Slate–Light Gray, tipografi Montserrat, plus penerapan kartu nama dan signage.',
   '/images/c8c9ce26-e0de-426b-a119-c32add5bd506.png', 'OOS NEXA — brand identity', 7),

  ('carousel-content', 'Carousel Content — Studio', 'social', 'Social Media',
   'Template carousel Instagram: grid konsisten, hierarki teks jelas, dan mudah diisi ulang oleh tim internal.',
   '/images/638cf11f-871e-492f-be29-8d351786f821.png', 'Carousel content — studio', 8),

  ('kopi-lantai', 'Kopi Lantai — Coffee Branding', 'branding', 'Branding',
   'Branding kedai kopi: logo, kemasan biji, cup, dan material toko dengan nuansa kraft–terracotta.',
   '/images/4509d617-b611-4cf0-b10f-44c1dfc75cec.png', 'Kopi Lantai — coffee branding', 9),

  ('merch-set', 'Merch Set — Cap, Tote, Socks', 'apparel', 'Jersey & Apparel',
   'Paket merchandise brand: cap bordir, tote sablon, dan kaos kaki custom dalam satu palet.',
   '/images/59a97444-7d42-4900-a463-56189503f115.png', 'Merch set — cap, tote, socks', 10),

  ('halcyon-billboard', 'Halcyon — Billboard Campaign', 'poster', 'Banner & Poster',
   'Kampanye billboard untuk brand finansial: headline pendek, kontras tinggi, tetap terbaca dari kejauhan.',
   '/images/3f3828ce-ff97-4bc8-a617-14e97bfa93ab.png', 'Halcyon — billboard campaign', 11)
on conflict (slug) do nothing;

-- ------------------------------------------------------------
-- Slot foto tetap. Rasio = kontrak layout, jangan diubah admin.
-- ------------------------------------------------------------
insert into public.site_images (slot, image_url, label, alt, aspect)
values
  ('featured_main',           '/images/269ea28f-c1ae-4aaf-9557-277451504028.png', '',              'ARVA — brand identity & guidelines board', '1:1'),
  ('featured_stationery',     '/images/80931dd2-bdaa-4375-809d-307fa7ccf0e0.png', 'Stationery',    'ARVA — stationery suite',                  '2:1'),
  ('featured_environmental',  '/images/6b73f91c-313e-4ee0-b3ae-5988bf16bf95.png', 'Environmental', 'ARVA — signage & facade',                  '2:1'),
  ('featured_digital',        '/images/d70331f8-fda6-4948-a310-7da323f5f60b.png', 'Digital',       'ARVA — social feed system',                '2:1'),
  ('project_cover',           '/images/269ea28f-c1ae-4aaf-9557-277451504028.png', '',              'ARVA — brand identity & guidelines board', '2:1'),
  ('project_gallery_1',       '/images/80931dd2-bdaa-4375-809d-307fa7ccf0e0.png', 'Stationery',    'ARVA — stationery suite',                  '16:9'),
  ('project_gallery_2',       '/images/d70331f8-fda6-4948-a310-7da323f5f60b.png', 'Social',        'ARVA — social feed system',                '5:6'),
  ('project_gallery_3',       '/images/6b73f91c-313e-4ee0-b3ae-5988bf16bf95.png', 'Environmental', 'ARVA — signage & facade',                  '2.6:1'),
  ('profile',                 '/images/c98c49c7-b8f7-4763-ba04-805ebfb930e0.png', '',              'Farhan Raka.K',                            '1:1')
on conflict (slot) do nothing;
