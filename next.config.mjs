/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for Docker deployment
  output: 'standalone',
  
  images: {
    domains: [
      "d1foa0aaimjyw4.cloudfront.net",
      "admin.tilalr.com",
      "test.tilalr.com",
    ],
    // Enable image optimization in Docker
    unoptimized: process.env.NODE_ENV === 'development',
  },
  
  // Experimental features for better Docker support
  experimental: {
    // Reduce memory usage during build
    workerThreads: false,
    cpus: 1,
  },
};

export default nextConfig;


