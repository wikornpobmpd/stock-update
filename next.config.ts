import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "cdn.shopify.com" },
      { hostname: "obs-ect.line-scdn.net" },
      { hostname: "jst-yikan-picspace.oss-ap-southeast-1.aliyuncs.com" },
      { hostname: "**.aliyuncs.com" },
    ],
  },
};

export default nextConfig;
