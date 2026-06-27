import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      allowedOrigins: isDev
        ? [
            "localhost:3000",
            "bug-free-rotary-phone-r7q7v5xxqp73pqpp-3000.app.github.dev",
            "*.app.github.dev",
          ]
        : [],
    },
  },
};

export default nextConfig;
