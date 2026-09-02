import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  allowedDevOrigins: ['54.232.189.113'],
  reactStrictMode: true,
  typedRoutes: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
