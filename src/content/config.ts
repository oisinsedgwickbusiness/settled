// Astro content collection schema for affiliate articles.
// The affiliate_writer in togha-agent emits Markdown files matching
// this front-matter shape. Keep this in sync with
// app/agents/affiliate_writer.py:_front_matter().

import { defineCollection, z } from "astro:content";

const articles = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string().min(20).max(120),
    slug: z.string(),
    description: z.string().min(20).max(200),
    date: z.coerce.date(),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    pickCount: z.number().int().nonnegative().default(0),
    asins: z.array(z.string()).default([]),
    wordCount: z.number().int().nonnegative().default(0),
    draft: z.boolean().default(false),
  }),
});

export const collections = { articles };
