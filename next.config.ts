import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },

  trailingSlash: true,

  basePath: "",
  assetPrefix: "",
};

export default nextConfig;
