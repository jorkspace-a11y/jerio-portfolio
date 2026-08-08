# Dependency audit

## Release A: zero new dependencies

The P1 Work-model migration (merging `case-studies` + `gallery-items` into a unified `work` collection, fixing the multi-word category filter bug, adding `noindex` to `/writing/`) is content-model and Astro-routing work. It touched schemas, page templates, and YAML content, nothing that needed a new package. `package.json` is unchanged from before this release.

## What's actually installed (verified, not assumed)

| Package | Version | Reason | Where used |
|---|---|---|---|
| `astro` | 7.x | Framework | Everywhere |
| `@astrojs/sitemap` | latest at install | Sitemap generation | `astro.config.mjs` |
| `@astrojs/check` | dev | Type-checking (`npx astro check`) | CI/local verification only |
| `typescript` | dev | Required peer for `@astrojs/check` | Build-time only |

No React, no Tailwind CSS, no shadcn/ui, no Motion. The Canonical PRD V2 (sections 17-21) approves these for the P2 interactive layer — that's Release B/C, not this release. Installing them now, with no component that actually needs them yet, would be exactly the "add dependencies with no live use" the PRD forbids (section 64).

## When this doc gets a real table

Once Release B (React + Tailwind v4 + shadcn + Motion installation) starts, this file gets the full per-package table: version, reason, bundle impact, license, where used, per PRD section 64. Not written speculatively now because none of those packages exist in this repo yet.
