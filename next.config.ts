import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      { protocol: "https", hostname: "musicmeta-phinf.pstatic.net" },
      { protocol: "https", hostname: "phinf.pstatic.net" },
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "image.genie.co.kr" },
      { protocol: "https", hostname: "cdnimg.melon.co.kr" },
    ],
  },
  serverExternalPackages: ["youtubei.js"],
  allowedDevOrigins: ['10.80.162.23'],
};

export default nextConfig;
