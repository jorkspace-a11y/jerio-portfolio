import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { CATEGORIES } from './data/taxonomy';

const thumb = z.object({ src: z.string(), alt: z.string() });
const archiveGroup = z.object({ label: z.string(), thumbs: z.array(thumb) });
const archiveBlock = z.object({ title: z.string(), groups: z.array(archiveGroup) });

const category = z.enum(CATEGORIES);

const media = z.object({
  src: z.string(),
  alt: z.string(),
  caption: z.string().optional(),
  type: z.enum(['image', 'screenshot', 'logo', 'document', 'dashboard', 'video']).default('image'),
});

const outcome = z.object({
  value: z.string(),
  label: z.string(),
  evidenceNote: z.string().optional(),
});

// Unified real-Work model (PRD "Canonical PRD V2" section 11.1). Replaces the
// old case-studies/gallery-items split: every real project is one Work
// entity with adaptive content depth, not two collection types with
// different clickability. `featured` controls homepage prominence only —
// it is not a content-depth or client-relationship signal.
const work = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/work' }),
  schema: z.object({
    order: z.number(),
    title: z.string(),
    organisation: z.string(),
    slug: z.string(),
    featured: z.boolean().default(false),
    categories: z.array(category),
    industry: z.string().optional(),
    status: z.enum(['delivered', 'ongoing']),
    role: z.string().optional(),
    summary: z.string(),
    context: z.string().optional(),
    scope: z.array(z.string()).default([]),
    workDone: z.array(z.string()).default([]),
    outcomes: z.array(outcome).default([]),
    limitations: z.array(z.string()).default([]),
    lessons: z.array(z.string()).default([]),
    media: z.array(media).default([]),
    archives: z.array(archiveBlock).default([]),
    relatedServices: z.array(z.string()).default([]),
    relatedFieldNotes: z.array(z.string()).default([]),
    relatedResources: z.array(z.string()).default([]),
  }),
});

const fieldNoteCategory = z.enum(['Strategy', 'Marketing', 'Performance', 'Web & Conversion', 'Operations', 'Data', 'Technology']);

const fieldNotes = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/field-notes' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    author: z.string().default('Jerio'),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    category: fieldNoteCategory,
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    coverImage: image().optional(),
    coverAlt: z.string().optional(),
    intent: z.enum(['informational', 'commercial-investigation', 'brand', 'transactional-support']).default('informational'),
    informationGain: z.string().optional(),
    methodology: z.string().optional(),
    relatedWork: z.array(z.string()).default([]),
    relatedServices: z.array(z.string()).default([]),
    relatedResources: z.array(z.string()).default([]),
    monetization: z.enum(['none', 'ads', 'affiliate', 'sponsorship', 'mixed']).default('none'),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    canonical: z.string().optional(),
  }),
});

const studies = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/studies' }),
  schema: z.object({
    order: z.number(),
    title: z.string(),
    studyType: z.enum(['independent', 'conceptual']),
    industry: z.string(),
    categories: z.array(category),
    summary: z.string(),
    assumptions: z.array(z.string()).default([]),
    problem: z.string(),
    research: z.string().optional(),
    analysis: z.string(),
    proposal: z.string(),
    limitations: z.array(z.string()).default([]),
    notImplemented: z.literal(true).default(true),
    featured: z.boolean().default(false),
  }),
});

const step = z.object({ title: z.string(), description: z.string() });
const faq = z.object({ question: z.string(), answer: z.string() });

const services = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/services' }),
  schema: z.object({
    order: z.number(),
    title: z.string(),
    slug: z.string(),
    summary: z.string(),
    audience: z.array(z.string()).default([]),
    problems: z.array(z.string()).default([]),
    scope: z.array(z.string()).default([]),
    exclusions: z.array(z.string()).default([]),
    deliverables: z.array(z.string()).default([]),
    process: z.array(step).default([]),
    relatedWork: z.array(z.string()).default([]),
    faqs: z.array(faq).default([]),
    active: z.boolean().default(true),
  }),
});

const resources = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/resources' }),
  schema: z.object({
    order: z.number(),
    title: z.string(),
    slug: z.string(),
    type: z.enum(['tool', 'calculator', 'template', 'guide', 'comparison', 'download']),
    summary: z.string(),
    free: z.literal(true).default(true),
    requiresEmail: z.boolean().default(false),
    monetization: z.enum(['none', 'ads', 'affiliate', 'lead-gen', 'mixed']).default('none'),
    body: z.string().optional(),
    items: z.array(z.string()).default([]),
  }),
});

const recommendations = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/recommendations' }),
  schema: z.object({
    order: z.number(),
    title: z.string(),
    provider: z.string(),
    category: z.string(),
    summary: z.string(),
    relationship: z.enum(['none', 'affiliate', 'sponsored']).default('none'),
    affiliateUrl: z.string().optional(),
    disclosure: z.string(),
  }),
});

const products = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/products' }),
  schema: z.object({
    order: z.number(),
    title: z.string(),
    slug: z.string(),
    type: z.enum(['template', 'dashboard', 'toolkit', 'report', 'system', 'bundle']),
    summary: z.string(),
    priceType: z.enum(['free', 'paid']),
    price: z.number().optional(),
    currency: z.string().optional(),
    included: z.array(z.string()).default([]),
    license: z.string().default('Personal use'),
    active: z.boolean().default(false),
  }),
});

export const collections = {
  work,
  'field-notes': fieldNotes,
  studies,
  services,
  resources,
  recommendations,
  products,
};
