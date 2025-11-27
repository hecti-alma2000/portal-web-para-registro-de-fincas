import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

/**
 * Middleware para proteger rutas del app.
 * - Redirige a `/auth/login` si no hay sesión.
 * - Protege rutas `/admin/*` para que solo `role === 'admin'` pueda acceder.
 *
 * Nota: Mantén las comprobaciones en cada `page.tsx` como capa adicional de seguridad.
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Lista de rutas a proteger (puedes añadir más según necesites)
  const protectedPaths = [
    '/profile',
    '/certificacion',
    '/registro-finca',
    '/mis-solicitudes',
    '/admin',
  ];

  // Comprobar si la ruta actual requiere protección
  const requiresAuth = protectedPaths.some((p) => pathname === p || pathname.startsWith(p + '/'));

  if (!requiresAuth) return NextResponse.next();

  // Intentar obtener el token (decodificado) usando next-auth
  // Asegúrate de tener `NEXTAUTH_SECRET` en tus env vars
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Si no hay token, redirigir al login con callback
  if (!token) {
    const signInUrl = new URL('/auth/login', req.url);
    signInUrl.searchParams.set('callbackUrl', req.url);
    return NextResponse.redirect(signInUrl);
  }

  // Si la ruta es /admin/*, comprobar rol
  if (pathname.startsWith('/admin')) {
    // En `auth.config.ts` guardamos el usuario en `token.data`
    const role = (token as any)?.data?.role ?? (token as any)?.role;
    if (role !== 'admin') {
      // Redirigir a home (o a una página 'no autorizado')
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next();
}

// Ejecutar middleware sólo en las rutas que definimos (mejora el rendimiento)
export const config = {
  matcher: [
    '/profile/:path*',
    '/certificacion/:path*',
    '/registro-finca/:path*',
    '/mis-solicitudes/:path*',
    '/admin/:path*',
  ],
};
