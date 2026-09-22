import type { Metadata } from "next";
import { ProjectView } from "@/components/ProjectView";
import { getSiteImages } from "@/lib/portfolio";
import { getSiteSettings } from "@/lib/site-settings.server";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "ARVA — Brand & Kit System · Farhan Raka.K",
  description:
    "Studi kasus identitas visual ARVA: logo suite, palet warna, tipografi, stationery, signage, dan aset digital.",
};

export default async function ProjectPage() {
  const [slots, settings] = await Promise.all([getSiteImages(), getSiteSettings()]);

  return <ProjectView slots={slots} settings={settings} />;
}
