module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./public/**/*.{js,ts,jsx,tsx,html}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Google Sans',
          'ui-sans-serif',
          'system-ui',
          'sans-serif'
        ],
      },
    },
  },
  plugins: [],
}; 
