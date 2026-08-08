# PRD deviations

Deliberate differences between what the PRDs describe and what's actually live. Each entry: what, why, and whether it's fixable in scope later.

## Hosting: GitHub Pages, not Cloudflare Pages

Master PRD floated a Cloudflare Pages migration. Not done — needs the user's own Cloudflare login (OAuth boundary), out of scope for a closeout sprint that explicitly forbids infra migration. Site runs on GitHub Pages `legacy` build_type (branch-based deploy from `main`), documented in `docs/deployment-state.md`. DNS/CNAME already point at Cloudflare for DNS-only proxying — the migration is a future task, not a blocker to anything in this sprint.

## `/services/brand-digital-presence/` slug, not `/services/brand-digital/`

Earlier PRD drafts referenced a conceptual `brand-digital` service. The actual content collection entry (`src/content/services/`) uses slug `brand-digital-presence` — chosen when the service was written for clarity (it covers both brand and digital presence work, and the shorter slug read as ambiguous). Live routes, sitemap, and internal links all use the actual slug consistently; nothing links to the old conceptual name.

## Recommendations, Products, Lab not in primary nav

`src/content/recommendations/`, `src/content/products/` (currently empty), and the static `/lab/` page all build and are reachable by direct URL, but none are linked from `RailNav`/`MobileBar`. This is deliberate: the closeout sprint's scope is truth/integrity/data-model/authority, not IA or nav redesign (P2 territory, explicitly out of scope). They stay unlinked-but-live until a P2 sprint decides how (or whether) to surface them.

## Studies use `CreativeWork` schema, not a PRD-unspecified type

Covered in detail in `docs/schema-map.md`. Noted here because an earlier PRD draft didn't specify a schema type for Studies at all — this sprint made the call rather than leaving it unstructured, on the reasoning that the disclosure-heavy nature of Studies content makes an explicit, honest schema type more important here than most other surfaces, not less.

## `products` collection is registered but empty

`content.config.ts` registers a `products` collection (per data-model requirements) but no product entries exist yet — there's nothing to sell/list yet. This is expected emptiness, not a bug (the earlier `src/content/products/` missing-directory bug, now fixed with `.gitkeep`, was about the directory vanishing outright, not about it lacking entries).

## `/writing/` redirect — correcting an earlier inaccurate note

An earlier commit this sprint (`feed5fa`) and `docs/route-audit.json` describe fixing a "missing source file" for the `/writing/` redirect. That description was wrong: the real source (`src/pages/writing/index.astro`) existed the whole time. The actual mistake was mine — a flawed file search missed it, leading me to create a duplicate `public/writing/index.html` that shadowed the real page. That duplicate has been removed; the site now builds from the original, correct source with no warnings. Recorded here as a factual correction to the sprint's own evidence trail, per the standing rule against evidence documents containing untested or inaccurate claims.
