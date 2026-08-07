# Jerio's portfolio

Astro/TypeScript static site. Content lives in `src/content/case-studies/` and
`src/content/gallery-items/` as YAML, capability pillars in `src/data/capabilities.ts`.

## Local dev

```sh
npm install
npm run dev
```

## Deploying

GitHub Pages on this repo is set to **legacy/branch-based deploy** (source: `main`,
root), not Actions-based deploy — that was tried and found unreliable (deployments
stuck in `deployment_queued` for 10+ minutes, phantom lock errors blocking retries).
Don't switch it back without a real reason.

This branch (`astro-source`) is never served directly. `main` holds only the built
static output. To ship a change:

```sh
npm run build
# copy dist/* over main's root, commit, push to main
```

Concretely, from a clean `astro-source` working tree:

```sh
npm run build
cp -r dist/* /tmp/dist_out_new   # or wherever, outside the repo
git checkout main
git rm -rf .
cp -r /tmp/dist_out_new/* .
cp /tmp/dist_out_new/.nojekyll .  # hidden file, cp with * won't grab it
git add -A
git commit -m "describe the change"
git push origin main
git checkout astro-source
```

The push to `main` **is** the deploy — GitHub Pages serves whatever's on that
branch directly, no build step on GitHub's end. `.nojekyll` must be preserved
(Jekyll ignores `_astro/`, Astro's asset output dir, which would silently break
every CSS/JS reference). `CNAME` must be preserved (points the custom domain
`whatmattersbuilt.co` at this repo).

If a deploy doesn't show up: retriggering a deploy for the *same commit sha*
gets instantly cancelled by GitHub ("in progress deployment" error even when
nothing is actually in progress) — push a trivial change to force a new sha
rather than re-running the same commit.

Rollback: `git revert` the cutover commit on `main`, or restore the pre-Astro
single-file site from the `legacy-pre-wmb-rebuild` tag/branch.

## Build check

`.github/workflows/build-check.yml` runs `npm run build` on push/PR to this
branch — verification only, no deploy step, so it can't touch the fragile
Pages deploy mechanism.
