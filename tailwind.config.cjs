const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./html/**/*.{html,js}"],
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    container: {
      center: true,
    },
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        "cylime": "#96F550",
        "cydarklime": "#3D8708",
        "cydarkestlime": "#004b23",
        "cygoo": "#011D27",
        "cyblack": "#131316",
        "cyalmostwhite": "#F1F3F9"
      }
    },
  },
  plugins: [],
}