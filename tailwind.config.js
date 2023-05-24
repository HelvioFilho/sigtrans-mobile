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
        error: "14px",
        input: "16px",
        base: "18px",
        md: "20px",
        subtitle: "24px",
        title: "28px",
      },
    },
  },
  plugins: [],
};
