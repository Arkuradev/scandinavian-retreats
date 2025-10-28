/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
      "scandi-gradient": "linear-gradient(135deg, rgba(13,101,80,0.86) 20%, rgba(11,132,45,0.98) 100%)",
    },
      colors: {
        primary: "#0D6550",
      },
  },
  plugins: [],
}
}
