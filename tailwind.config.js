/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Montserrat", "ui-sans-serif", "system-ui"],
        display: ["Montserrat", "system-ui"],
      },
      backgroundImage: {
        "hz-hero": "linear-gradient(to right, #7DD3FC, #60A5FA)",
      },
      colors: {
        "hz-primary": "#0EA5E9",
        "hz-primary-soft": "#E0F2FE",
        "hz-accent": "#0284C7",
        "hz-surface": "#FFFFFF",
        "hz-surface-soft": "#F0F9FF",
        "hz-border": "#E2E8F0",
        "hz-text": "#0F172A",
        "hz-muted": "#64748B",
      },
      boxShadow: {
        "hz-card": "0 10px 25px rgba(15, 23, 42, 0.08)",
      },
    },
  },
  plugins: [],
};
