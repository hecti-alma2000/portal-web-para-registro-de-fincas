'use client';

import Link from 'next/link';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { registerUser } from '@/actions/auth/register';
import { login } from '@/actions/auth/login';
import { Eye, EyeOff, OctagonAlert, Loader2 } from 'lucide-react';

// Estilos de inputs unificados
const inputClasses =
  'w-full px-5 py-4 text-base bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all placeholder:text-zinc-400 text-zinc-900 dark:text-zinc-100';

const labelClasses = 'block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2 ml-1';

type FormInputs = {
  name: string;
  email: string;
  password: string;
};

export const RegisterForm = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado de carga local visual

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>();

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setIsSubmitting(true);
    setErrorMessage('');

    const resp = await registerUser(data.name, data.email, data.password);

    if (!resp.ok) {
      setErrorMessage(resp.message as any);
      setIsSubmitting(false);
      return;
    }

    await login(data.email.toLowerCase(), data.password);
    window.location.replace('/');
  };

  return (
    // Contenedor: ocupa todo el ancho interior de la tarjeta (usar padding de la tarjeta)
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* Mensaje de Error */}
        {errorMessage && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 animate-in fade-in slide-in-from-top-2">
            <OctagonAlert className="h-5 w-5 shrink-0" />
            <span className="text-sm font-medium">{errorMessage}</span>
          </div>
        )}

        {/* Nombre */}
        <div>
          <label htmlFor="name" className={labelClasses}>
            Nombre Completo
          </label>
          <input
            id="name"
            type="text"
            placeholder="Ej: María Rodríguez"
            className={inputClasses}
            {...register('name', { required: 'El nombre es obligatorio' })}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-2 font-medium ml-1">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className={labelClasses}>
            Correo Electrónico
          </label>
          <input
            id="email"
            type="email"
            placeholder="usuario@ejemplo.com"
            className={inputClasses}
            {...register('email', {
              required: 'El correo es obligatorio',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: 'Correo no válido',
              },
            })}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-2 font-medium ml-1">{errors.email.message}</p>
          )}
        </div>

        {/* Contraseña */}
        <div>
          <label htmlFor="password" className={labelClasses}>
            Contraseña
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Mínimo 6 caracteres"
              className={`${inputClasses} pr-12`} // Padding extra a la derecha para el ojo
              {...register('password', {
                required: 'La contraseña es obligatoria',
                minLength: { value: 6, message: 'La contraseña debe tener al menos 6 caracteres' },
              })}
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors p-1"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1} // Evita que se enfoque al tabulador
            >
              {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-2 font-medium ml-1">{errors.password.message}</p>
          )}
        </div>

        {/* Botón de Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-lg shadow-lg shadow-green-600/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting && <Loader2 className="animate-spin h-5 w-5" />}
          {isSubmitting ? 'Creando cuenta...' : 'Crear Cuenta'}
        </button>

        {/* Footer / Login Link */}
        <div className="text-center pt-2">
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">
            ¿Ya tienes una cuenta?{' '}
            <Link
              href="/auth/login"
              className="text-green-600 dark:text-green-400 font-bold hover:underline underline-offset-4"
            >
              Ingresa aquí
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};
