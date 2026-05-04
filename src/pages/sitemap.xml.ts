// Manual sitemap.xml endpoint. Replaces @astrojs/sitemap (which has
// a build-time crash on Astro 4.x + empty content collections, the
// state we're in pre-Amazon-Associates-approval). Lists every published
// article + the static pages (home, about, editorial-policy).

import { getCollection } from "astro:content";
import type { APIContext } from "astro";

const STATIC_PATHS = ["/", "/about/", "/editorial-policy/"];

function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET({ site }: APIContext) {
  if (!site) {
    return new Response("site not configured", { status: 500 });
  }
  const articles = await getCollection(
    "articles",
    ({ data }) => !data.draft,
  );
  const urls: { loc: string; lastmod?: string }[] = [
    ...STATIC_PATHS.map((p) => ({ loc: new URL(p, site).toString() })),
    ...articles.map((a) => ({
      loc: new URL(`/${a.slug}/`, site).toString(),
      lastmod: new Date(a.data.date).toISOString(),
    })),
  ];

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls
      .map((u) => {
        const lastmod = u.lastmod ? `\n    <lastmod>${escape(u.lastmod)}</lastmod>` : "";
        return `  <url>\n    <loc>${escape(u.loc)}</loc>${lastmod}\n  </url>`;
      })
      .join("\n") +
    `\n</urlset>\n`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
