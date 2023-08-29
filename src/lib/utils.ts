import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { env } from "@/env.mjs";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDomain() {
  const protocol = process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
    ? "https"
    : "http";

  return `${protocol}://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
}
