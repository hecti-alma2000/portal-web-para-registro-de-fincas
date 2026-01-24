// import type { Config } from 'tailwindcss';
// const config: Config = {
//   darkMode: 'class',
//   content: [
//     './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
//     './src/components/**/*.{js,ts,jsx,tsx,mdx}',
//     './src/app/**/*.{js,ts,jsx,tsx,mdx}',
//   ],
//   theme: {
//     extend: {
//       // Aquí puedes extender estilos si lo deseas
//     },
//   },
//   plugins: [require('@tailwindcss/typography')],
// };

// export default config;
import typography from '@tailwindcss/typography';
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // <-- clase para darck mode
  theme: {
    extend: {},
  },
  plugins: [typography],
};
