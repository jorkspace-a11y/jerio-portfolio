# Search Console handoff

## Status: blocked on your Google + Cloudflare logins

Property verification requires proving domain ownership, which needs either your Google account (URL-prefix property, HTML file upload) or your Cloudflare account (Domain property, DNS TXT record). Both are accounts I don't have access to. Everything I can verify without those logins is already confirmed in [docs/crawler-audit.md](crawler-audit.md) — robots.txt, sitemap, and both Googlebot and OAI-SearchBot get clean 200s against the live site today.

## Recommended path: Domain property via Cloudflare DNS TXT

A Domain property (covers `whatmattersbuilt.co` at all subdomains/protocols, not just `https://whatmattersbuilt.co/`) is the better long-term choice over a URL-prefix property, and DNS verification survives future hosting changes (e.g. the eventual Cloudflare Pages migration) without re-verifying.

1. Go to [search.google.com/search-console](https://search.google.com/search-console), add property, choose **Domain**, enter `whatmattersbuilt.co`.
2. Google gives you a TXT record value (`google-site-verification=...`).
3. In your Cloudflare dashboard, DNS settings for `whatmattersbuilt.co`, add a TXT record: name `@`, value the string Google gave you.
4. Back in Search Console, click Verify. DNS propagation is usually fast but can take up to a few hours.
5. Once verified, submit the sitemap: `https://whatmattersbuilt.co/sitemap-index.xml`.

## Alternative: URL-prefix property via HTML file

If you'd rather not touch DNS right now, a URL-prefix property works too, just covers `https://whatmattersbuilt.co/` specifically rather than the whole domain:

1. Add property, choose **URL prefix**, enter `https://whatmattersbuilt.co/`.
2. Download the verification HTML file Google gives you.
3. Send it to me — I'll add it to `public/` on `astro-source`, rebuild, and deploy, and it'll be live at the root within one deploy cycle.
4. Click Verify in Search Console.
5. Submit `https://whatmattersbuilt.co/sitemap-index.xml`.

## What I did in the meantime

Confirmed (see `docs/crawler-audit.md`) that once either property is verified, there's nothing blocking a clean crawl: `robots.txt` allows everything, the sitemap is auto-generated from the real build (can't drift), and both major bot user-agents get the same 200 response a browser does. Verification is the only remaining gap, and it's yours to close.
