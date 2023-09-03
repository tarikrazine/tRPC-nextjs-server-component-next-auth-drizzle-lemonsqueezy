import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
 
export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    OPEN_AI_API_KEY: z.string().min(1),
    NEXTAUTH_SECRET : z.string().min(1),
    GOOGLE_CLIENT_SECRET : z.string().min(1),
    GOOGLE_CLIENT_ID : z.string().min(1),
    GITHUB_CLIENT_ID: z.string().min(1),
    GITHUB_CLIENT_SECRET: z.string().min(1),
    NODE_ENV: z.string().min(1),
    LEMON_SQUEEZY_API_KEY: z.string().min(1),
    PRODUCT_ID: z.string().min(1),
    POST_HOG: z.string().min(1),
    LEMON_SQUEEZY_SIGNING_SECRET: z.string().min(1),
  },
  client: {
    //NEXT_PUBLIC_PUBLISHABLE_KEY: z.string().min(1),
    NEXT_PUBLIC_PRODUCT_ID: z.string().min(1),
  },
  // If you're using Next.js < 13.4.4, you'll need to specify the runtimeEnv manually
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    OPEN_AI_API_KEY: process.env.OPEN_AI_API_KEY,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    NODE_ENV: process.env.NODE_ENV,
    LEMON_SQUEEZY_API_KEY: process.env.LEMON_SQUEEZY_API_KEY,
    NEXT_PUBLIC_PRODUCT_ID: process.env.NEXT_PUBLIC_PRODUCT_ID,
    PRODUCT_ID: process.env.PRODUCT_ID,
    POST_HOG: process.env.POST_HOG,
    LEMON_SQUEEZY_SIGNING_SECRET: process.env.LEMON_SQUEEZY_SIGNING_SECRET
  },
  // For Next.js >= 13.4.4, you only need to destructure client variables:
  // experimental__runtimeEnv: {
  //   NEXT_PUBLIC_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_PUBLISHABLE_KEY,
  // }
});