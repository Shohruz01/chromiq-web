import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",

  images: {
    unoptimized: true,
  },

  trailingSlash: true,

  basePath: isProd ? "/chromiq-web" : "",

  assetPrefix: isProd ? "/chromiq-web/" : "",
};

export default nextConfig;
