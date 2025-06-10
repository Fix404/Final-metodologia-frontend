/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx,html}"],
  theme: {
    extend: {
      screens: {
        "max-xs": { max: "500px" }, 
        "max-sm": { max: "950px" },
        "max-mm": "1000px",
        "large": "1032px",
        "xl": "1280px",
      },
    },
  },
  plugins: [],
};

