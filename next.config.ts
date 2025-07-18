import type { NextConfig } from "next";

const devAssetsHostname = "firmwarebuilds.blob.core.windows.net";
const prodAssetsHostname = "wayruosimages.blob.core.windows.net";

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
        hostname: devAssetsHostname,
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: prodAssetsHostname,
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
