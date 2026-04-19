import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Server variables
   */
  server: {
    DATABASE_URL: z.string().url(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    // Optional: no OAuth providers are configured yet (`src/server/auth.ts`). Vercel runs
    // `next build` with NODE_ENV=production; requiring a secret here breaks Preview unless
    // every branch sets NEXTAUTH_SECRET in the dashboard.
    NEXTAUTH_SECRET: z.string().optional(),
    NEXTAUTH_URL: z.preprocess(
      // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
      // Since NextAuth.js automatically uses the VERCEL_URL if present.
      (str) => process.env.VERCEL_URL ?? str,
      // VERCEL_URL doesn't include `https` so it cant be validated as a URL.
      // `.optional()` covers rare cases where VERCEL is set before VERCEL_URL is injected.
      process.env.VERCEL ? z.string().optional() : z.string().url()
    ),
    // Chrome is only used by the separate render worker; the Next.js app on Vercel does not need a real path.
    CHROME_PATH: z.preprocess((val) => {
      const v = val === "" ? undefined : val;
      if (process.env.VERCEL && (v === undefined || v === null)) {
        return "auto";
      }
      return v;
    }, z.string()),
    WEB_URL: z.string().optional(),
  },

  /**
   * Client variables
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
  },

  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    CHROME_PATH: process.env.CHROME_PATH,
    WEB_URL: process.env.WEB_URL,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
