import { auth } from '@/auth.config';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  if (session?.user) {
    redirect('/');
  }
  return (
    <main className="flex justify-center px-4 relative">
      {/* Link global de volver a / para todas las páginas de auth */}
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-zinc-500 hover:text-green-600 transition-colors"
      >
        <ChevronLeft size={18} />
        <span className="text-sm font-medium">Inicio</span>
      </Link>

      {/* Contenedor principal para las páginas de auth */}
      <div className="w-full max-w-4xl px-6">{children}</div>
    </main>
  );
}
