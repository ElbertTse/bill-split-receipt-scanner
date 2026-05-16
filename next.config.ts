import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/bill-split-receipt-scanner",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
