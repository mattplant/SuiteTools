/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');
module.exports = {
  content: ['./src/FileCabinet/SuiteScripts/SuiteTools/**/*.{html,js}'],
  theme: {
    extend: {
      // Set font family
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      // Set theme colors (Required config!)
      colors: {
        primary: colors.blue,
        secondary: colors.slate,
      },
      spacing: {
        128: '32rem',
      },
    },
  },
  // Add plugins
  // plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
};
