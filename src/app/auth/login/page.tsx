// app/auth/login/page.tsx
"use client";

import React from "react";
import AnimatedBackground from "@/components/effects/AnimatedBackground";
import LoginForm from "./ui/LoginForm";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Fondo animado en el background */}
      <AnimatedBackground />
      {/* Componente LoginForm en primer plano */}
      <div className="relative z-10">
        <LoginForm />
      </div>
    </div>
  );
}
