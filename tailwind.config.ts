import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: "1rem", screens: { "2xl": "1200px" } },
    extend: {
      fontFamily: {
        display: ['"Barlow Condensed"', "sans-serif"],
        sans: ['"Inter"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        surface: { DEFAULT: "hsl(var(--surface))", elevated: "hsl(var(--surface-elevated))" },
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        sertao: {
          orange: "hsl(var(--sertao-orange))",
          amber: "hsl(var(--sertao-amber))",
          dust: "hsl(var(--sertao-dust))",
        },
        rarity: {
          comum: "hsl(var(--rarity-comum))",
          rara: "hsl(var(--rarity-rara))",
          epica: "hsl(var(--rarity-epica))",
          lendaria: "hsl(var(--rarity-lendaria))",
          mitica: "hsl(var(--rarity-mitica))",
        },
      },
      borderRadius: { lg: "12px", md: "8px", sm: "4px" },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
        "pulse-soft": { "0%, 100%": { opacity: "1" }, "50%": { opacity: "0.45" } },
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 0 0 hsl(var(--primary) / 0.0)" },
          "50%": { boxShadow: "0 0 32px 4px hsl(var(--primary) / 0.45)" },
        },
        "slide-up": { from: { opacity: "0", transform: "translateY(12px)" }, to: { opacity: "1", transform: "translateY(0)" } },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-soft": "pulse-soft 1.6s cubic-bezier(0.2, 0, 0, 1) infinite",
        shimmer: "shimmer 2.8s linear infinite",
        "glow-pulse": "glow-pulse 1.8s ease-in-out infinite",
        "slide-up": "slide-up 0.35s ease-out both",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
