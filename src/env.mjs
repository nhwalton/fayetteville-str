import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
    NEXT_PUBLIC_MAPBOX_MAPS_API_KEY: z.string(),
    NEXT_PUBLIC_GOOGLE_GEOCODE_API_KEY: z.string(),
    GOOGLE_CREDENTIALS: z.string(),
    GOOGLE_STORAGE_BUCKET: z.string(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string().min(1),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_MAPBOX_MAPS_API_KEY:
      process.env.NEXT_PUBLIC_MAPBOX_MAPS_API_KEY,
    NEXT_PUBLIC_GOOGLE_GEOCODE_API_KEY:
      process.env.NEXT_PUBLIC_GOOGLE_GEOCODE_API_KEY,
    GOOGLE_CREDENTIALS: process.env.GOOGLE_CREDENTIALS,
    GOOGLE_STORAGE_BUCKET: process.env.GOOGLE_STORAGE_BUCKET,
    // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
   * This is especially useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
