import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true, // Para evitar errores de ESLint en build de producción deuda temporalmente
  },
};

export default nextConfig;
