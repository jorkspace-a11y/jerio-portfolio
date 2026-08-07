import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const thumb = z.object({ src: z.string(), alt: z.string() });
const archiveGroup = z.object({ label: z.string(), thumbs: z.array(thumb) });
const archiveBlock = z.object({ title: z.string(), groups: z.array(archiveGroup) });

const category = z.enum(['Growth', 'Marketing', 'Brand', 'Operations', 'Systems']);

const caseStudies = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/case-studies' }),
  schema: z.object({
    order: z.number(),
    title: z.string(),
    organisation: z.string(),
    parentProject: z.string().optional(),
    role: z.string(),
    categories: z.array(category),
    status: z.enum(['delivered', 'ongoing']),
    situation: z.string(),
    decision: z.string(),
    moved: z.string(),
    lesson: z.string().optional(),
    archives: z.array(archiveBlock).default([]),
  }),
});

const galleryItems = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/gallery-items' }),
  schema: z.object({
    order: z.number(),
    title: z.string(),
    industry: z.string(),
    parentProject: z.string().optional(),
    categories: z.array(category),
    size: z.enum(['standard', 'narrow', 'wide', 'full']).default('standard'),
    description: z.string(),
    status: z.enum(['delivered', 'ongoing']).optional(),
    archives: z.array(archiveBlock).default([]),
  }),
});

const writingCategory = z.enum(['Growth & Marketing', 'Digital Commerce', 'Operations & Business Systems', 'Strategy in Practice']);

const articles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/writing' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    author: z.string().default('Jerio'),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    category: writingCategory,
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    coverImage: image().optional(),
    coverAlt: z.string().optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    canonical: z.string().optional(),
  }),
});

export const collections = {
  'case-studies': caseStudies,
  'gallery-items': galleryItems,
  'writing': articles,
};
