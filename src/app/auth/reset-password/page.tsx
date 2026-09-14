import { titleFont } from '@/config/fonts';
import { ResetPasswordForm } from './ui/ResetPasswordForm';

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <main className="flex flex-col min-h-screen items-center px-4 justify-center py-8 sm:py-12">
      <h1 className={`${titleFont.className} text-4xl mb-5 text-zinc-900 dark:text-zinc-100`}>
        Nueva contraseña
      </h1>
      <div className="w-full max-w-90 sm:max-w-130 md:max-w-240 lg:max-w-300 bg-white dark:bg-zinc-900/50 p-8 rounded-3xl shadow-xl border border-zinc-100 dark:border-zinc-800 backdrop-blur-sm">
        <ResetPasswordForm token={token} />
      </div>
    </main>
  );
}