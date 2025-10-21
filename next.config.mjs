/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/radar',
  assetPrefix: '/radar',
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
