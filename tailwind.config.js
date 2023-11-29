/** @type {import('tailwindcss').Config} */
/*eslint-env node*/
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#000000',
        secondary: '#4E4FEB',
        icons: '#068FFF',
        typo: '#EEEEEE'
      }
    }
  },
  plugins: []
}
