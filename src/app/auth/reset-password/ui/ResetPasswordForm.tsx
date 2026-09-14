'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Eye, EyeOff, Loader2, OctagonAlert, CircleCheckBig } from 'lucide-react';
import { resetPassword } from '@/actions/auth/password-reset';

const inputClasses =
  'w-full px-5 py-4 text-base bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all placeholder:text-zinc-400 text-zinc-900 dark:text-zinc-100';

const labelClasses = 'block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2 ml-1';

interface ResetPasswordFormProps {
  token?: string;
}

export const ResetPasswordForm = ({ token }: ResetPasswordFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError('');
    setMessage(null);

    if (password.length < 6) {
      setLocalError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Las contraseñas no coinciden');
      return;
    }

    setIsSubmitting(true);
    const resp = await resetPassword(token as string, password);
    setMessage({
      type: resp.ok ? 'success' : 'error',
      text: resp.message as string,
    });
    setIsSubmitting(false);
  };

  if (!token) {
    return (
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <div className="flex items-start gap-3 p-4 rounded-xl border border-red-100 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 w-full">
          <OctagonAlert className="h-5 w-5 shrink-0 mt-0.5" />
          <span className="text-sm font-medium">
            El enlace de recuperación no es válido. Solicita uno nuevo desde la página de
            recuperación.
          </span>
        </div>
        <Link
          href="/auth/forgot-password"
          className="text-green-600 dark:text-green-400 font-bold hover:underline underline-offset-4 text-sm"
        >
          Solicitar nuevo enlace
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      {message?.type === 'success' && (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-green-100 dark:border-green-800 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 animate-in fade-in slide-in-from-top-2">
          <CircleCheckBig className="h-5 w-5 shrink-0 mt-0.5" />
          <span className="text-sm font-medium">
            {message.text}
            <Link
              href="/auth/login"
              className="text-green-700 dark:text-green-300 underline underline-offset-4 ml-1"
            >
              Iniciar sesión
            </Link>
          </span>
        </div>
      )}

      {message?.type === 'error' && (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-red-100 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 animate-in fade-in slide-in-from-top-2">
          <OctagonAlert className="h-5 w-5 shrink-0 mt-0.5" />
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

      {localError && (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-red-100 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
          <OctagonAlert className="h-5 w-5 shrink-0 mt-0.5" />
          <span className="text-sm font-medium">{localError}</span>
        </div>
      )}

      {/* Nueva contraseña */}
      <div>
        <label htmlFor="password" className={labelClasses}>
          Nueva contraseña
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 6 caracteres"
            className={`${inputClasses} pr-12`}
          />
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors p-1"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
          </button>
        </div>
      </div>

      {/* Confirmar contraseña */}
      <div>
        <label htmlFor="confirmPassword" className={labelClasses}>
          Confirmar contraseña
        </label>
        <div className="relative">
          <input
            id="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repite la nueva contraseña"
            className={`${inputClasses} pr-12`}
          />
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors p-1"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
          </button>
        </div>
      </div>

      {/* Botón */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-lg shadow-lg shadow-green-600/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting && <Loader2 className="animate-spin h-5 w-5" />}
        {isSubmitting ? 'Guardando...' : 'Guardar nueva contraseña'}
      </button>
    </form>
  );
};