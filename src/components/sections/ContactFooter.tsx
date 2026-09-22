"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { settingValue, type SettingsMap } from "@/lib/site-settings";

interface ContactFooterProps {
  settings?: SettingsMap;
}

/** Tautan luar dibuka di tab baru; "#" dibiarkan apa adanya. */
function isExternal(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

export function ContactFooter({ settings }: ContactFooterProps) {
  const ref = useScrollReveal();

  const email = settingValue(settings, "contact_email");
  const links = [
    {
      key: "social_instagram",
      label: "Instagram",
      href: settingValue(settings, "social_instagram"),
      accent: "hover:border-coral hover:text-coral",
      icon: (
        <>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.2" cy="6.8" r="1" />
        </>
      ),
    },
    {
      key: "social_behance",
      label: "Behance",
      href: settingValue(settings, "social_behance"),
      accent: "hover:border-mustard hover:text-mustard",
      icon: (
        <>
          <path d="M3 6h5.5a3 3 0 0 1 0 6H3z" />
          <path d="M3 12h6a3 3 0 0 1 0 6H3z" />
          <path d="M14 14h7a3.5 3.5 0 1 0-7 0v.5a3.5 3.5 0 0 0 6 2" />
        </>
      ),
    },
    {
      key: "social_whatsapp",
      label: "WhatsApp",
      href: settingValue(settings, "social_whatsapp"),
      accent: "hover:border-indigo hover:text-indigo",
      icon: <path d="M21 12a9 9 0 0 1-13.2 7.9L3 21l1.2-4.6A9 9 0 1 1 21 12Z" />,
    },
    {
      key: "email",
      label: "Email",
      href: `mailto:${email}`,
      accent: "hover:border-clay hover:text-clay",
      icon: (
        <>
          <rect x="3" y="5" width="18" height="14" rx="3" />
          <path d="m4 7 8 6 8-6" />
        </>
      ),
    },
  ];

  return (
    <footer id="contact" className="relative overflow-hidden border-t border-ink/10">
      <div className="pointer-events-none absolute left-1/4 top-0 h-72 w-72 rounded-full bg-mustard/18 blur-[130px]" />
      <div className="relative mx-auto max-w-[1200px] px-6 py-24">
        <p ref={ref} className="reveal mb-4 font-display text-xs tracking-[0.3em] text-ink/40">
          {settingValue(settings, "contact_kicker")}
        </p>
        <div className="reveal flex flex-col items-start justify-between gap-10 md:flex-row md:items-end">
          <h2 className="font-display text-4xl font-bold leading-[1.02] tracking-[-0.03em] md:text-6xl">
            {settingValue(settings, "contact_heading_1")}
            <br />
            <span className="grad-text">{settingValue(settings, "contact_heading_2")}</span>
          </h2>
          <div className="flex items-center gap-3">
            {links.map((link) => (
              <a
                key={link.key}
                data-magnetic=""
                href={link.href}
                aria-label={link.label}
                {...(isExternal(link.href)
                  ? { target: "_blank", rel: "noreferrer" }
                  : {})}
                className={`grid h-12 w-12 place-items-center rounded-full border border-ink/12 bg-chalk transition-colors ${link.accent}`}
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                >
                  {link.icon}
                </svg>
              </a>
            ))}
          </div>
        </div>
        <p className="reveal mt-8 max-w-md text-sm leading-relaxed text-ink/60">
          {settingValue(settings, "contact_description")}
        </p>
        <p className="reveal mt-3 font-display text-lg font-bold">{email}</p>
        <div className="mt-16 flex flex-col gap-3 border-t border-ink/10 pt-6 text-xs text-ink/50 sm:flex-row sm:justify-between">
          <p>{settingValue(settings, "footer_left")}</p>
          <p>{settingValue(settings, "footer_right")}</p>
        </div>
      </div>
    </footer>
  );
}
