import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Sora", "sans-serif"],
        body: ["Poppins", "sans-serif"],
      },
      colors: {
        coral: "#FF5A45",
        clay: "#C96A4B",
        mustard: "#E8A33D",
        indigo: "#3F3D9E",
        paper: "#FBF9F5",
        chalk: "#FFFFFF",
        ink: "#14131A",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        floaty: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" },
        },
        ping: {
          "75%, 100%": {
            transform: "scale(2)",
            opacity: "0",
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
