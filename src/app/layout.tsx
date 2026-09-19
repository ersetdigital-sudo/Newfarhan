import type { Metadata } from "next";
import { Sora, Poppins } from "next/font/google";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Farhan Raka.K — Creative Designer / Branding & Apparel",
  description:
    "Creative Designer specializing in branding, logo, jersey & apparel, and digital marketing visuals.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`scroll-smooth ${sora.variable} ${poppins.variable}`}
    >
      <body className="font-body antialiased">
        <div className="grain"></div>
        <div id="spotlight"></div>
        {children}
      </body>
    </html>
  );
}
