module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@radix-ui/react-*/dist/**/*.{js,jsx}",
  ],
  darkMode: 'class', // Add this line
  theme: {
    extend: {
      colors: {
        'dark-bg': '#121212',
        'dark-text': '#E0E0E0',
        'blue-dark': '#1E3A8A',
      },
    },
  },
  plugins: [],
}
