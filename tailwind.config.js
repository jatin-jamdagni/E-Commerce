/** @type {import('tailwindcss').Config} */
/*eslint-env node*/
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#222831',
        secondary: '#393E46',
        icons: '#00ADB5',
        typo: '#EEEEEE'
      }
    }
  },
  plugins: []
}
