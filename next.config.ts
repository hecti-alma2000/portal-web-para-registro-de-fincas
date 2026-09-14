// next.config.ts
import withSerwistInit from '@serwist/next';
import type { NextConfig } from 'next';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Revisión para versionar la página de fallback offline
const revision =
  (() => {
    try {
      const { spawnSync } = require('node:child_process');
      return spawnSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf-8' }).stdout?.trim();
    } catch {
      return undefined;
    }
  })() || String(Date.now());

// Escaneo de archivos estáticos de public/ para el precache PWA.
// (Añadir additionalPrecacheEntries hace que @serwist/next NO escanee public/ por sí
// mismo, por eso combinamos manualmente ambas fuentes.)
const publicDirectory = join(process.cwd(), 'public');
const publicPrecacheEntries = require('glob')
  .sync('**/*', {
    nodir: true,
    cwd: publicDirectory,
    ignore: ['sw.js', 'sw.js.map', 'swe-worker-*.js', '*.map'],
  })
  .map((filePath: string) => ({
    url: '/' + filePath.replace(/\\/g, '/'),
    revision: createHash('sha1')
      .update(readFileSync(join(publicDirectory, filePath)))
      .digest('hex'),
  }));

const withSerwist = withSerwistInit({
  swSrc: 'src/app/sw.ts',
  swDest: 'public/sw.js',
  register: true,
  reloadOnOnline: true,
  // En desarrollo (@serwist/next no soporta Turbopack) el SW se genera solo en build/start
  disable: process.env.NODE_ENV !== 'production',
  additionalPrecacheEntries: [
    { url: '/~offline', revision },
    ...publicPrecacheEntries,
  ],
});

const nextConfig: NextConfig = {
  reactStrictMode: false, // Activa el modo estricto de React
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_URL_INTERNAL: process.env.NEXTAUTH_URL_INTERNAL,
  },
};

export default withSerwist(nextConfig);