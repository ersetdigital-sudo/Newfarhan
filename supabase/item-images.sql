-- ============================================================
-- portfolio_item_images — foto tambahan per karya
--
-- Foto UTAMA tetap di portfolio_items.image_url (itu yang jadi thumbnail
-- kartu). Tabel ini nyimpen foto-foto lain dari karya yang sama, dan
-- semuanya tampil sebagai carousel yang bisa digeser di kartu grid.
--
-- Jalankan SETELAH schema.sql. Idempotent: aman dijalankan berulang.
-- ============================================================

create table if not exists public.portfolio_item_images (
  id         bigserial primary key,
  item_slug  text not null
             references public.portfolio_items (slug) on delete cascade,
  image_url  text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists portfolio_item_images_slug_idx
  on public.portfolio_item_images (item_slug, sort_order);

alter table public.portfolio_item_images enable row level security;

-- Foto cuma kelihatan publik kalau karya induknya ikut tayang, jadi
-- menyembunyikan sebuah karya otomatis menyembunyikan foto-fotonya juga.
drop policy if exists "public read item images" on public.portfolio_item_images;
create policy "public read item images"
  on public.portfolio_item_images for select
  using (
    exists (
      select 1 from public.portfolio_items i
      where i.slug = item_slug and i.published
    )
  );

grant usage on schema public to anon, authenticated;
grant select on public.portfolio_item_images to anon, authenticated;
