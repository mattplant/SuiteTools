// tailwind.config.js
// flowbite-react 0.11+ no longer depends on the standalone `flowbite` package. Its Tailwind
// plugin supplies the theme extensions the component defaults rely on — including the `primary`
// palette, which the default themes reference and which nothing else in this project defines.
const flowbiteReact = require('flowbite-react/plugin/tailwindcss');

module.exports = {
  // `.flowbite-react/class-list.json` is generated at build time by the flowbite-react Vite
  // plugin and lists the classes its components can emit. It replaces the old practice of
  // globbing the package's own source, which 0.11+ no longer ships classes in.
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', '.flowbite-react/class-list.json'],
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
  plugins: [flowbiteReact],
};
