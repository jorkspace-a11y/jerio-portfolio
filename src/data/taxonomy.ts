// Single source of truth for the Work category taxonomy. content.config.ts
// derives its Zod enum from this array; the Work archive filter derives its
// button list from it too (narrowed to categories actually in use — see
// work/index.astro). Never hand-write a second category list anywhere else.
export const CATEGORIES = [
  'Strategy',
  'Growth',
  'Marketing',
  'Performance',
  'Brand',
  'Web & Conversion',
  'Operations',
  'Systems',
  'Data',
] as const;

export type Category = (typeof CATEGORIES)[number];
