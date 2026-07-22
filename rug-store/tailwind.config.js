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
        'madder-dim': '#8A3320',
        sage: '#7A8B6F',
        turmeric: '#D9A441',
        coffee: '#3A2E27',
        // single metallic accent, per IMPROVEMENT_PROMPT.md §2.1 — used at
        // most once per viewport (maker's-card detail, 3D-viewer caption).
        brass: '#9C7A3E',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        sans: ['"Public Sans"', 'sans-serif'],
      },
      // Real modular type scale (1.25 ratio), IMPROVEMENT_PROMPT.md §2.2 —
      // desktop sizes; components apply the mobile size via responsive
      // variants where the two diverge meaningfully.
      fontSize: {
        'display-xl': ['96px', { lineHeight: '1.05' }],
        'display-lg': ['64px', { lineHeight: '1.05' }],
        'display-md': ['40px', { lineHeight: '1.05' }],
        'body-lg': ['22px', { lineHeight: '1.5' }],
        'body-sm': ['15px', { lineHeight: '1.5' }],
        label: ['13px', { lineHeight: '1.3', letterSpacing: '0.08em' }],
      },
    },
  },
  plugins: [],
}
