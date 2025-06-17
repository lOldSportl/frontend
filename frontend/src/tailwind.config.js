/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    "translate-x-0",
    "-translate-x-full",
  ],
  darkMode: 'class', // ✅ Включаем поддержку тёмной темы через класс .dark
  theme: {
    extend: {
      colors: {
        primary: "#2a45f1",
        secondary: "#313e78",
        danger: "#c2140a",
        success: "#298e3c",
        warning: "#e6a119",
        info: "#5a49ab",
        border: "#eaeaea",
        background: "#ffffff",
        contrast: "#f3f5f7",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "6px",
        lg: "12px",
        xl: "24px",
      },
      boxShadow: {
        DEFAULT: "0px 0px 8px rgba(0,0,0,0.14)",
        md: "0px 4px 8px rgba(0,0,0,0.14)",
        xl: "0px 0px 18px rgba(0,0,0,0.12)",
      },
    },
  },
  plugins: [],
};
