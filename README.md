This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## Panel Admin, Supabase & Cloudinary

Semua foto portofolio bisa diganti lewat **`/admin`** tanpa menyentuh kode.

### Pembagian tugas

- **Supabase** — data saja: `portfolio_items` (kartu grid), `portfolio_item_images` (foto tambahan per karya), `categories` (kategori/tab filter), `site_images` (9 slot foto tetap), `site_settings` (semua teks + palet warna).
- **Cloudinary** (`omsjoxy8`) — penyimpanan dan pengiriman semua file gambar.

### Cara pakai

1. Buka `/admin` (login pakai `ADMIN_PASSWORD`).
2. Tab **Beranda & Project** — semua **foto + teks per bagian halaman** (lihat
   di bawah). Ini tab utamanya.
3. Tab **Grid Portofolio** — tambah/edit/hapus/urutkan kartu di "Selected Works",
   termasuk menambahkan beberapa foto per karya.
4. Tab **Kategori** — tambah, ganti nama, urutkan, dan hapus tab filter.
5. Tab **Teks & Kontak** — teks section About, Kontak, footer, dan tautan
   tombol sosial. Teks Featured Work & Case Study ada di tab **Beranda & Project**
   karena di sana digabung dengan fotonya.

### Tab "Beranda & Project"

Tiap bagian halaman jadi **satu kartu berisi foto + teksnya**, urut mengikuti
urutan halaman (14 kartu):

| Kartu | Isi |
|---|---|
| Featured Work — judul section | label, 2 potong judul, kalimat pengantar |
| Featured Work — kartu besar | foto `featured_main` + label, judul, keterangan |
| Featured Work — kartu kecil 1–3 | foto `featured_stationery` / `featured_environmental` / `featured_digital` + label & judul |
| About — foto profil | foto `profile` (teksnya di tab Teks & Kontak) |
| Project — hero & cover | foto `project_cover` + label, judul, paragraf, 4 baris keterangan |
| Project — galeri | foto `project_gallery_1..3` + label, judul, keterangan |
| Case Study — judul / langkah / palet / isi cerita / angka / kutipan | seluruh isi blok Case Study |

Fotonya tersimpan otomatis begitu selesai di-upload; teksnya disimpan lewat
satu tombol **Simpan perubahan** di bawah (jadi salah ketik masih bisa
dibatalkan). Mengosongkan sebuah field mengembalikannya ke teks bawaan, jadi
situs nggak pernah nampil teks bolong.

Field yang jumlahnya fleksibel ditulis per baris, dan panel admin nampilin
"Terbaca N …" biar kelihatan hasilnya:

| Field | Format |
|---|---|
| Langkah proses | satu langkah per baris |
| Palet warna | **color picker** — pilih warnanya langsung, nama opsional, jumlah bebas. Datanya tetap disimpan sebagai `#KODE Nama` per baris. Ada tombol *ambil cepat* dari warna yang sudah dipakai situs. |
| Blok cerita | baris pertama = judul blok, sisanya isi; antar blok dipisah baris kosong |
| Angka | `angka\|akhiran\|keterangan` per baris |
| Keterangan hero | `Label\|Isi` per baris |

**Kenapa layout tetap presisi:** semua kotak foto rasionya dikunci di kode, dan
teks kartu diposisikan absolut di dalam kotak itu — jadi mengganti foto atau
teks nggak bisa menggeser atau melebarkan kartu. Judul kartu dibatasi 3 baris
(kartu besar) dan 2 baris (kartu kecil); teks utuhnya tetap bisa dibaca lewat
`title` (muncul saat kursor diarahkan ke judul).

### Beberapa foto per karya

Satu kartu bisa punya lebih dari satu foto. Foto **utama** (uploader besar) jadi
thumbnail kartu; foto lainnya diatur di bagian **"Foto lain"** di bawahnya, dan
semuanya tampil di kartu grid sebagai **carousel** yang bisa digeser:

- Desktop — tombol ‹ › muncul waktu kartunya di-hover, plus titik indikator.
- HP — geser pakai jari, atau ketuk titik indikatornya.

Urutan di panel admin = urutan geser di situs. Foto tambahan **langsung
tersimpan** setiap kali ditambah/diurutkan/dihapus (nggak nunggu tombol
"Simpan perubahan"), sama seperti foto utama.

Semua foto tetap dipadu Cloudinary ke kanvas 4:5 saat dikirim, jadi menambah
foto sebanyak apa pun nggak akan mengubah bentuk kartunya. Menghapus karya
otomatis menghapus baris foto tambahannya (`on delete cascade`).

Foto tambahan cuma dikirim ke pengunjung kalau karya induknya ikut tayang —
policy RLS-nya memeriksa `published` di `portfolio_items`.

### Kategori

Tab filter di "Selected Works" diambil dari tabel `categories`, bukan dipatok di
kode. Aturannya:

- **`key` ≠ `label`.** Yang disimpan di `portfolio_items.category` cuma `key`,
  jadi mengganti nama kategori sama sekali nggak menyentuh baris proyeknya.
- Tab **cuma muncul kalau kategorinya punya proyek yang tayang**. Jadi kategori
  baru langsung nongol begitu proyek pertamanya ditambahkan, dan hilang sendiri
  kalau isinya habis — nggak ada tab yang diklik tapi kosong.
- Kategori yang masih dipakai **nggak bisa dihapus**; pesannya menyebut ada
  berapa proyek yang harus dipindahkan dulu.
- Urutan tab di situs = urutan di panel admin.

### Kenapa layout nggak bisa rusak

Setiap slot punya **rasio yang dikunci di kode**, bukan di database:

| Slot | Rasio | Kanvas |
|---|---|---|
| Kartu grid portofolio | 4:5 | 1200 × 1500 |
| Featured utama, foto profil | 1:1 | 1200×1200 · 800×800 |
| Featured kartu kecil, cover `/project` | 2:1 | 1600 × 800 |
| Gallery 1 / 2 / 3 | 16:9 · 5:6 · 2.6:1 | 1600×900 · 1000×1200 · 2080×800 |

File asli disimpan utuh di Cloudinary. Saat dikirim ke browser, Cloudinary
memakai transformasi `c_pad,w_&lt;width&gt;,h_&lt;height&gt;,b_rgb:F7F1E7,f_auto,q_auto`
(lihat `src/lib/cloudinary.ts`): foto diperkecil supaya muat utuh di kanvas,
sisa ruangnya diisi warna krem. Jadi **nggak ada bagian foto yang terpotong**,
kanvasnya selalu persis rasio yang diminta, dan `f_auto` bikin Cloudinary
otomatis mengirim WebP/AVIF.

Contoh nyata: PNG 1536×1024 (2,1 MB) → terkirim 1200×1500 WebP (70 KB).

Foto lama yang masih ada di `public/images/` nggak dilewatkan Cloudinary, jadi
nggak punya kanvas terpadu. Karena itu semua gambar slot memakai
`object-contain`: foto yang sudah dipadu tampil pas memenuhi kotak, sedangkan
foto lama ditampilkan utuh dengan latar krem. Hasilnya nggak ada foto yang
terpotong, apa pun sumbernya.

### Environment variables

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_PASSWORD=
ADMIN_SESSION_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_UPLOAD_PRESET=
```

`SUPABASE_SERVICE_ROLE_KEY` dan `CLOUDINARY_UPLOAD_PRESET` hanya dipakai di server
(API route `/api/admin/*`), jangan pernah diimpor dari komponen client.
Preset upload-nya *unsigned*, tapi endpoint-nya dijaga sesi admin — jadi nama
preset-nya nggak pernah bocor ke browser.

### Skema database

Skema ada di `supabase/schema.sql`, `supabase/categories.sql`, dan
`supabase/settings.sql`, dengan data awal di `supabase/seed.sql`. Jalankan ulang
kapan saja lewat SQL Editor Supabase — semuanya idempotent. Urutannya:

1. `schema.sql` — tabel `portfolio_items`
2. `categories.sql` — tabel `categories`, isi 5 kategori awal, dan FOREIGN KEY
   dari `portfolio_items.category` (sekaligus melepas CHECK constraint lama
   yang mengunci kategori ke 5 nilai itu)
3. `item-images.sql` — tabel `portfolio_item_images` (foto tambahan per karya)
4. `settings.sql` — semua teks (Featured Work, hero project, Case Study, About, Kontak & footer)
5. `seed.sql` — data portofolio awal (opsional)

Isi tabelnya:

- `portfolio_items` — kartu grid (judul, kategori, deskripsi, urutan, published)
- `portfolio_item_images` — foto tambahan per karya (carousel di kartu)
- `categories` — kategori/tab filter (key, label, urutan)
- `site_images` — 9 slot foto tetap, primary key = nama slot
- `site_settings` — semua teks + palet warna (key/value). API-nya cuma mau
  menulis key yang ada di whitelist `SETTING_KEYS` (`src/lib/site-settings.ts`),
  jadi browser nggak bisa nyelipin baris sembarangan.

Kalau Supabase belum dikonfigurasi atau sedang error, situs otomatis balik ke data
statis di `src/data/portfolio.ts`, jadi halaman nggak pernah kosong.

### Catatan

Foto lama nggak ikut dihapus dari Cloudinary waktu diganti — biar salah upload
nggak berarti kehilangan aset. Bersihkan manual dari Media Library kalau perlu.

**Jangan pakai koma sebagai pemisah di kelas arbitrary Tailwind** (mis.
`grid-cols-[160px,1fr]`). Tailwind v4 menulisnya apa adanya jadi
`grid-template-columns:160px,1fr`, dan track list yang dipisah koma itu **CSS
invalid** — browser membuang deklarasinya, grid kolaps jadi satu kolom, dan foto
jadi ngebentang selebar halaman. Pakai garis bawah: `grid-cols-[160px_1fr]`.
