'use server';

import { createHash, randomBytes } from 'crypto';
import bcryptjs from 'bcryptjs';
import { Resend } from 'resend';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { PasswordResetEmail } from '@/components/emails/PasswordResetEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

const TOKEN_EXPIRATION_MS = 60 * 60 * 1000; // 1 hora
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

const hashToken = (rawToken: string) => createHash('sha256').update(rawToken).digest('hex');

const passwordSchema = z.object({
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

/**
 * Envía un correo con un enlace de recuperación si el email existe.
 * No revela si la cuenta existe (respuesta genérica).
 */
export async function requestPasswordReset(email: string) {
  const parsedEmail = z.string().email().safeParse(email);
  if (!parsedEmail.success) {
    return { ok: false, message: 'Ingresa un correo válido' };
  }

  const normalizedEmail = parsedEmail.data.toLowerCase();

  try {
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

    // Siempre respondemos lo mismo para no divulgar si el correo está registrado
    if (!user) {
      return {
        ok: true,
        message: 'Si el correo existe en nuestro sistema, recibirás un enlace para restablecer tu contraseña.',
      };
    }

    const rawToken = randomBytes(32).toString('hex');

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: hashToken(rawToken),
        passwordResetTokenExpires: new Date(Date.now() + TOKEN_EXPIRATION_MS),
      },
    });

    const resetUrl = `${APP_URL}/auth/reset-password?token=${rawToken}`;

    try {
      const { error } = await resend.emails.send({
        from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
        to: normalizedEmail,
        subject: 'Restablece tu contraseña',
        react: PasswordResetEmail({ nombre: user.name || 'usuario', resetUrl }),
      });

      if (error) {
        console.error('Error de Resend al enviar correo de recuperación:', error);
        return {
          ok: false,
          message: 'No se pudo enviar el correo. Inténtalo de nuevo en unos minutos.',
        };
      }
    } catch (emailError) {
      console.error('Error intentando enviar el correo de recuperación:', emailError);
      return {
        ok: false,
        message: 'No se pudo enviar el correo. Inténtalo de nuevo en unos minutos.',
      };
    }

    return {
      ok: true,
      message: 'Si el correo existe en nuestro sistema, recibirás un enlace para restablecer tu contraseña.',
    };
  } catch (error) {
    console.error('Error en requestPasswordReset:', error);
    return { ok: false, message: 'Ocurrió un error inesperado. Inténtalo de nuevo.' };
  }
}

/**
 * Valida el token y actualiza la contraseña del usuario.
 * El token es de un solo uso y expira a la hora.
 */
export async function resetPassword(rawToken: string, newPassword: string) {
  const parsedPassword = passwordSchema.safeParse({ password: newPassword });
  if (!parsedPassword.success) {
    return { ok: false, message: parsedPassword.error.issues[0].message };
  }

  if (!rawToken || rawToken.length < 32) {
    return { ok: false, message: 'El enlace de recuperación no es válido' };
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: hashToken(rawToken),
        passwordResetTokenExpires: { gt: new Date() },
      },
    });

    if (!user) {
      return { ok: false, message: 'El enlace es inválido o ya expiró. Solicita uno nuevo.' };
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: bcryptjs.hashSync(newPassword),
        passwordResetToken: null,
        passwordResetTokenExpires: null,
      },
    });

    return { ok: true, message: 'Tu contraseña fue actualizada. Ya puedes iniciar sesión.' };
  } catch (error) {
    console.error('Error en resetPassword:', error);
    return { ok: false, message: 'Ocurrió un error inesperado. Inténtalo de nuevo.' };
  }
}