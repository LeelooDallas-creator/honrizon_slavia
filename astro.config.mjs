// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://horizon-slavia.com",
  integrations: [mdx(), sitemap()],
  build: {
    inlineStylesheets: "auto",
  },
  compressHTML: true,
  vite: {
    build: {
      cssMinify: true,
      minify: "terser",
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes("node_modules")) {
              return "vendor";
            }
          },
        },
      },
    },
  },
});
