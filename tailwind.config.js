/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "scandi-gradient":
          "linear-gradient(0deg, rgba(13,101,80,0.86) 28%, rgba(11,132,45,0.98) 94%)",
        "scandi-gradient-hover":
          "linear-gradient(180deg, rgba(17,153,60,1) 0%, rgba(14,115,88,1) 100%)",
      },
      colors: {
        primary: "#0D6550",
        secondary: "#0B842D",
      },
    },
    plugins: [],
  },
};
