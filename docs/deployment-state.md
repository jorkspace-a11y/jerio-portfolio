# Deployment state

Recorded 2026-08-08, as evidence for the P0/P1/P3 closeout sprint.

## Repository

- Repository: `jorkspace-a11y/jerio-portfolio`
- Source branch: `astro-source`
- Production/static branch: `main`
- Production commit (`origin/main` at sprint start): `9850e1edadaed57a119378efadbdf77c2a8b2620`
- Rollback tag: `legacy-pre-wmb-rebuild` — verified present (`65de9debcc5833d15b4997cb15cb77d95025e23c`)
- Rollback branch: `legacy-pre-wmb-rebuild-branch` — verified present (`30cc8d31a11694133318baf8bcc8c5a1d4f0c04a`)

## Framework

- Astro `^7.2.0`, Node `>=22.12.0`
- Static output (`output: 'static'` default), no SSR adapter
- `@astrojs/sitemap` integration active, `site: 'https://whatmattersbuilt.co'` set in `astro.config.mjs`

## Build

- Install: `npm install` (no `package-lock.json` conflicts observed; `npm ci` also works from the committed lockfile)
- Build command: `npm run build` (runs `astro build`)
- Output directory: `dist/`
- Verified 2026-08-08: `npx astro check` — 0 errors, 0 warnings (145 non-blocking `is:inline` hints on inline JSON-LD `<script>` tags, cosmetic only)
- Verified 2026-08-08: `npm run build` — 36 pages generated, no fatal errors. Two expected non-fatal warnings: `The collection "field-notes" does not exist or is empty` and `"products" does not exist or is empty` — both collections are intentionally empty (zero fabricated content), this is correct, not a defect.

## Deploy mechanism

GitHub Pages, **legacy/branch-based deploy** (`build_type: legacy`, source branch `main`, path `/`). This is deliberate, not a placeholder:

- Actions-based deploy (`build_type: workflow`) was tried twice earlier in this project and is unreliable on this GitHub account — deployments repeatedly stuck in `deployment_queued` for 10+ minutes, or hit a phantom "in progress deployment" lock that blocked every retry even after forcing deployment status via the API.
- Legacy/branch-based deploy has been reliable every time it's been used since.
- `.nojekyll` is present at the root of `main` so GitHub's Jekyll processor doesn't run and strip Astro's `_astro/` asset directory (Jekyll ignores underscore-prefixed folders by default).

**Deploy flow:** work happens on `astro-source` → `npm run build` → copy `dist/*` (plus the hidden `.nojekyll`) over `main`'s root → commit → push. The push to `main` **is** the deploy; GitHub Pages serves whatever's on that branch directly, with no build step on GitHub's side.

**Known quirk:** retriggering a deploy for the exact same commit sha instantly cancels with an "in progress deployment" error, even when nothing is actually in progress. Push a trivial content change to force a new sha if a retry is needed.

## Custom domain

- Domain: `whatmattersbuilt.co`
- Mechanism: `CNAME` file at the root of `main`, DNS/domain management via Cloudflare (managed by the site owner outside this repository)
- `protected_domain_state: verified`, HTTPS enforced
- The old default GitHub Pages URL 301-redirects to the custom domain automatically

## Cloudflare Pages migration status

Requested by the product owner, **not implemented**. Connecting a Cloudflare Pages project to this GitHub repo requires an interactive Cloudflare OAuth login, which is outside what an AI agent can perform on the owner's behalf. GitHub Pages remains the live, working deployment target. Migration steps are documented for the owner to execute themselves when ready (see project memory / prior session notes), and are explicitly out of scope for this closeout sprint per its own instructions.

## Secrets

No credentials, API keys, or tokens are committed to this repository. The Formspree form ID (`mqpzeejp`) used by the contact form is a public-facing form identifier, not a secret — Formspree's own architecture treats it as safe to expose client-side (it identifies which form to submit to, not an authentication credential).
