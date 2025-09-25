import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint:{
    ignoreDuringBuilds:true
  },
 devIndicators:false,
  // ✅ Recommended way
   typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
    
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.mux.com",
      },

      {
        protocol: "https",
        hostname: "l1r4gpfm3d.ufs.sh",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
