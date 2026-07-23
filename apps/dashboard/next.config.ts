import type { NextConfig } from "next";
import path from "node:path";

const isGitHubPages = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  transpilePackages: ["@fft/db", "@fft/schema"],
  // monorepo: allow importing from packages
  outputFileTracingRoot: path.join(__dirname, "../.."),
  output: "export",
  trailingSlash: true,
  basePath: isGitHubPages ? "/GrokProductRoadmap" : "",
  assetPrefix: isGitHubPages ? "/GrokProductRoadmap/" : undefined,
};

export default nextConfig;
