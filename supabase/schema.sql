-- ============================================================
-- Portfolio CMS — schema
-- Project: "new farhan" (drkwgptcgvfxtpixwnfk)
-- Idempotent: aman dijalankan berulang.
-- ============================================================

-- ------------------------------------------------------------
-- 1. portfolio_items — kartu di grid "Selected Works"
--    Geometri kartu dikunci CSS (4:5), jadi tabel ini cuma
--    nyimpen konten + urutan. Ganti foto = nggak rusak layout.
-- ------------------------------------------------------------
create table if not exists public.portfolio_items (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  title       text not null,
  -- Kategori sengaja TANPA check constraint: daftarnya sekarang diatur dari
  -- panel admin dan dijaga lewat FOREIGN KEY ke tabel `categories`
  -- (lihat categories.sql).
  category    text not null,
  subtitle    text not null default '',   -- label kecil di kartu, mis. "Jersey & Apparel"
  description text not null default '',   -- isi popup quick view
  image_url   text not null,              -- "/images/x.png" atau URL Storage
  image_alt   text not null default '',
  sort_order  integer not null default 0,
  published   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists portfolio_items_order_idx
  on public.portfolio_items (published, sort_order, created_at);

-- ------------------------------------------------------------
-- 2. site_images — slot foto tetap (homepage, /project, About)
--    Tiap slot punya rasio yang dikunci CSS, jadi admin cuma
--    bisa GANTI gambar, nggak bisa ngubah ukuran kotaknya.
-- ------------------------------------------------------------
create table if not exists public.site_images (
  slot       text primary key,
  image_url  text not null,
  label      text not null default '',
  alt        text not null default '',
  aspect     text not null default '4:5',
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 3. RLS — publik cuma boleh BACA. Tulis hanya lewat
--    service_role (dipakai server /admin), yang bypass RLS.
--
--    Catatan: Supabase di sini HANYA menyimpan data. File gambarnya
--    disimpan di Cloudinary (lihat src/lib/cloudinary.ts), jadi nggak
--    ada Storage bucket yang perlu dibuat.
-- ------------------------------------------------------------
alter table public.portfolio_items enable row level security;
alter table public.site_images    enable row level security;

drop policy if exists "public read published items" on public.portfolio_items;
create policy "public read published items"
  on public.portfolio_items for select
  using (published = true);

drop policy if exists "public read site images" on public.site_images;
create policy "public read site images"
  on public.site_images for select
  using (true);

grant usage on schema public to anon, authenticated;
grant select on public.portfolio_items to anon, authenticated;
grant select on public.site_images    to anon, authenticated;
