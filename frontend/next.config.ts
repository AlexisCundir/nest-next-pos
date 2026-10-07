import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // habilitar esto solo para desarrollo, QUITAR EN PRODUCCION
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: process.env.DOMAIN!
      }
    ]
  }
};

export default nextConfig;
