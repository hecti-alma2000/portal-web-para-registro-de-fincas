import typography from '@tailwindcss/typography';
module.exports = {
  content: ['./src/**/*.{astro,js,ts,jsx,tsx}', './public/**/*.html'],
  darkMode: 'class', // <-- clase para darck mode
  theme: {
    extend: {},
  },
  plugins: [typography],
};
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Aquí puedes extender estilos si lo deseas
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
