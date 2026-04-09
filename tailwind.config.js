/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#F6F1E7',
        dark:  '#1C1C1A',
        sand:  '#C4A882',
        sand2: '#7A5C32',
      },
      fontFamily: {
        script:    ['"Great Vibes"', 'cursive'],
        cormorant: ['"Cormorant Garamond"', 'serif'],
        sans:      ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
