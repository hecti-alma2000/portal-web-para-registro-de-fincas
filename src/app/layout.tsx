import './globals.css';
import Providers from './providers';
import MainNav from '../components/MainNav';
import { Footer } from '@/components/ui/footer/Footer';
import ChatWidget from '@/components/ChatWidget';

export const metadata = {
  title: 'Portal web para el registro de fincas',
  description: '',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head />
      <body>
        <MainNav />
        <Providers>
          <ChatWidget />
          {children}
        </Providers>
        <Footer />
      </body>
    </html>
  );
}
