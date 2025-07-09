import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 devIndicators:false,
  // ✅ Recommended way
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
