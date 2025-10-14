import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./modules/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // CSS variable tokens
        bg: "var(--bg)",
        surface: "var(--surface)",
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          hover: "var(--accent-hover)",
        },
        border: "var(--border)",
        cta: {
          bg: "var(--cta-bg)",
          text: "var(--cta-text)",
        },
        // Direct brand colors
        converto: {
          blue: "#0047FF",
          graphite: "#444B5A",
          mist: "#F5F6FA",
          sky: "#69B3FF",
          red: "#E74C3C",
          green: "#2ECC71",
        },
      },
      borderRadius: {
        xl: "16px",
        "2xl": "20px",
      },
    },
  },
  plugins: [],
};
export default config;

