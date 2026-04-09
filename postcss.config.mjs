/**
 * PostCSS configuration
 *
 * Enables Tailwind CSS v4 through the official PostCSS plugin.
 * This stays minimal because Next.js already handles the surrounding build pipeline.
 */
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
