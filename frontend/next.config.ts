import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
   /* config options here */

   // Allow images from localhost and Strapi Cloud (including media subdomain)
   images: {
      domains: [
         'localhost',
         'strapipi.vercel.app',
         'popular-champion-998b7da02f.strapiapp.com',
         'popular-champion-998b7da02f.media.strapiapp.com',
      ],
   },
};

export default nextConfig;
