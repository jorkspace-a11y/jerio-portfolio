# WMB P0 + P1 + P3 closeout sprint — final report

Generated 2026-08-08. Production commit `main@5d58466ff8b657f55f3324dde7dab06a23be2ba5`, source commit `astro-source@14a9fcd0b8c86a5db6b275acc0c3cef1f81b8f32`.

## Acceptance statements

### P0: Truth and repository integrity — DONE

Evidence: [docs/deployment-state.md](deployment-state.md), [docs/route-audit.json](route-audit.json), [docs/crawler-audit.md](crawler-audit.md).

- Deployment mechanism (GitHub Pages, `legacy` build_type, branch-based) confirmed and documented with the reasoning for staying on it over an Actions-based migration.
- Real bug found and fixed: Hero/Selected Work evidence links pointed at hand-typed slugs that had drifted from actual case-study collection IDs (confirmed live 404 before the fix). Fixed by resolving routes from the real content collection at build time, failing the build loudly on a mismatch instead of silently dropping or hardcoding around it.
- Full internal-link audit: 177 valid routes, 1,050 href checks, 0 broken links, run against the actual built output, not assumed.
- `src/content/products/` directory-tracking bug found and fixed (git doesn't track empty directories; the collection had silently stopped existing on disk).
- Correction on record: an earlier commit this sprint (`astro-source@feed5fa`) mischaracterized a fix to the `/writing/` redirect as resolving a missing source file. That was wrong, the source page existed the whole time; a flawed search on my part missed it, and I created a duplicate that shadowed the real page. The duplicate is removed, the correction is on record in [docs/prd-deviations.md](prd-deviations.md), and the current `route-audit.json` does not repeat the inaccurate claim.

### P1: Data model and IA migration — DONE

Evidence: [docs/schema-map.md](schema-map.md), [docs/prd-deviations.md](prd-deviations.md).

- Taxonomy duplication bug fixed: `src/data/taxonomy.ts` is now the single source of truth, derived into both the Zod schema and the Work page filter UI, so the two can no longer drift apart.
- Route-specific JSON-LD added where it was missing: `Service` on service pages, `CreativeWork` on Work and Studies pages (deliberately not `BlogPosting`, reasoning documented in schema-map.md).
- All 8 content collections (`case-studies`, `gallery-items`, `field-notes`, `studies`, `services`, `resources`, `recommendations`, `products`) registered and building cleanly.
- Deliberate deviations from earlier PRD drafts (service slug naming, unlinked-but-live Recommendations/Products/Lab, GitHub Pages retained over Cloudflare Pages) are named and reasoned in prd-deviations.md, not silently absorbed.

### P3: Authority engine — DONE (within this sprint's scope)

Evidence: [docs/schema-map.md](schema-map.md) (structured data), the 3 published Field Notes, [docs/crawler-audit.md](crawler-audit.md), [docs/analytics-audit.md](analytics-audit.md), [docs/search-console-handoff.md](search-console-handoff.md), [docs/authority-outreach.md](authority-outreach.md).

- 3 real cornerstone Field Notes published, each using only already-published, real project evidence (Blue Tick Ice, Sinar Mas Land, KKBC), each stating what's measured versus interpreted and naming the limits of what one engagement's numbers support, each linking to the specific Work/Services/Resources the PRD specified. Verified live with `BlogPosting` schema and working related-content links.
- The `relatedWork`/`relatedServices`/`relatedResources` fields already existed in the field-notes schema but were never rendered anywhere, that gap is now closed.
- robots.txt, sitemap, and both Googlebot and OAI-SearchBot user-agent fetches verified live and clean.
- GA4 tag and all 6 required events (`hero_evidence_click`, `work_filter_used`, `service_cta_click`, `resource_use`, `contact_form_start`, `generate_lead`) implemented, wired, and verified in the build. Inert (renders nothing) until a real measurement ID exists, confirmed by grepping the built output.
- Authority outreach backlog written as a concrete, doable plan, explicitly not executed outreach.

**What's blocked at the Google/Cloudflare auth boundary, not done by design:** GA4 property creation and Search Console domain verification. Both require your own account login. Exact handoff steps are in analytics-audit.md and search-console-handoff.md; once you provide a measurement ID or complete verification, the remaining wiring is already built and just needs a rebuild.

## Outside this sprint (explicitly, per the PRD's own scope)

- P2 (visual redesign) — untouched, as instructed.
- P4 (monetization) beyond what already existed (Products collection registered but empty, disclosure/legal pages already live from an earlier sprint) — untouched.
- Cloudflare Pages migration — not started, needs your Cloudflare login, reasoned against doing mid-sprint in prd-deviations.md.
- GA4 property + Search Console verification — handed off, see above.

## Known non-blocking loose ends

- Three orphaned local directories (`deploy-main-wt`, `deploy-main-wt2`, `deploy-main-wt3`) exist on disk next to the repo from `git worktree` deploy steps this sprint. Windows held a file lock on each that prevented `git worktree remove`/`rm -rf` from cleaning them up immediately; they're unregistered from git (`git worktree list` shows only the main working directory) and don't affect the repo or the live site. Safe to delete by hand once whatever process is holding them (likely Explorer or antivirus scanning) releases them.
- The dead `jerio-portfolio-live` repo from before this rebuild still exists on GitHub, deletion is blocked because the available `gh` token lacks the `delete_repo` scope. Not part of this sprint's scope; flagged here so it isn't lost.

## Self-review (8 lenses)

**Product Manager** — Does this match what was actually asked? Yes: every deliverable maps to a PRD line item (evidence pack, 3 Field Notes with pre-assigned topics, GA4/Search Console handoff at the auth boundary), and nothing from P2/P4/Cloudflare was touched.

**Project Manager** — Is scope, sequencing, and status honestly tracked? Yes, task-by-task in this report, with DONE tied to verifiable evidence rather than "should be fine." The one process gap (worktree cleanup) is disclosed rather than hidden.

**Content Truth Reviewer** — Any claim in public content or evidence docs not actually true? The `/writing/` misdiagnosis was caught and corrected in `prd-deviations.md` rather than left standing. Field Notes explicitly separate measured facts from interpretation and state what doesn't generalize. No fabricated citations, no invented metrics.

**SEO/GEO Reviewer** — Crawlable, structured, linked correctly? robots.txt/sitemap verified live, Googlebot and OAI-SearchBot both get clean 200s, JSON-LD types matched to what's actually true about each page type (CreativeWork vs BlogPosting decision reasoned, not defaulted). Gap: not yet indexed, since Search Console verification is blocked on your login.

**Engineering Reviewer** — Does it build, type-check, and hold together? `npx astro check`: 0 errors across all changes this sprint. Full production build succeeds at every commit point. Link audit run fresh after every deploy, 0 broken links each time.

**Analytics Reviewer** — Is tracking correct and safe? All 6 events wired to real user actions, `generate_lead` gated on an actual Formspree success response with no PII in event params, GA4 confirmed absent from output until a real ID exists (no premature or broken tag).

**Human Writing Reviewer** — Does the writing sound like a person, not a template? Field Notes lead with a specific number or claim, avoid the standard banned-phrase list, and each states a real limitation rather than hedging generically. No two notes use the same structure verbatim.

**Skeptical Client/Recruiter** — Would this survive someone actually checking the claims? Every Work/Services/Resources link in the Field Notes resolves to a real, already-published page (verified live, not assumed). The numbers in Field Notes match what's already published in the corresponding case-study YAML files, nothing was invented for the sake of the article.
