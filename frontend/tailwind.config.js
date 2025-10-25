/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        border: "var(--border)",
        text: { primary: "var(--text-primary)", secondary: "var(--text-secondary)" },
        brand: { blue: "#1565EA", dark: "#343A40", light: "#F8F9FA" },
        cta: { bg: "var(--cta-bg)", text: "var(--cta-text)" },
        success: "#10B981",
        warning: "#F59E0B",
        danger: "#EF4444",
      },
      borderRadius: { xl: "16px" },
    },
  },
  plugins: [],
};
