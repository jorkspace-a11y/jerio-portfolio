import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const thumb = z.object({ src: z.string(), alt: z.string() });
const archiveGroup = z.object({ label: z.string(), thumbs: z.array(thumb) });
const archiveBlock = z.object({ title: z.string(), groups: z.array(archiveGroup) });

const category = z.enum(['Strategy', 'Growth', 'Marketing', 'Brand', 'Performance', 'Web & Conversion', 'Operations', 'Systems', 'Data']);

const caseStudies = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/case-studies' }),
  schema: z.object({
    order: z.number(),
    title: z.string(),
    organisation: z.string(),
    parentProject: z.string().optional(),
    role: z.string(),
    categories: z.array(category),
    status: z.enum(['delivered', 'ongoing', 'archived']),
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
  'case-studies': caseStudies,
  'gallery-items': galleryItems,
  'field-notes': fieldNotes,
  studies,
  services,
  resources,
  recommendations,
  products,
};
