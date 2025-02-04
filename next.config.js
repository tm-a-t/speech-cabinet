/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  eslint: {
    // ignoreDuringBuilds: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10.5mb',  // The approximate maximum size of localstorage
    },
  },
};

export default config;
