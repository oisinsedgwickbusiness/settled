import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const articles = await getCollection(
    "articles",
    ({ data }) => !data.draft,
  );
  return rss({
    title: "Settled — considered home goods",
    description:
      "Long-form picks for small-space kitchens. Real testing, no fluff.",
    site: context.site!,
    items: articles
      .sort(
        (a, b) =>
          new Date(b.data.date).valueOf() - new Date(a.data.date).valueOf(),
      )
      .map((a) => ({
        title: a.data.title,
        description: a.data.description,
        pubDate: new Date(a.data.date),
        link: `/${a.slug}/`,
      })),
  });
}
