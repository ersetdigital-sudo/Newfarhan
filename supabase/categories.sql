-- ============================================================
-- categories — kategori portofolio, diatur dari panel admin
--
-- Jalankan SETELAH schema.sql (tabel portfolio_items harus sudah ada).
-- Idempotent: aman dijalankan berulang.
--
-- `key` sengaja dipisah dari `label`: `key` yang disimpan di
-- portfolio_items.category, `label` yang tampil di situs. Jadi mengganti nama
-- kategori nggak menyentuh satu baris proyek pun.
-- ============================================================

create table if not exists public.categories (
  key        text primary key,
  label      text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists categories_sort_order_idx
  on public.categories (sort_order);

alter table public.categories enable row level security;

drop policy if exists "public read categories" on public.categories;
create policy "public read categories"
  on public.categories for select
  using (true);

grant usage on schema public to anon, authenticated;
grant select on public.categories to anon, authenticated;

-- ------------------------------------------------------------
-- Isi awal = 5 kategori yang dulu dipatok di kode.
-- Key-nya HARUS sama dengan nilai portfolio_items.category yang sudah ada,
-- supaya proyek lama langsung nyambung tanpa perlu diubah.
-- ------------------------------------------------------------
insert into public.categories (key, label, sort_order) values
  ('branding', 'Branding',          1),
  ('logo',     'Logo Design',       2),
  ('apparel',  'Jersey & Apparel',  3),
  ('social',   'Social Media',      4),
  ('poster',   'Banner & Poster',   5)
on conflict (key) do nothing;

-- ------------------------------------------------------------
-- Longgarkan pengunci kategori.
--
-- Dulu kategori dipatok di kode lewat CHECK constraint, jadi walaupun tabel
-- categories sudah ada, proyek dengan kategori baru tetap ditolak database.
-- Constraint itu diganti FOREIGN KEY ke categories: validasi tetap jalan,
-- tapi sekarang ikut daftar yang diatur dari panel admin.
-- ------------------------------------------------------------
alter table public.portfolio_items
  drop constraint if exists portfolio_items_category_check;

alter table public.portfolio_items
  drop constraint if exists portfolio_items_category_fkey;

alter table public.portfolio_items
  add constraint portfolio_items_category_fkey
  foreign key (category) references public.categories (key)
  on delete restrict;

-- ------------------------------------------------------------
-- Rapikan urutan tab jadi 1..N.
-- ------------------------------------------------------------
with ordered as (
  select key, row_number() over (order by sort_order, key) as rn
  from public.categories
)
update public.categories c
set sort_order = o.rn
from ordered o
where c.key = o.key;
