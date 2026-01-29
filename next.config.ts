import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-5e52d815a0ea48b5aa905910e63faf7b.r2.dev",
        pathname: "/thumbnails/**",
      },
    ],
  },
};

export default nextConfig;
