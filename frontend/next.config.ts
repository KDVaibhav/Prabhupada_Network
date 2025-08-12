import { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "ik.imagekit.io",
      "assets.aceternity.com",
      "images.unsplash.com",
      "i.ytimg.com",
      "example.com",
    ],
  },
};

export default nextConfig;
