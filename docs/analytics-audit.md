# Analytics audit

## Status: implemented, not yet live

GA4 requires a Google-account property to be created and verified — that's an auth boundary I can't cross. Everything on this side of that boundary is done and verified; the account-creation step is handed off below.

## What's implemented

**Tag**: `src/layouts/BaseLayout.astro` reads `import.meta.env.PUBLIC_GA_MEASUREMENT_ID` at build time. If it's unset, no GA4 script renders at all — confirmed by grepping the built `dist/index.html` for `googletagmanager`: zero matches in the current build. If it's set, the standard `gtag.js` snippet renders sitewide, exactly once, in `<head>`.

**Event helper**: `src/scripts/analytics.ts` exports `trackEvent(name, params)`, which no-ops safely if `window.gtag` isn't present (i.e. before a measurement ID exists, or if GA is blocked client-side). Every event call site uses this helper, so none of them need to know whether GA is actually configured.

**The 6 required events, wired and verified against the built output:**

| Event | Fires when | File |
|---|---|---|
| `hero_evidence_click` | Homepage hero evidence link clicked | `src/components/sections/Hero.astro` |
| `work_filter_used` | A category filter button clicked on `/work/` | `src/pages/work/index.astro` |
| `service_cta_click` | "Start a project" clicked on a service page | `src/pages/services/[slug].astro` |
| `resource_use` | A resource page (`/resources/{type}/{slug}/`) loads | `src/pages/resources/[type]/[slug].astro` |
| `contact_form_start` | First focus into any field of the Talk to Me form | `src/components/sections/Contact.astro` |
| `generate_lead` | Formspree submission returns a success response | `src/components/sections/Contact.astro` |

`generate_lead` fires only after `res.ok` from the actual Formspree POST, with no form field values in the event params, no name/email/message content, per the PRD's PII requirement.

## What's verified vs. what isn't

Verified: `npx astro check` (0 errors), full production build succeeds, GA script correctly absent with no env var set, all 6 `trackEvent` call sites compile and appear in the built JS bundles (`_astro/Hero.*.js`, `_astro/Contact.*.js`, etc., confirmed present in `dist/_astro/`).

Not verified, and can't be until a real measurement ID exists: actual event delivery to a GA4 property, DebugView confirmation, or real-time report data. That requires the property to exist first.

## Handoff: creating the GA4 property

This needs your own Google account login, which I don't have access to.

1. Go to [analytics.google.com](https://analytics.google.com), create a property for `whatmattersbuilt.co` (or add it to an existing Google account if you already have one for other work).
2. Under **Data Streams**, add a Web stream for `https://whatmattersbuilt.co`.
3. Copy the Measurement ID it gives you (format `G-XXXXXXXXXX`).
4. Send me that ID. I'll set `PUBLIC_GA_MEASUREMENT_ID` in the build environment, rebuild, and redeploy — the tag and all 6 events go live in that one build, since the wiring above is already done and just gated on this value.

No code changes will be needed on my end once you have the ID beyond that env var and a rebuild.
