import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "hsl(var(--c-ink))",
        graphite: "hsl(var(--c-graphite))",
        sky: "hsl(var(--c-sky))",
        cyan: "hsl(var(--c-cyan))",
      },
      boxShadow: {
        glass: "0 8px 40px -12px rgba(0,0,0,0.45)",
      },
      borderRadius: { xl: "1rem", "2xl": "1.25rem", "3xl": "1.5rem" },
      backdropBlur: { xl: "20px" },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("tailwindcss-animate")],
};
export default config;
