import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "stg4mk0ipm.ufs.sh",
      },
    ],
  },
};

export default nextConfig;
