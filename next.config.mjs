/** @type {import('next').NextConfig} */
const nextConfig = {
  // NOTE: reactStrictMode disabled to prevent double-mount race condition in AuthContext
  // that causes logged-in users to briefly appear unauthenticated after new deployments.
  reactStrictMode: false,

  // Expose a stable JWT secret and app version to all server-side code.
  // IMPORTANT: Set JWT_SECRET in Vercel environment variables for production.
  // Never change the fallback string — doing so invalidates all existing user tokens.
  env: {
    JWT_SECRET: process.env.JWT_SECRET || 'groceryhub_jwt_secret_stable_2026_ng',
    NEXT_PUBLIC_APP_VERSION: '2026-08',
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
};

export default nextConfig;
