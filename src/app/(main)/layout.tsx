import ChatWidget from '@/components/ChatWidget';
import MainNav from '@/components/MainNav';
import { Footer } from '@/components/ui/footer/Footer';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen ">
      <MainNav />
      <ChatWidget />
      {children}
      <Footer />
    </main>
  );
}
