/**
 * Next.js configuration
 *
 * Centralizes framework-level behavior for the monolith.
 * Keeps the setup small while enabling typed routes and Vercel-friendly defaults.
 */
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
};

export default nextConfig;
