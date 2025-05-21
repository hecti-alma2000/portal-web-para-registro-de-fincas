// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, // Activa el modo estricto de React
  swcMinify: true, // Usa SWC para builds y minificación más rápidas
  images: {
    domains: ["example.com"], // Dominios permitidos para imágenes
  },
  async redirects() {
    return [
      {
        source: "/old-path",
        destination: "/new-path",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
