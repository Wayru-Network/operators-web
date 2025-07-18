import type { NextConfig } from "next";

const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME!;

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    serverActions: {
      bodySizeLimit: "40mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: `${accountName}.blob.core.windows.net`,
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
