import { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["ik.imagekit.io", "assets.aceternity.com", "images.unsplash.com", "example.com"], // Allow ImageKit domain
  },
};

export default nextConfig;
