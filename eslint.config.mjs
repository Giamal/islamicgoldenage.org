/**
 * ESLint configuration
 *
 * Applies the official Next.js flat config presets with an additional repository-level ignore list.
 * This avoids compatibility issues between legacy config adapters and current ESLint releases.
 */
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    ignores: [".next/**", "coverage/**", "dist/**", "node_modules/**"],
  },
];

export default eslintConfig;
