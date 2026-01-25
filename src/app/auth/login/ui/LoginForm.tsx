'use client';
import { authenticate } from '@/actions/auth/login';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { OctagonAlert, Eye, EyeOff } from 'lucide-react';

export const LoginForm = () => {
  const router = useRouter();
  const [state, dispatch] = useActionState(authenticate, undefined);
  const [showPassword, setShowPassword] = React.useState(false);

  useEffect(() => {
    if (state === 'Success') {
      window.location.replace('/');
    }
  }, [state]);

  // Estilo común para inputs
  const inputStyles =
    'px-5 py-2 border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all';

  return (
    <form action={dispatch} className="flex flex-col w-full">
      <label htmlFor="email" className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
        Correo electrónico
      </label>
      <input
        className={`${inputStyles} mb-5`}
        type="email"
        name="email"
        placeholder="correo@google.com"
        required
      />

      <label
        htmlFor="password"
        className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300"
      >
        Contraseña
      </label>
      <div className="relative mb-2">
        <input
          className={`${inputStyles} w-full pr-12`}
          type={showPassword ? 'text' : 'password'}
          name="password"
          placeholder="••••••••"
          required
        />
        <button
          type="button"
          className="absolute right-3 top-0 bottom-0 m-auto h-9 w-9 flex items-center justify-center text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
          onMouseDown={() => setShowPassword(true)}
          onMouseUp={() => setShowPassword(false)}
          onMouseLeave={() => setShowPassword(false)}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      {/* Mensaje de Error */}
      <div className="flex h-10 items-center space-x-1" aria-live="polite">
        {state === 'CredentialsSignin' && (
          <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg w-full">
            <OctagonAlert className="h-4 w-4 text-red-600 dark:text-red-400" />
            <p className="text-xs text-red-600 dark:text-red-400 font-medium">
              Credenciales incorrectas
            </p>
          </div>
        )}
      </div>

      <LoginButton />

      {/* Divisor "O" adaptable */}
      <div className="flex items-center my-6">
        <div className="flex-1 border-t border-zinc-300 dark:border-zinc-700"></div>
        <div className="px-3 text-zinc-500 dark:text-zinc-400 text-sm font-medium">O</div>
        <div className="flex-1 border-t border-zinc-300 dark:border-zinc-700"></div>
      </div>

      <Link
        href="/auth/new-account"
        className="text-center py-2 text-zinc-700 dark:text-zinc-300 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors"
      >
        Crear una nueva cuenta
      </Link>
    </form>
  );
};

export const LoginButton = () => {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className={clsx(
        'w-full py-3 rounded-xl font-bold transition-all active:scale-[0.98] shadow-lg',
        {
          'bg-green-600 hover:bg-green-700 text-white shadow-green-900/20': !pending,
          'bg-zinc-300 dark:bg-zinc-800 text-zinc-500 cursor-not-allowed': pending,
        }
      )}
      disabled={pending}
    >
      {pending ? 'Ingresando...' : 'Ingresar'}
    </button>
  );
};
