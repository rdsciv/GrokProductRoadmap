import type { NextConfig } from "next";
import path from "node:path";

// GitHub Pages project site: https://<user>.github.io/<repo>/
const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "GrokProductRoadmap";
const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: isGitHubPages ? `/${repoName}` : "",
  assetPrefix: isGitHubPages ? `/${repoName}/` : undefined,
  transpilePackages: ["@fft/schema"],
  outputFileTracingRoot: path.join(__dirname, "../.."),
};

export default nextConfig;
