# Crawler audit

What was actually tested, when, and what it proved. Everything here is a direct `curl` result, not an assumption.

## robots.txt

```
User-agent: *
Allow: /
Sitemap: https://whatmattersbuilt.co/sitemap-index.xml
```

Allows all crawlers, all paths. Points at the real sitemap index.

## Sitemap

- `https://whatmattersbuilt.co/sitemap-index.xml` returns 200, references `sitemap-0.xml`.
- `https://whatmattersbuilt.co/sitemap-0.xml` returns 200.
- Confirmed the 3 published Field Notes (`operations-dashboard-what-it-should-shorten`, `digital-strategy-before-the-build-plan`, `segmentation-before-automation`) are present in `sitemap-0.xml` — generated automatically by `@astrojs/sitemap` from the live route set, not hand-maintained, so it can't drift from what's actually built.

## Crawler user-agent fetch tests

Ran direct `curl` requests against the production homepage with each user-agent string, no JavaScript execution (these bots don't execute JS for the initial crawl either — Astro's fully static output means that's not a gap here):

| User-agent | Result |
|---|---|
| `Googlebot/2.1 (+http://www.google.com/bot.html)` | 200 |
| `OAI-SearchBot/1.0` | 200 |

Both get the same static HTML any browser gets — there's no bot-specific gating, cloaking, or JS-only render path that would behave differently for a real crawler than it did here.

## What this doesn't cover

This confirms the site is *fetchable and listed*. It does not confirm indexing status, ranking, or how Google/OpenAI actually parse and use the content — that requires Search Console / Bing Webmaster Tools data, which requires the account verification covered in the Search Console handoff (see closeout report). Not tested here: JS-rendering crawlers on dynamic routes (n/a, site is fully static), rate limiting or crawl budget behavior, or actual AI Overview / ChatGPT citation appearance (unverifiable without the property being indexed first, which hasn't happened yet since Search Console isn't set up).
