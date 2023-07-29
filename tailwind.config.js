/* eslint-disable */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      /*Si no extiendo pierdo la base de tailwind*/
      colors: {
        transparent: "transparent",
        current: "currentColor",
        primary: {
          /*Tonos grises*/
          100: "#bc8e6e",
          200: "#e4c8a8",
          300: "#3e301a ",
          400: "#9c745c",
          500: "#cbbca0",
        },
        secondary: {
          /*Verdes*/
          100: "#F4FFEE",
          200: "#65A147",
        },
        jisselColor1: {
          100: "#cbbca0",
          200: "#e4c8a8",
          300: "#3e301a ",
          400: "#9c745c ",
          500: "#cbbca0 ",
        },
      },
      transitionProperty: {
        height: "height", // Ejemplo de transición de altura
        opacity: "opacity", // Ejemplo de transición de opacidad
        // Puedes agregar más transiciones aquí según tus necesidades.
      },
    },
  },
  plugins: [require("tailwindcss-animated")],
};
