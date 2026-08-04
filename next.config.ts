import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // outputFileTracingRoot was pinned here during stage 1 to work around an
  // orphaned, empty package-lock.json that used to sit in the parent
  // "작업 폴더" directory (no package.json of its own), which made Next's
  // local-dev root-detection misfire. That lockfile has since been
  // deleted, so the workaround is gone too — pinning it explicitly instead
  // overrides Vercel's own root-directory detection for the build's file
  // tracing step (`@vercel/nft`, the "Collecting build traces" step), which
  // is the suspected cause of a build that completes tracing but never
  // reports "Build Completed" on Vercel. Let Next.js/Vercel infer this on
  // their own; only reintroduce it if a real monorepo lockfile-detection
  // problem reappears, and prefer scoping it to the actual repo root Vercel
  // uses rather than `__dirname`.
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
