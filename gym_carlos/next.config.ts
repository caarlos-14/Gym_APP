import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'khornjogizsrlfdzvczz.supabase.co', 
        pathname: '/storage/v1/object/public/**',
      },

    ],
    
  },
  devIndicators: false // Desactiva los indicadores de desarrollo
};

export default nextConfig;
