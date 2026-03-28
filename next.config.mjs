import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["next-sanity"],
  turbopack: {
    root: __dirname,
  },
  webpack: (config) => {
    config.resolve.alias["styled-components"] = resolve(
      "./node_modules/styled-components"
    );
    return config;
  },
};

export default nextConfig;
