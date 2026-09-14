import { Inter, Geist, Geist_Mono, Montserrat_Alternates, Roboto, Pacifico } from 'next/font/google';

export const inter = Inter({ subsets: ['latin'] });

// Fuente base del sitio (usada en globals.css). Antes se declaraba
// `font-family: 'Roboto'` sin cargarla nunca, así que el navegador
// caía a su fuente por defecto.
export const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
});

// Usada en el título del Hero (antes cargada por @import en globals.css,
// lo que bloquea el render inicial).
export const pacifico = Pacifico({
  variable: '--font-pacifico',
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
});

export const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const titleFont = Montserrat_Alternates({
  subsets: ['latin'],
  weight: ['500', '700'],
});
