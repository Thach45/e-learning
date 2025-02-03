import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['cdn.freebiesupply.com', 'upload.wikimedia.org',"store.storeimages.cdn-apple.com","qtu.edu.vn", "res.cloudinary.com"],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.freebiesupply.com',
        port: '',
        pathname: '/**',
        search: '',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        port: '',
        pathname: '/**',
        search: '',
      },
      
    ],


  }
};

export default nextConfig;
