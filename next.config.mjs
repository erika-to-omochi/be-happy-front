import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['https://be-happy-front.vercel.app/'],
  },
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve('src');
    return config;
  },
};

export default nextConfig;
