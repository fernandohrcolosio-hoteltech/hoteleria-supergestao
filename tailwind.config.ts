import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#0d1b2a",
        "navy-mid": "#1a2e45",
        "navy-light": "#243b55",
        gold: "#c9a84c",
        "gold-light": "#e2c47a",
        "gold-pale": "#f5e9c8",
        cream: "#faf8f3",
        "text-main": "#1a1a1a",
        "text-muted": "#6b7280",
        border: "#e5e0d5",
        danger: "#c0392b",
        success: "#1a6b4a",
      },
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
        serif: ["DM Serif Display", "serif"],
      },
      boxShadow: {
        shadow: "0 4px 24px rgba(13,27,42,0.10)",
        "shadow-lg": "0 12px 48px rgba(13,27,42,0.18)",
      },
      borderRadius: {
        "radius": "12px",
        "radius-lg": "20px",
      },
    },
  },
  plugins: [],
};

export default config;
