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

---

# Release A: Work model migration deviations

Deviations made while merging `case-studies` + `gallery-items` into the unified `work` collection per the Canonical PRD V2 (section 11).

## Kept the old `archives` field alongside the PRD's `media` field

The Canonical PRD V2's Work schema (section 11.1) specifies a flat `media` array. The old case-studies/gallery-items schema had a richer, labeled/grouped `archives` structure (`title` → `groups[]` → `label` + `thumbs[]`) that's already carrying real content: Soracha's 35-image asset archive across 4 labeled groups, Digimune Indonesia's 46 images across 4 separate archive blocks, Karsa Tani Perkasa's 27-image brand system, Arkasa Compliance's 9 logo variants, Sport Center's 4 logo variants. Dropping that structure down to a flat `media` list would either lose the grouping/labeling entirely or force an awkward re-labeling pass with no real benefit. Both fields now exist on the schema: `media` for the PRD's flat case, `archives` for the grouped case that's actually in use. Nothing currently populates `media` — it's there for a future entry that needs a simple flat gallery without grouping.

## Preserved numeric-prefixed route IDs for all 9 former case-studies

PRD section 12.4 explicitly allows this: "If removing numeric prefixes risks unnecessary redirect complexity or indexing churn, the agent may preserve existing route IDs for this release and document the decision." All 9 former case-studies (`01-soracha` through `09-digimune-indonesia`) already have live, Search-Console-indexed routes at `/work/{numeric-id}/` — confirmed indexed via URL Inspection this session. Renaming them to clean slugs would require either a redirect layer (GitHub Pages has none) or accepting a hard 404 on every existing inbound/shared link and an indexing reset. Kept as-is. The 9 former gallery-items never had individual routes, so they got clean slugs with no prefix (`karsa-tani-perkasa`, `xiaomi`, etc.) — there was nothing to preserve for those.

## Status call: Ditlantas Polda Kalimantan Timur marked `delivered`

Full reasoning in `docs/work-migration-map.md`. Source text ("Real engagement, case study pending. Scope and outcomes not yet documented here") doesn't state active/ongoing status. Marked `delivered` rather than `ongoing`, per PRD section 13.2's explicit instruction not to call thin documentation "ongoing work" by default.

## The Canonical PRD V2's stated verified baseline was already stale when work started

The PRD document states `main@5d58466...` and `astro-source@14a9fcd...` as the verified baseline. By the time it was read, production was already at `main@9838380...` (astro-source `de96739...`) — GA4 was live with a real measurement ID, Search Console was verified, and the sitemap was submitted, all done earlier in this same session after the PRD's stated baseline was captured. This meant several of the PRD's P3 "known defects" (GA4 wired but not live, Search Console not verified, sitemap not submitted) were already resolved before Release A started. Not a deviation from the PRD's intent, just a timing note so the acceptance evidence doesn't look like it's re-solving an already-solved problem.

## `RevoU, Digital Marketing Specialist` / `RevoU, Project Officer` used as both title and organisation

These two former gallery-items don't name a separate company — RevoU is the platform, and the title itself names the role/program. Following the pattern already established by every other item in this dataset (organisation always equals title, verified across all 9 original case-studies), `organisation` was set equal to `title` for these two rather than inventing a separate company name that isn't in the source.

---

# Release B: interactive stack deviations

## shadcn token collision — `--accent` and `--border` got silently overwritten

`npx shadcn init` scans the target CSS file (`src/styles/global.css`) for an existing `:root` block and merges its own default token values into it. WMB's hand-written tokens happen to share two names with shadcn's own convention: `--accent` and `--border`. The init command overwrote `--accent:#CC2B1D` (WMB's brand red) with `oklch(0.97 0 0)` (a near-white gray) and `--border:rgba(22,20,16,.12)` with `oklch(0.922 0 0)` (a generic light gray), and separately pulled in `@fontsource-variable/geist` plus a `--font-sans:'Geist Variable'` override that would have replaced DM Sans sitewide.

All three reverted in the same commit that ran `shadcn init`, before anything using those tokens shipped. `--accent` and `--border` restored to their real values. shadcn's own full token set (`--background`, `--foreground`, `--primary`, `--card`, `--muted`, `--destructive`, `--input`, `--ring`, etc, the names every generated `src/components/ui/*` component actually references) got re-pointed at WMB's existing palette instead of left on shadcn's generic defaults, `--primary` → `var(--accent)` so the default Button variant renders in brand red, `--background`/`--foreground` → `var(--bg)`/`var(--text)`, and so on. Full mapping in `src/styles/global.css`'s `@theme inline` block. This is the PRD section 25 requirement ("must not adopt generic default blue SaaS styling") holding even when the tool being installed actively tries to overwrite the identity it's supposed to be adapted to.

## `client:visible` vs `client:load` on the Release B smoke-test component

PRD section 17.3 recommends `client:visible` for below-fold interactive content and `client:load` only where immediate interaction is required. The `/lab/` smoke-test component (`StackSmokeTest.tsx`) was built with `client:visible` first, testing in a live dev-server browser session showed it never hydrated, the `astro-island` element (which Astro renders as `display:contents`, correctly, by design) never triggered its `IntersectionObserver` in that specific browser tab, traced to the tab not compositing frames in that automation context, not a bug in the component or in Astro's directive itself. Confirmed by switching to `client:load`: hydration and click interactivity both worked immediately.

Kept `client:load` for this component, not just to route around the test-environment quirk: the `/lab/` page's entire content below the intro paragraph *is* this component, there's no real "below the fold, defer for performance" case to make for it, unlike the below-fold Work-preview galleries `client:visible` is actually intended for in PRD section 17.3, and will be used for once Release C builds those.

## shadcn base library: `base` (Base UI), not `radix`

The shadcn CLI's current default/recommended primitive library is Base UI (`-b base`), not the historically-standard Radix UI. PRD section 20 doesn't specify which to use. Went with the CLI's own current recommendation rather than the older convention most existing shadcn tutorials assume, since the PRD elsewhere (Appendix A) explicitly says to check current first-party docs over stale tutorial instructions at execution time, same principle applied here.

---

# Release C: interactive components deviations

## Real bug found and fixed: Base UI `nativeButton` violation

`WorkPreviewManager.tsx`'s "View Work" CTA renders shadcn's `Button` polymorphically as an `<a>` via Base UI's `render` prop (`<Button render={<a href={...} />}>`). Base UI's Button defaults to `nativeButton={true}`, which assumes the rendered element is a real `<button>`; rendering it as an anchor without disabling that flag throws a real runtime console error ("expected a native `<button>`... impacts forms and accessibility") on every dialog open. Fixed by adding `nativeButton={false}` to that one Button usage. Caught via live interactive testing in a running dev server, not just a type-check, confirmed resolved in a fresh browser tab with no prior console history to make sure it wasn't a stale/unrelated error.

## Testing-environment limitations discovered (not shipped bugs)

Several checks in this release's live-browser verification produced results that looked like bugs at first and turned out to be artifacts of the specific automated browser pane used for testing, not the shipped code. Documented here in detail because each one cost real verification time and the pattern is worth recognizing quickly if it recurs:

1. **`requestAnimationFrame` never fires in a backgrounded/non-composited tab.** Confirmed directly: a `requestAnimationFrame` loop timed out after 30 seconds with zero frames. This is standard browser behavior (rAF throttling for hidden tabs), not an Astro or Motion bug. It explains three downstream symptoms: `client:visible` islands never hydrating (their `IntersectionObserver` never gets a frame to fire against), Base UI Dialog's exit-animation never completing (stuck in `data-closed`/`data-ending-style` waiting for an `animationend` that never comes, even though the underlying React state closed correctly, verified via `data-open`/`data-closed` attributes), and Motion's `useScroll`-driven style updates not visibly reflecting in the pane.
2. **Newly created background tabs report `innerWidth: 0`.** A fresh tab opened via the browser tool's tab-create action, before being brought to front, reported zero viewport dimensions, which fed into `useMediaQuery` and produced misleading results. Resolved by testing only in the fronted/active tab, where dimensions were real (confirmed 930×598, then verified at all 8 required breakpoints with zero horizontal overflow).
3. **`prefers-reduced-motion` emulation gap for value-less media queries.** `window.matchMedia('(prefers-reduced-motion: reduce)').matches` correctly returned `true` in this environment, but Motion's own internal reduced-motion detection (`node_modules/motion-dom`, third-party code) queries `matchMedia('(prefers-reduced-motion)')` without the `: reduce` value, and that query did not pick up the emulated preference the same way. This is Motion's own shipped implementation, not something in this codebase to fix, and it's a widely-used, well-tested pattern in production. Verification for this specific path relied on code review (the component's own branching logic is a straightforward `if (reducedMotion) return <static>; return <motion.div>`) rather than a live visual confirmation, since the environment couldn't produce one.

Standard verification workflow used throughout: swap `client:visible` to `client:load` temporarily in a live dev server to force hydration past the rAF/IntersectionObserver limitation, verify the actual interaction (click, keyboard, drag config, responsive switching, real content/links), then revert to the PRD-correct directive before shipping. Every interactive element in this release was verified this way: click-to-open, Escape/Close-button state transitions (verified via `data-open`/`data-closed` attributes, not visual animation), keyboard arrow navigation, Dialog-vs-Drawer responsive switching, real image sources, and correct CTA hrefs.

## Bundle sizes, measured

| Chunk | Size | Loads on |
|---|---|---|
| `WorkPreviewManager` | 92KB | `/work/` only (Dialog + Drawer + Base UI primitives for both) |
| `client` (React + ReactDOM + Motion runtime, shared) | 180KB | Any page with a hydrated island |
| `button` | 40KB | Any page using the shared Button component |
| `WorkCarousel` | 4KB | Individual Work detail pages with real media (own logic only, shares the `client` runtime) |
| `GradientFooterEffect` | 12KB | Every page (it's in `BaseLayout`) — the one sitewide cost this release adds |

No duplicate motion libraries, no unhydrated static content, every component gated behind `client:visible` or `client:idle` except the two verified-necessary `client:load` uses (`/lab/`'s smoke test, reasoned in the Release B deviations above).
