/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        walnut: '#241914',
        // Shifted cooler/greyer than a typical "AI cream" (#F4F1EA) so the
        // light ground reads as raw undyed wool, not a generic warm-neutral
        // default — flagged in design review as too close to that cliché.
        wool: '#E6E4DC',
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
