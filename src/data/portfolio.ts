export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  quickView: {
    description: string;
  };
}

export const portfolioItems: PortfolioItem[] = [
  {
    id: "nexus-fc",
    title: "Nexus FC — Away Kit",
    description: "Jersey & Apparel",
    category: "apparel",
    image: "/images/132bd8bb-ae48-44cf-b43f-5dd97e720f23.png",
    quickView: {
      description: "Away kit untuk klub semi-pro: artwork siap produksi, mockup depan-belakang, dan aturan penempatan nomor serta sponsor.",
    },
  },
  {
    id: "the-arrival",
    title: "The Arrival — Poster Campaign",
    description: "Banner & Poster",
    category: "poster",
    image: "/images/cc73ed0e-0a76-449d-8c46-204beb344c96.png",
    quickView: {
      description: "Poster campaign untuk event desain: tipografi besar, komposisi geometris tajam, dan file siap cetak ukuran A1.",
    },
  },
  {
    id: "urban-archetype",
    title: "Urban Archetype — Apparel",
    description: "Jersey & Apparel",
    category: "apparel",
    image: "/images/fc0d4e32-6788-4c4c-9865-e36c196b516e.png",
    quickView: {
      description: "Seri apparel hoodie dan tee dengan artwork grafis, label jahit, serta hang tag yang satu bahasa visual.",
    },
  },
  {
    id: "verde-botanica",
    title: "Verde Botanica — Packaging",
    description: "Branding",
    category: "branding",
    image: "/images/9f5ca154-2407-4b03-8cd2-a5cb95e446f8.png",
    quickView: {
      description: "Identitas dan kemasan skincare botanis: label bottle, karton sekunder, dan panduan foto produk.",
    },
  },
  {
    id: "verde-logo",
    title: "Verde — Logo Presentation",
    description: "Logo Design",
    category: "logo",
    image: "/images/1fc73f62-8d18-4caa-b9e7-aa026d06f1b5.png",
    quickView: {
      description: "Identitas Verde: logo daun minimalis, wordmark sans-serif berspasi lebar, versi light-dark, app icon, serta penerapan di kartu nama dan cetak emboss.",
    },
  },
  {
    id: "halcyon-logo",
    title: "Halcyon — Logo & Identity",
    description: "Logo Design",
    category: "logo",
    image: "/images/9c7784d6-e8ed-41b3-a14b-c56300b96634.png",
    quickView: {
      description: "Identitas Halcyon: wordmark serif dengan ikon spark, monogram H, versi light–dark–navy, palet navy–gold–cream, serta penerapan di kartu nama dan signage.",
    },
  },
  {
    id: "oos-nexa",
    title: "OOS NEXA — Brand Identity",
    description: "Logo Design",
    category: "logo",
    image: "/images/c8c9ce26-e0de-426b-a119-c32add5bd506.png",
    quickView: {
      description: "Brand identity OOS NEXA: wordmark custom bersudut tajam dengan chevron oranye, ikon/mark dan secondary mark, palet Nexa Orange–Deep Black–Slate–Light Gray, tipografi Montserrat, plus penerapan kartu nama dan signage.",
    },
  },
  {
    id: "carousel-content",
    title: "Carousel Content — Studio",
    description: "Social Media",
    category: "social",
    image: "/images/638cf11f-871e-492f-be29-8d351786f821.png",
    quickView: {
      description: "Template carousel Instagram: grid konsisten, hierarki teks jelas, dan mudah diisi ulang oleh tim internal.",
    },
  },
  {
    id: "kopi-lantai",
    title: "Kopi Lantai — Coffee Branding",
    description: "Branding",
    category: "branding",
    image: "/images/4509d617-b611-4cf0-b10f-44c1dfc75cec.png",
    quickView: {
      description: "Branding kedai kopi: logo, kemasan biji, cup, dan material toko dengan nuansa kraft–terracotta.",
    },
  },
  {
    id: "merch-set",
    title: "Merch Set — Cap, Tote, Socks",
    description: "Jersey & Apparel",
    category: "apparel",
    image: "/images/59a97444-7d42-4900-a463-56189503f115.png",
    quickView: {
      description: "Paket merchandise brand: cap bordir, tote sablon, dan kaos kaki custom dalam satu palet.",
    },
  },
  {
    id: "halcyon-billboard",
    title: "Halcyon — Billboard Campaign",
    description: "Banner & Poster",
    category: "poster",
    image: "/images/3f3828ce-ff97-4bc8-a617-14e97bfa93ab.png",
    quickView: {
      description: "Kampanye billboard untuk brand finansial: headline pendek, kontras tinggi, tetap terbaca dari kejauhan.",
    },
  },
];

export const featuredProject = {
  id: "arva",
  title: "ARVA — Brand Identity System",
  category: "branding",
  description: "Logo suite, palet warna, tipografi, dan guideline dalam satu papan identitas.",
  image: "/images/269ea28f-c1ae-4aaf-9557-277451504028.png",
  secondaryImages: [
    { src: "/images/80931dd2-bdaa-4375-809d-307fa7ccf0e0.png", label: "Stationery", bg: "#F7F1E7" },
    { src: "/images/6b73f91c-313e-4ee0-b3ae-5988bf16bf95.png", label: "Environmental", bg: "#F7F1E7" },
    { src: "/images/d70331f8-fda6-4948-a310-7da323f5f60b.png", label: "Digital", bg: "#F7F1E7" },
  ],
};

export const filterCategories = [
  { key: "all", label: "All" },
  { key: "branding", label: "Branding" },
  { key: "logo", label: "Logo Design" },
  { key: "apparel", label: "Jersey & Apparel" },
  { key: "social", label: "Social Media" },
  { key: "poster", label: "Banner & Poster" },
];
