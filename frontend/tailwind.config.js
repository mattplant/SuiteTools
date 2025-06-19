import flowbite from 'flowbite-react/tailwind';

/** @type {import('tailwindcss').Config} */
import forms from '@tailwindcss/forms';

export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}', flowbite.content()],
  theme: {
    extend: {},
  },
  plugins: [forms, flowbite.plugin()],
};
