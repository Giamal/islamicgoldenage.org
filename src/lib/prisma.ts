/**
 * Prisma client singleton
 *
 * Exposes a single Prisma client instance across the server runtime.
 * This avoids accidental connection churn during local development while keeping the API tiny.
 */
import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

/**
 * Reuses the Prisma client in development to prevent duplicate instances after hot reloads.
 */
export const prisma =
  globalThis.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}
