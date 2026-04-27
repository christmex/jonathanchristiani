import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/nihon-fest-2026",
        destination: "/slider/nihon-fest-2026",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
