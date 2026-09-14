'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Loader2, OctagonAlert, MailCheck } from 'lucide-react';
import { requestPasswordReset } from '@/actions/auth/password-reset';

const inputClasses =
  'w-full px-5 py-4 text-base bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all placeholder:text-zinc-400 text-zinc-900 dark:text-zinc-100';

const labelClasses = 'block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2 ml-1';

export const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const resp = await requestPasswordReset(email);

    setMessage({
      type: resp.ok ? 'success' : 'error',
      text: resp.message as string,
    });
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center -mt-2">
        Ingresa el correo de tu cuenta y te enviaremos un enlace para crear una nueva contraseña.
      </p>

      {/* Mensajes */}
      {message && (
        <div
          className={`flex items-start gap-3 p-4 rounded-xl border animate-in fade-in slide-in-from-top-2 ${
            message.type === 'success'
              ? 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800 text-green-700 dark:text-green-400'
              : 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800 text-red-600 dark:text-red-400'
          }`}
        >
          {message.type === 'success' ? (
            <MailCheck className="h-5 w-5 shrink-0" />
          ) : (
            <OctagonAlert className="h-5 w-5 shrink-0" />
          )}
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

      {/* Email */}
      <div>
        <label htmlFor="email" className={labelClasses}>
          Correo Electrónico
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="usuario@ejemplo.com"
          className={inputClasses}
        />
      </div>

      {/* Botón */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-lg shadow-lg shadow-green-600/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting && <Loader2 className="animate-spin h-5 w-5" />}
        {isSubmitting ? 'Enviando...' : 'Enviar enlace de recuperación'}
      </button>

      {/* Footer / Login Link */}
      <div className="text-center pt-2">
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">
          ¿Recordaste tu contraseña?{' '}
          <Link
            href="/auth/login"
            className="text-green-600 dark:text-green-400 font-bold hover:underline underline-offset-4"
          >
            Ingresa aquí
          </Link>
        </p>
      </div>
    </form>
  );
};