import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A stray package-lock.json in a parent dir can make Turbopack pick the wrong
  // workspace root; pin it to this project. (See CLAUDE.md gotchas.)
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
