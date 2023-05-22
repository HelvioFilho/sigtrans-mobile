/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        regular: "Roboto_400Regular",
        bold: "Roboto_700Bold",
      },
      fontSize: {
        base: "18px",
        title: "28px",
      },
    },
  },
  plugins: [],
};
