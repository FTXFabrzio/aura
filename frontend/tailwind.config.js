/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'tokyo-bg': '#1a1b26',
        'tokyo-bg-alt': '#24283b',
        'tokyo-fg': '#a9b1d6',
        'tokyo-purple': '#bb9af7',
        'tokyo-blue': '#7aa2f7',
        'tokyo-cyan': '#7dcfff',
        'tokyo-green': '#9ece6a',
        'tokyo-yellow': '#e0af68',
        'tokyo-red': '#f7768e',
        'tokyo-gray': '#565f89',
        aura: {
          primary: '#bb9af7',
          secondary: '#7aa2f7',
          dark: '#1a1b26',
          light: '#f8fafc',
        }
      }
    },
  },
  plugins: [],
}
