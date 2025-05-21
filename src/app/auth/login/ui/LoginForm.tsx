// components/LoginForm.tsx
"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  IoInformationOutline,
  IoMailOutline,
  IoLockClosedOutline,
} from "react-icons/io5";
import clsx from "clsx";

interface LoginFormInputs {
  email: string;
  password: string;
}

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();
  const router = useRouter();
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    setIsLoading(true);
    const result = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (result?.error) {
      setLoginError("Las credenciales no son correctas");
      setIsLoading(false);
    } else {
      router.push("/admin/events");
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-2xl mx-4">
      <h1 className="flex items-center justify-center gap-2 text-2xl font-bold mb-6 text-center">
        Iniciar Sesión
        <IoLockClosedOutline className="h-6 w-6 text-green-500" />
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <label
          htmlFor="email"
          className="mb-1 text-gray-700 flex items-center gap-1"
        >
          <IoMailOutline className="h-5 w-5" />
          Correo electrónico
        </label>
        {/* Contenedor para poder ubicar el ícono de forma absoluta (si se desea colocar adentro) */}
        <div className="relative mb-5">
          <input
            id="email"
            type="email"
            {...register("email", { required: "El correo es requerido" })}
            className="w-full px-5 py-2 border bg-gray-200 rounded pl-10"
          />
        </div>
        {errors.email && (
          <p className="text-sm text-red-500 mb-3">{errors.email.message}</p>
        )}

        <label
          htmlFor="password"
          className="mb-1 text-gray-700 flex items-center gap-1"
        >
          <IoLockClosedOutline className="h-5 w-5" />
          Contraseña
        </label>
        <div className="relative mb-5">
          <input
            id="password"
            type="password"
            {...register("password", {
              required: "La contraseña es requerida",
            })}
            className="w-full px-5 py-2 border bg-gray-200 rounded pl-10"
          />
        </div>
        {errors.password && (
          <p className="text-sm text-red-500 mb-3">{errors.password.message}</p>
        )}

        {loginError && (
          <div className="flex items-center space-x-2 mb-5">
            <IoInformationOutline className="h-5 w-5 text-red-500" />
            <span className="text-sm text-red-500">{loginError}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className={clsx(
            "px-4 py-2 rounded font-bold transition cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed",
            {
              "bg-green-400 hover:bg-green-500": !isLoading,
              "bg-green-300": isLoading,
            }
          )}
        >
          {isLoading ? "Loading..." : "Ingresar"}
        </button>

        {/* Divisor */}
        <div className="flex items-center my-5">
          <div className="flex-1 border-t border-gray-500"></div>
          <div className="px-2 text-gray-800">O</div>
          <div className="flex-1 border-t border-gray-500"></div>
        </div>

        <Link href="/" className="text-center text-blue-600 hover:underline">
          ← Volver
        </Link>
      </form>
    </div>
  );
}
