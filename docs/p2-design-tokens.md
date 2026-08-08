# P2 remediation: approved design tokens

Direction B (Utilitarian + restrained Neo-Brutalism + Modular Typography) + Typography System 3 (Modular utility), approved by the user against the 3-direction concept board (`docs/p2-remediation-baseline.md` links the artifact). This is the fidelity baseline implementation is measured against.

## Color

Unchanged. WMB's existing tokens stay the single source (PRD section 20, "preserve the core palette"):

```
--bg:#FAF8F4  --surface:#F1EEE6  --text:#161410
--accent:#CC2B1D  --accent-2:#3E5D4C
--border:rgba(22,20,16,.12)  --border-soft:rgba(22,20,16,.07)
```

Direction B's "Neo-Brutalism" contribution is structural, not a new palette: red does more work as an underline/rule, not just a text color.

## Typography

- **Titles** (Hero capability word, Work row title, Work preview title, Work detail H1, mobile Drawer title): `var(--mono)` (`ui-monospace,'SF Mono',Consolas,monospace`), weight 500, no italic. Replaces Cormorant italic in these specific roles only.
- **Body, metadata, controls**: unchanged, `var(--sans)` / `var(--mono)` as already used elsewhere on the site.
- **Cormorant stays** everywhere outside this PRD's scope: Services, Field Notes, Studies, About, homepage sections not touched by this remediation (PRD section 4, non-goals).

## Structure

- Border radius on Work archive/preview surfaces: 0-2px (was 16-20px). Filter buttons, capability buttons: square, not pills.
- Border weight on the sticky preview panel and Hero evidence panel: keep 1px but switch to full-opacity `var(--text)` on the preview panel's outer edge (was soft rgba), a visible structural rule, not a soft card.
- Active/selected state: primarily communicated via a 2-3px red underline/rule, not a filled pill background. Filled red stays only on primary actions (submit, filter-active) where a solid fill is the correct affordance.

## Interaction model change (the actual architecture fix)

Desktop: **no Dialog**. The current `WorkPreviewManager` opens a shadcn Dialog on click, this is removed for desktop entirely per PRD section 25 ("no modal required for ordinary archive browsing"). Replaced with an always-visible sticky preview panel beside the list; hover/focus on a row updates it in place. Click/Enter on a row navigates directly to the canonical Work URL, it does not open anything.

Mobile: unchanged pattern (Drawer on tap), visual treatment updated to match, tiny "Preview" pill removed, the whole row is the tap target.

## Media fitting

- Logo/identity images: `object-fit: contain`, padded stage, never cropped.
- Photograph/screenshot: `object-fit: cover` allowed, only where the asset is a photograph, not a logo or document export.
- Determined by a new optional `fit` field on `media`/`archives` thumbs (defaults inferred from context: first-archive-group items named "Identity"/"Logo exploration"/"Logo variants" default to `contain`, everything else defaults to `cover` unless overridden).

## What's explicitly not changing

Per PRD section 4 (non-goals): Services, Field Notes, Studies, About, footer, navigation. Only Work archive, Work preview, Work detail media/typography, and Hero are in scope.
