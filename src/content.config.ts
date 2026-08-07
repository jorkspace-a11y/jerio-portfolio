import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const thumb = z.object({ src: z.string(), alt: z.string() });
const archiveGroup = z.object({ label: z.string(), thumbs: z.array(thumb) });
const archiveBlock = z.object({ title: z.string(), groups: z.array(archiveGroup) });

const caseStudies = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/case-studies' }),
  schema: z.object({
    order: z.number(),
    title: z.string(),
    status: z.enum(['delivered', 'ongoing']),
    situation: z.string(),
    decision: z.string(),
    moved: z.string(),
    lesson: z.string(),
    archive: archiveBlock.optional(),
  }),
});

const galleryItems = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/gallery-items' }),
  schema: z.object({
    order: z.number(),
    title: z.string(),
    industry: z.string(),
    size: z.enum(['standard', 'narrow', 'wide', 'full']).default('standard'),
    description: z.string(),
    status: z.enum(['delivered', 'ongoing']).optional(),
    archives: z.array(archiveBlock).default([]),
  }),
});

export const collections = {
  'case-studies': caseStudies,
  'gallery-items': galleryItems,
};
