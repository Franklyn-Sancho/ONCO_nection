module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        'roboto': ['Roboto Serif', 'serif']
      },
      width: {
        '86': '22rem'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
