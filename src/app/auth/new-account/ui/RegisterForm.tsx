"use client";
import Link from "next/link";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { registerUser } from "@/actions/auth/register";
import { login } from "@/actions";

type FormInputs = {
  name: string;
  email: string;
  password: string;
};

export const RegisterForm = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>();
  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setErrorMessage("");
    const { email, name, password } = data;
    // server action
    const resp = await registerUser(name, email, password);
    if (!resp.ok) {
      setErrorMessage(resp.message as any);
      return;
    }
    await login(email.toLowerCase(), password);
    window.location.replace("/");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col">
        <p className="text-sm text-red-500">{errorMessage}</p>
        <label htmlFor="name">Nombre Completo</label>
        <input
          className="px-5 py-2 border bg-gray-200 rounded mb-1"
          type="text"
          {...register("name", { required: "El nombre es obligatorio" })}
        />
        {errors.name && (
          <span className="text-red-500 text-sm mb-5">
            {errors.name.message}
          </span>
        )}

        <label htmlFor="email">Correo electrónico</label>
        <input
          className="px-5 py-2 border bg-gray-200 rounded mb-1"
          type="email"
          {...register("email", {
            required: "El correo electrónico es obligatorio",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              message: "Debe ser un correo electrónico válido",
            },
          })}
        />
        {errors.email && (
          <span className="text-red-500 text-sm mb-5">
            {errors.email.message}
          </span>
        )}

        <label htmlFor="password">Contraseña</label>
        <input
          className="px-5 py-2 border bg-gray-200 rounded mb-1"
          type="password"
          {...register("password", {
            required: "La contraseña es obligatoria",
            minLength: {
              value: 6,
              message: "La contraseña debe tener al menos 6 caracteres",
            },
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/,
              message:
                "La contraseña debe contener al menos: una mayúscula, una minúscula y un número",
            },
          })}
        />
        {errors.password && (
          <span className="text-red-500 text-sm mb-5">
            {errors.password.message}
          </span>
        )}

        <button className="btn-primary">Crear Cuenta</button>

        {/* divisor line */}
        <div className="flex items-center my-5">
          <div className="flex-1 border-t border-gray-500"></div>
          <div className="px-2 text-gray-800">O</div>
          <div className="flex-1 border-t border-gray-500"></div>
        </div>

        <Link href="/auth/login" className="btn-secondary text-center">
          Ingresar
        </Link>
      </div>
    </form>
  );
};
