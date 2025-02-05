import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/dqq1jlbwk/image/upload/**",
      },
    ],
  },
};

export default nextConfig;
