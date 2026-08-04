import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Pins the workspace root to this directory explicitly. Without this,
  // Next.js infers the root by walking up from here looking for a
  // lockfile, and stops at the *first* one it finds — which can be a
  // stray/unrelated lockfile in a parent folder that has nothing to do
  // with this project (that's what was happening here: an orphaned,
  // empty package-lock.json in the parent "작업 폴더" directory, which
  // has no package.json of its own). Setting this explicitly is the
  // documented fix and makes root detection deterministic regardless of
  // what else does or doesn't exist above this folder.
  outputFileTracingRoot: path.join(__dirname),
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      { source: "/doctor.html", destination: "/doctor", permanent: true },
      { source: "/treatment.html", destination: "/treatment", permanent: true },
      { source: "/mission.html", destination: "/mission", permanent: true },
      { source: "/index.html", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
