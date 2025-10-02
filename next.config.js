/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        port: '',
        pathname: '/t/p/**',
      },
      {
        protocol: 'https',
        hostname: 'dsag3w1du2cu2.cloudfront.net',
        port: '',
        pathname: '/t/p/**',
      },
    ],
  },
};

module.exports = nextConfig;
