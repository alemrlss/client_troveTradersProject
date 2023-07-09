export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: { /*Si no extiendo pierdo la base de tailwind*/
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        'primary': { /*Tonos grises*/
          100: '#c9caca',
          200: '#8b8b8c',
          300: '#5f5d5d',
        }, 
        'secondary': { /*Verdes*/
          100: '#F4FFEE',
          200: '#65A147',
        },
      },
    },
  },
  plugins: [],
}