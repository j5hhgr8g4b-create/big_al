import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  devIndicators: process.env.BIG_AL_VISUAL_TEST === "1" ? false : undefined,
  reactStrictMode: true,
  experimental: {
    serverActions: {
      allowedOrigins: isDev
        ? [
            "localhost:3000",
            "*.app.github.dev",
          ]
        : [],
    },
  },
};

export default nextConfig;
