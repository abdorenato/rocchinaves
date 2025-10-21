/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix: 'https://radar-renato-abdo.vercel.app',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
