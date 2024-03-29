/* eslint-disable */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/tw-elements/dist/js/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        transparent: "transparent",
        current: "currentColor",
        primary: {
          /*Tonos marrones*/
          100: "#d5c9ac",
        },
        secondary: {
          100: "#8d3d3a",
          200: "#a8814f",
          300: "#8D3C0E",
          400: "#ffba91",
          500: "#ffc591",
          600: "#e46a5b      ",
        },
        logo: {
          100: "#EEF1EA",
        },
      },
      transitionProperty: {
        height: "height", // Ejemplo de transición de altura
        opacity: "opacity", // Ejemplo de transición de opacidad
        // Puedes agregar más transiciones aquí según tus necesidades.
      },
      gridTemplateRows: {
        "[auto,auto,1fr]": "auto auto 1fr",
      },
      fontFamily: {
        custom: ["CustomFont", "mono"], // Cambia 'CustomFont' al nombre de tu fuente y 'sans' a la pila de fuentes de respaldo
      },
    },
  },
  corePlugins: {
    aspectRatio: false,
  },
  darkMode: "class",
  plugins: [
    require("tailwindcss-animated"),
    require("tw-elements/dist/plugin.cjs"),
    require("@tailwindcss/aspect-ratio"),
  ],
};
