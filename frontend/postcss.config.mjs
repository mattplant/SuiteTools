// frontend/postcss.config.mjs
import postcssImport from 'postcss-import';
import postcssNesting from 'postcss-nesting'; // using for spec-compliant CSS, better compatibility with PostCSS ecosystem and avoids tailwind-specific lockin.
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

console.log('✅ postcss.config.mjs loaded');

export default {
  plugins: [postcssImport, postcssNesting, tailwindcss, autoprefixer],
};
