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
      // router.replace("/");
      window.location.replace('/');
    }
  }, [state]);

  return (
    <form action={dispatch} className="flex flex-col">
      <label htmlFor="email">Correo electrónico</label>
      <input className="px-5 py-2 border bg-gray-200 rounded mb-5" type="email" name="email" />
      <label htmlFor="email">Contraseña</label>
      <div className="relative">
        <input
          className="px-5 py-2 border bg-gray-200 rounded mb-1 pr-12 w-full"
          type={showPassword ? 'text' : 'password'}
          name="password"
        />
        <button
          type="button"
          aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          className="absolute right-3 top-0 bottom-0 m-auto h-9 w-9 flex items-center justify-center text-gray-600 bg-transparent border-0"
          onMouseDown={() => setShowPassword(true)}
          onMouseUp={() => setShowPassword(false)}
          onMouseLeave={() => setShowPassword(false)}
          onTouchStart={() => setShowPassword(true)}
          onTouchEnd={() => setShowPassword(false)}
        >
          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
      <div className="flex h-8 items-end space-x-1" aria-live="polite" aria-atomic="true">
        {state === 'CredentialsSignin' && (
          <div className="mb-2 flex flex-row">
            <OctagonAlert className="h-5 w-5 text-red-500" />{' '}
            <p className="text-sm text-red-500">Las Credenciales no son Correctas </p>
          </div>
        )}
      </div>
      <LoginButton />
      {/* divisor line */}
      <div className="flex items-center my-5">
        <div className="flex-1 border-t border-gray-500"></div>
        <div className="px-2 text-gray-800">O</div>
        <div className="flex-1 border-t border-gray-500"></div>
      </div>
      <Link href="/auth/new-account" className="btn-secondary text-center">
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
      className={clsx({
        'btn-primary': !pending,
        'btn-disable': pending,
      })}
      disabled={pending}
    >
      Ingresar
    </button>
  );
};
