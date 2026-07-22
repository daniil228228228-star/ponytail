/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        walnut: '#241914',
        wool: '#F7F0E4',
        madder: '#B5432A',
        sage: '#7A8B6F',
        turmeric: '#D9A441',
        coffee: '#3A2E27',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        sans: ['"Public Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
