import type { NextConfig } from "next";

// GitHub Pages : export statique. Le dépôt 265nathantogolo.github.io est un
// site utilisateur servi à la racine, donc basePath vide par défaut.
// Pour un dépôt de projet (ex. /portfolio) : NEXT_PUBLIC_BASE_PATH=/portfolio.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
