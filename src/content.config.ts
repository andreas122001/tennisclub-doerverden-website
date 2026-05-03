// Defines the shape of every content collection.
// Astro validates frontmatter against these schemas at build time,
// so a typo or missing required field breaks the build immediately rather than silently.

import { defineCollection } from 'astro:content';
import { z } from 'zod';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(), // coerce converts the "2025-01-01" frontmatter string into a JS Date
    description: z.string().optional(),
    coverImage: z.string().optional(),
    pinned: z.boolean().default(false), // pinned posts float to the top everywhere
    tags: z.array(z.string()).optional(),
  }),
});

const gallery = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/gallery' }),
  schema: z.object({
    image: z.string(),
    caption: z.string().optional(),
  }),
});

// Singleton Markdown pages: about, impressum, datenschutz.
// Each file's id is its filename without the extension (e.g. "about" for about.md).
// The body (Markdown content) is accessed via render() in the page component.
const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
  }),
});

// Upcoming club events: title, date, optional description, location, and a link to a related post.
// Only future-dated entries are shown on the home page; past ones are kept for the archive.
const events = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/events' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional(),
    location: z.string().optional(),
    link: z.string().optional(), // optional path or URL for "Mehr erfahren"
  }),
});

export const collections = { posts, gallery, pages, events };
