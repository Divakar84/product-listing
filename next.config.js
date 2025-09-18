/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // If you switch to next/image, add external domains here.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos'
      }
    ]
  }
}

module.exports = nextConfig
