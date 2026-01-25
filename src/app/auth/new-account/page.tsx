import { titleFont } from '@/config/fonts';
import { RegisterForm } from './ui/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="flex flex-col min-h-screen justify-center items-center pt-32 pb-10 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl p-8 sm:p-12 border border-zinc-200 dark:border-zinc-800 relative">
        <div className="text-center mb-10 mt-6">
          <h1
            className={`${titleFont.className} text-4xl font-bold text-zinc-900 dark:text-white mb-2`}
          >
            Crear Cuenta
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Únete a nuestra comunidad de agroturismo
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
