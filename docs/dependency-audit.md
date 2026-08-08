# Dependency audit

## Release A: zero new dependencies

The P1 Work-model migration touched schemas, page templates, and YAML content only. `package.json` was unchanged by that release.

## Release B: interactive stack foundation

Installed per the Canonical PRD V2, sections 17-21 (React + Tailwind CSS v4 + shadcn/ui + Motion), all via each tool's own official CLI mechanism, not hand-assembled.

| Package | Version | Reason | Where used |
|---|---|---|---|
| `@astrojs/react` | ^6.0.2 | Astro's official React integration | `astro.config.mjs` |
| `react` / `react-dom` | ^19.2.8 | React runtime, required by `@astrojs/react` | Any `client:*` island |
| `@types/react` / `@types/react-dom` | ^19.2.x | Type-checking for `.tsx` files | Build-time only |
| `tailwindcss` | ^4.3.3 | Utility CSS, v4 CSS-first config (no `tailwind.config.cjs`/postcss) | `src/styles/global.css` |
| `@tailwindcss/vite` | ^4.3.3 | Official Tailwind v4 Vite plugin | `astro.config.mjs` |
| `shadcn` | ^4.16.2 | Component CLI, used to scaffold `src/components/ui/*` | Dev-time CLI only, not a runtime import |
| `@base-ui/react` | ^1.7.0 | The primitive/headless component library shadcn generates against (chosen base: `base`, not `radix`) | Every `src/components/ui/*` component |
| `class-variance-authority`, `clsx`, `tailwind-merge` | latest | shadcn's own utility stack for variant class composition (`cn()` helper) | `src/lib/utils.ts`, every `ui/*` component |
| `lucide-react` | ^1.30.0 | Icon set shadcn wires components to by default | Not yet used by any real component |
| `tw-animate-css` | ^1.4.0 | Tailwind animation utility classes shadcn's own components reference (accordions, dialogs, etc.) | Not yet used, needed once Release C adds Dialog/Drawer |
| `motion` | ^13.0.0 | Animation library, PRD section 21 | `src/components/lab/StackSmokeTest.tsx` |

## Removed

`@fontsource-variable/geist` — `shadcn init` added this and an `@import` pulling in the Geist font, which would have silently replaced WMB's Cormorant/DM Sans identity. Removed the import and uninstalled the package in the same pass that fixed the token collision (see `docs/prd-deviations.md`, "Release B: shadcn token collision"). Zero live use, zero reason to keep it installed.

## Bundle impact, measured

Before this release, `/lab/` shipped no JS beyond the sitewide `interactions.ts` scroll/nav script. After: `client.B2QVrJOL.js` (179.7KB, React + ReactDOM + Motion runtime, shared across any future island) plus `StackSmokeTest.*.js` (the component itself). This cost is scoped to `/lab/`, the only page with a hydrated island right now, every other route's bundle is unchanged, confirmed by diffing `dist/_astro/` file lists before and after.

## What's still not installed

`@radix-ui/*` (not used, `base` was chosen as the shadcn primitive library instead of `radix` — Base UI is the CLI's current recommended default). No component beyond `Button` has been added yet, more will be pulled in via `npx shadcn add <component>` as Release C actually needs them, not speculatively now.
