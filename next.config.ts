/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    proxyClientMaxBodySize: "75mb",
  },
};

module.exports = nextConfig;
