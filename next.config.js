/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverComponentsExternalPackages: ['better-sqlite3']
  },
  async redirects() {
    return [
      {
        source: '/admin/login',
        destination: '/admin',
        permanent: true,
      },
      {
        source: '/admin-login',
        destination: '/admin',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
