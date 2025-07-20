// frontend/postcss.config.mjs
import postcssImport from 'postcss-import';
import postcssNesting from 'postcss-nesting';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

console.log('✅ postcss.config.mjs loaded');

export default {
  plugins: [
    postcssImport,
    postcssNesting({ edition: '2021' }),
    tailwindcss,
    autoprefixer,
  ],
};
