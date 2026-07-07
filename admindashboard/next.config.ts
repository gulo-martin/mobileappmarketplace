import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Skip Next.js image optimization so external URLs work without hostname config.
    unoptimized: true,
    // Allow SVGs when needed
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;
