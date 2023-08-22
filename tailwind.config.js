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
      },
      transitionProperty: {
        height: "height", // Ejemplo de transición de altura
        opacity: "opacity", // Ejemplo de transición de opacidad
        // Puedes agregar más transiciones aquí según tus necesidades.
      },
      gridTemplateRows: {
        '[auto,auto,1fr]': 'auto auto 1fr',
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
    require('@tailwindcss/aspect-ratio'),
  ],
};
