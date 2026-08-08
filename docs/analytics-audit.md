# Analytics audit

## Status: live

GA4 property created, Measurement ID `G-PT94PQTWK8` deployed, tag confirmed live on production. Verified via GA4 Realtime: test visits from two separate browser contexts registered as active users in the same session this doc was written.

## What's implemented

**Tag**: `src/layouts/BaseLayout.astro` reads `import.meta.env.PUBLIC_GA_MEASUREMENT_ID` at build time. `.env.production` on the build machine holds the real ID (gitignored, never committed). Confirmed present sitewide in the built output, correct ID injected via `define:vars`.

**Event helper**: `src/scripts/analytics.ts` exports `trackEvent(name, params)`, which no-ops safely if `window.gtag` isn't present.

**Events wired and verified against the built output:**

| Event | Fires when | File |
|---|---|---|
| `hero_evidence_click` | Homepage hero evidence link clicked | `src/components/sections/Hero.astro` |
| `work_filter_used` | A category filter button clicked on `/work/` | `src/pages/work/index.astro` |
| `service_cta_click` | "Start a project" clicked on a service page | `src/pages/services/[slug].astro` |
| `resource_view` | A resource page (`/resources/{type}/{slug}/`) loads | `src/pages/resources/[type]/[slug].astro` |
| `resource_use` | Demonstrated interaction with a resource (first valid calculator input) | `src/pages/resources/[type]/[slug].astro` |
| `contact_form_start` | First focus into any field of the Talk to Me form | `src/components/sections/Contact.astro` |
| `generate_lead` | Formspree submission returns a success response | `src/components/sections/Contact.astro` |

`generate_lead` fires only after `res.ok` from the actual Formspree POST, with no form field values in the event params.

## `resource_view` / `resource_use` split

Originally `resource_use` fired on every page load, indistinguishable from a page view. Split per the Canonical PRD V2 (section 37): `resource_view` now fires unconditionally on load, `resource_use` fires only on demonstrated use.

The ROAS calculator fires `resource_use` once, the first time a spend/revenue pair or a margin value produces a real computed output (guarded so it only fires once per page load, not on every keystroke).

The two checklist-type resources (Marketing Audit Checklist, Operations KPI Checklist) have no interactive element beyond the "Talk to me" CTA, they're read-only lists. `resource_use` doesn't fire on those pages, there's no real interaction to distinguish from the view. This is accurate to what the pages actually are, not a gap, adding a fake interaction just to populate the event would misrepresent what happened.

## Not yet implemented

The Canonical PRD V2 (section 41.2) also lists `work_preview_open` and `work_view` as required events. Both depend on interactive components (the Work preview Dialog/Drawer, and a Work-detail-page view distinct from the archive) that don't exist yet, they're scoped to Release C (P2 interactive experience: React + shadcn Dialog/Drawer). Deferred, not skipped, tracked against that release, not this one.

## Verification method

`npx astro check` (0 errors), full production build, GA script confirmed present in `dist/index.html` with the correct measurement ID, live production `curl` confirming the tag on the deployed homepage, and a direct GA4 Realtime check (2 active users registered from live test visits) as the actual delivery proof, not just "the code compiled."
