/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['images.unsplash.com', 'ui-avatars.com', 'api.qrserver.com'],
  },
}

module.exports = nextConfig
