import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
   /* config options here */

   // Allow images from localhost and Strapi Cloud
   images: {
      domains: ['localhost', 'strapipi.vercel.app', 'popular-champion-998b7da02f.strapiapp.com'],
   },
};

export default nextConfig;
