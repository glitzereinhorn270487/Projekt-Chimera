// firefly-dashboard/tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
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
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },
      keyframes: {
        "pulse-soft": {
          "0%,100%": {
            opacity: "0.65",
            filter: "drop-shadow(0 0 18px hsla(var(--glow-cyan),0.12))",
          },
          "50%": {
            opacity: "1",
            filter: "drop-shadow(0 0 28px hsla(var(--glow-cyan),0.25))",
          },
        },
      },
      animation: {
        "pulse-soft": "pulse-soft 2.4s ease-in-out infinite",
      },
      backdropBlur: {
        xl: "20px",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("tailwindcss-animate")],
};

export default config;
