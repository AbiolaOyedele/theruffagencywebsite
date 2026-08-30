import path from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Pin the workspace root so Turbopack ignores lockfiles above this project.
  turbopack: { root: path.resolve(process.cwd()) },
};

export default nextConfig;
