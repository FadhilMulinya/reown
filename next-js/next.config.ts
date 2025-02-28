import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  externals: ['pino-pretty', 'lokijs', 'encoding'],
  devIndicators:  false,
  
};

export default nextConfig;
