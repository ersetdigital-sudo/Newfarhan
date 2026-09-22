import { HomeView } from "@/components/HomeView";
import { getPortfolioItems, getSiteImages } from "@/lib/portfolio";
import { getSiteSettings } from "@/lib/site-settings.server";

// ISR: halaman di-cache, tapi langsung di-refresh saat admin menyimpan
// perubahan lewat revalidatePath(). Jaring pengaman kalau ada perubahan
// yang lolos, maksimal 5 menit.
export const revalidate = 300;

export default async function Home() {
  const [items, slots, settings] = await Promise.all([
    getPortfolioItems(),
    getSiteImages(),
    getSiteSettings(),
  ]);

  return <HomeView items={items} slots={slots} settings={settings} />;
}
