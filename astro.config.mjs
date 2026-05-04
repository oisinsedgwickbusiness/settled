// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// Site URL is canonical for sitemap.xml + RSS feed + Open Graph tags.
// Repointing the affiliate site to a different domain is a one-line
// change here + DNS update in the registrar.
export default defineConfig({
  site: "https://settled.world",
  trailingSlash: "ignore",
  integrations: [
    sitemap({
      // Articles + the home page; nothing else is publicly addressable yet.
      filter: (page) =>
        !page.includes("/preview/") && !page.includes("/draft/"),
    }),
  ],
  build: {
    // Static-only output — Vercel just serves the built files.
    format: "directory",
  },
});
