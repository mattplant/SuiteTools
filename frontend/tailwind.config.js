// tailwind.config.js
const flowbitePlugin = require('flowbite/plugin');

module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', './node_modules/flowbite-react/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'suite-gray': '#e5e7eb',
      },
      spacing: {
        'suite-gap': '1.25rem',
      },
    },
  },
  plugins: [flowbitePlugin],
};
