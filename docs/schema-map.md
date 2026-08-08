# Schema map

What structured data is emitted on each surface, verified against the actual source as of this closeout sprint. No entry here claims a schema type that isn't actually present in the corresponding source file.

| Surface | Schema emitted | Source |
|---|---|---|
| Every page (sitewide) | `Person`, `WebSite` | `src/layouts/BaseLayout.astro` |
| `/about/` | `ProfilePage` (wrapping `Person`) | `src/pages/about.astro` |
| `/services/[slug]/` (7 pages) | `Service`, `BreadcrumbList` | `src/pages/services/[slug].astro` |
| `/work/[slug]/` (18 pages) | `CreativeWork`, `BreadcrumbList` | `src/pages/work/[...slug].astro` |
| `/studies/[slug]/` (2 pages) | `CreativeWork`, `BreadcrumbList` | `src/pages/studies/[...slug].astro` |
| `/field-notes/[slug]/` | `BlogPosting`, `BreadcrumbList` | `src/pages/field-notes/[...slug].astro` |
| Everything else (`/work/`, `/studies/`, `/services/`, `/field-notes/`, `/resources/`, `/products/`, `/recommendations/`, `/lab/`, `/privacy/`, `/terms/`, `/disclosure/`, `/404`) | none beyond the sitewide `Person`/`WebSite` | — |

## Decisions

**Work uses `CreativeWork`, not `BlogPosting`.** A case study is a portfolio/project record, not an article — using `BlogPosting` because it's the easy default would be the exact "schema spam" the sprint PRD forbids. `CreativeWork` fields used: `name`, `description`, `creator` (Person), `about` (organisation), `keywords` (categories), `url`.

**Studies also uses `CreativeWork`, not `Article`.** Same reasoning — a Study is closer to a portfolio artifact (a strategic exercise with a proposal) than a published article. Its `description` field explicitly includes the "not commissioned, not implemented" framing that's already visible on the page, so the structured data can't be read as a stronger claim than the visible content makes — satisfies the sprint's "no schema value absent from visible content" rule directly for the one type of page where over-claiming would be most damaging.

**Field Notes uses `BlogPosting`.** This is the one page type that's actually an article — real published writing with a publish date and author. `BlogPosting` is the correct type here, not a default reached for out of laziness.

**Services uses `Service` + `BreadcrumbList`, added this sprint.** Previously services pages had no schema beyond the sitewide Person/WebSite — this was a real gap, now closed. Fields: `name`, `description`, `provider` (Person), `url`. No `aggregateRating`, `review`, or `offers` — none of those exist on the visible page, so none are claimed in schema.

**No fake data anywhere.** No `AggregateRating`, no `Review`, no `Organization` (What Matters Built is represented as `WebSite`, not `Organization` — it isn't a registered legal entity, per the master PRD's own entity rule), no awards, no fabricated dates.

## Release A update: unified Work model

The old `case-studies` (9 items) and `gallery-items` (9 items) collections merged into a single `work` collection (18 items, all clickable) per the Canonical PRD V2. `CreativeWork` continues to be the correct type for every entry, richly documented or thin, since none of them are articles. See `docs/work-migration-map.md` for the full per-item migration record and `docs/prd-deviations.md` for the deliberate deviations made during that merge (the `archives` field kept alongside the PRD's `media` field, and the route-preservation decision).

## Verification method

Ran `npx astro check` (0 errors) and a full production build, then manually read each `[...slug].astro` / `[slug].astro` file's JSON-LD block against the schema.org type definitions to confirm every field used is a real property of that type and every value traces to content actually rendered on the page. Did not run an external JSON-LD validator service (would require sending page content to a third party) — spot-checked JSON validity by confirming `JSON.stringify()` output parses (build would fail on a JS syntax error in the object literal, which it didn't).
