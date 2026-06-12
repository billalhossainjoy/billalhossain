import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/content"],

  // Include the shared markdown content files in the serverless deployment bundle.
  // Without this, Vercel's output file tracer misses them because fs.readFileSync
  // calls are dynamic and can't be statically detected.
  outputFileTracingIncludes: {
    "/**": ["../../packages/content/md/**/*"],
  },
};

export default nextConfig;
