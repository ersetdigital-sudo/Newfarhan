"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useCounter } from "@/hooks/useCounter";
import { cloudinaryImage } from "@/lib/cloudinary";
import { settingList, settingNumber, settingValue, type SettingsMap } from "@/lib/site-settings";
import { slotCanvas } from "@/lib/site-slots";

interface AboutProps {
  /** Foto profil dari slot "profile". Kalau kosong, pakai gambar lama. */
  profileUrl?: string;
  profileAlt?: string;
  settings?: SettingsMap;
}

/** Warna titik prinsip, dipakai bergilir sesuai urutan. */
const PRINCIPLE_DOTS = ["bg-coral", "bg-mustard", "bg-indigo"];

export function About({ profileUrl, profileAlt, settings }: AboutProps) {
  const ref = useScrollReveal();

  const statValue = settingNumber(settings, "about_stat_value") ?? 98;
  const counterStat = useCounter(statValue);

  const skills = settingList(settings, "about_skills");
  const principles = settingList(settings, "about_principles");

  return (
    <section id="about" className="mx-auto max-w-[1200px] px-6 py-16">
      <p ref={ref} className="reveal mb-4 font-display text-xs tracking-[0.3em] text-ink/40">
        {settingValue(settings, "about_kicker")}
      </p>
      <div className="grid gap-5 md:grid-cols-3">
        {/* Profile card */}
        <div className="reveal rounded-[2rem] border border-ink/8 bg-chalk p-8 md:col-span-2 md:p-10">
          <div className="flex items-center gap-5">
            <span className="relative grid h-24 w-24 shrink-0 place-items-center rounded-full p-[2px]" style={{ background: "linear-gradient(135deg,#FF5A45,#E8A33D)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cloudinaryImage(
                  profileUrl || "/images/c98c49c7-b8f7-4763-ba04-805ebfb930e0.png",
                  slotCanvas("profile").width,
                  slotCanvas("profile").height
                )}
                alt={profileAlt || "Farhan Raka.K"}
                className="h-full w-full rounded-full object-cover"
              />
            </span>
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
                {settingValue(settings, "about_heading")}
              </h2>
              <p className="text-xs uppercase tracking-[0.2em] text-coral">
                {settingValue(settings, "about_role")}
              </p>
            </div>
          </div>
          <p className="mt-7 max-w-xl leading-relaxed text-ink/65">
            {settingValue(settings, "about_bio")}
          </p>
          {skills.length > 0 ? (
            <ul className="mt-8 flex flex-wrap gap-2 text-[13px]">
              {skills.map((skill) => (
                <li key={skill} className="rounded-full border border-ink/10 bg-paper px-4 py-2">
                  {skill}
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-5">
          <div className="reveal rounded-[2rem] p-8 text-white" style={{ background: "linear-gradient(140deg,#FF5A45,#C96A4B)" }}>
            <p className="num font-display text-5xl font-bold leading-none tracking-tight">
              <span ref={counterStat} className="counter" data-to={statValue}>
                0
              </span>
              {settingValue(settings, "about_stat_suffix")}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-white/85">
              {settingValue(settings, "about_stat_label")}
            </p>
          </div>
          <div className="reveal flex-1 rounded-[2rem] border border-ink/8 bg-chalk p-8">
            <p className="text-xs uppercase tracking-[0.2em] text-ink/40">
              {settingValue(settings, "about_principles_title")}
            </p>
            {principles.length > 0 ? (
              <ul className="mt-4 space-y-3 text-sm">
                {principles.map((principle, index) => (
                  <li key={principle} className="flex items-center gap-3">
                    <span
                      className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                        PRINCIPLE_DOTS[index % PRINCIPLE_DOTS.length]
                      }`}
                    />
                    {principle}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
