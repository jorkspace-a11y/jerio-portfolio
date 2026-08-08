# P2 UI fidelity ledger

Per WMB_P2_UI_UX_REMEDIATION_PRD_V1_2 section 36/40. Concept: Direction B (Utilitarian + restrained Neo-Brutalism + Modular Typography) + Typography System 3, approved against the interactive concept board (`docs/p2-remediation-baseline.md` links it). Pixel screenshots weren't obtainable in this session (Browser pane isn't compositing frames in this environment, confirmed repeatedly), verification below uses DOM/text extraction and direct interaction testing instead, the same limitation and workaround used throughout this session.

| Surface | Concept | Implementation | Mismatch | Fix | Verification |
|---|---|---|---|---|---|
| Work row title | Mono, weight 500, no italic | Mono, weight 500, no italic | None | — | DOM: `.work-row-title{font-family:var(--mono);font-weight:500}` |
| Work archive layout | 60/40 list + sticky preview split | 60/40 grid (`grid-template-columns:60% 1fr`) | None | — | Confirmed no horizontal overflow at all 8 required breakpoints |
| Desktop preview trigger | No pill, row hover/focus updates panel | Same, `PREVIEW` pill and click-to-Dialog removed entirely | None | — | Live hover test: focusing/hovering a row updates the sticky panel; grep confirms zero `PREVIEW`/`preview-trigger` strings in built output |
| Duplicate title/org | Render org only if it differs from title | Same, `{organisation !== title && ...}` guard | None | — | Live DOM check on Sinar Mas Land (title === organisation): confirmed no duplicate node rendered |
| Filter buttons | Text tabs, red underline active state | Same | None | — | DOM: `.filter-btn.active::after{background:var(--accent)}` |
| Mobile preview | Tap row opens Drawer, no separate pill | Same | None | — | Direct `.click()` dispatch on a row at 375px width: Drawer opened, `window.location` unchanged (no premature navigation) |
| Logo/document media | `object-fit: contain`, no crop | `getMediaFit`/`getThumbFit` infer contain for logo/document/dashboard/screenshot types and "Identity"/"Logo"/"Guideline"/"Brand" archive groups | None | — | `Thumb.astro` renders `.thumb-frame-contain{object-fit:contain}` for matching groups |
| Carousel vs archive duplication | Selected highlights only, never every image | Carousel capped at 6 slides, one per archive group + flat media, skipped entirely below 4 total assets | None | — | Code review: `CAROUSEL_MAX`/`CAROUSEL_MIN` in `work/[...slug].astro` |
| Work detail H1 | Prominent title, mono, no italic | Added (previously absent, title only appeared in eyebrow/`<title>`, a real gap the concept surfaced) | Concept assumed an H1 existed; it didn't | Added `.work-title` (mono, System 3) | Confirmed rendered in built HTML |
| Hero capability control | Square, underline active state (matches Work filters) | Same, `.hero-cap-btn` rebuilt to match | None | — | DOM: shared underline-active pattern with `.filter-btn` |
| Hero word/evidence typography | Mono, no italic | Mono, no italic (`.hero-word`, `.hero-evidence-project`) | None | — | Live click test: word/project/role/URL all update synchronously in mono |
| Hero evidence panel relationship | "Shared baseline / connecting rule" (concept left this open per section 46.5) | Full-strength 2px accent-colored rule replacing the soft border | Concept's demo box was more literal (a bordered container); real Hero isn't boxed content sitewide | Used a connecting rule instead of a full box, consistent with the rest of the page's existing visual language | Visual review of rendered CSS |
| Auto-cycle timing | Not pixel-comparable (behavioral spec, section 53) | 3.4s interval (was 2.8s), 7s pause after manual selection (was: none, immediately resumed) | Original implementation resumed auto-cycle instantly after a click, contradicting PRD 46.2 | Added `setTimeout(startAuto, 7000)` after manual interaction | Code review, PRD section 53 targets (3.0-4.5s cycle, 6-10s pause) both met |

## Remaining deviations from the concept board (documented, not hidden)

- The concept board's demo Hero was drawn inside a bordered panel for visual clarity in the comparison artifact. The real site's Hero was never boxed content and isn't now, the "structural rule" principle was applied as a connecting border on the evidence panel instead, closer to how Direction B actually reads on a real page versus an isolated concept card.
- Typography System 3 was approved for Work archive/preview/detail/Hero only, per the PRD's own scope line. Services, Field Notes, Studies, About, and the footer are untouched and still use Cormorant/DM Sans, this is correct per PRD section 4 (non-goals), not an oversight.

## What still needs pixel verification

Once a real screenshot capability is available in a session, run the section 36 gate properly (concept image vs rendered image, side by side) as a follow-up. Everything above was verified structurally and behaviorally (DOM state, live interaction, computed styles), which is the strongest verification available in this session, but it isn't a substitute for an actual visual diff.
