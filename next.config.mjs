/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd1foa0aaimjyw4.cloudfront.net',
      },
      {
        protocol: 'https',
        hostname: 'admin.tilalr.com',
      },
      {
        protocol: 'https',
        hostname: 'tilalr.com',
      },
      {
        protocol: 'https',
        hostname: 'www.tilalr.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
      },
    ],
    unoptimized: process.env.NODE_ENV === 'development',
  },
  async headers() {
    return [
      {
        source: '/:path(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
    ];
  },

  async rewrites() {
  return [
    {
      source: '/api/:path*',
      destination: 'http://localhost:8000/api/:path*',
    },
    {
      source: '/:lang/proxy/:path*',
      destination: '/proxy/:path*',
    },
    {
      source: '/:lang/proxy',
      destination: '/proxy',
    },
  ];
}
};

export default nextConfig;


