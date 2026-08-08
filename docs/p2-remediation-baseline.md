# P2 UI/UX remediation baseline

Captured 2026-08-08 per WMB_P2_UI_UX_REMEDIATION_PRD_V1_2 section 34, Phase 1, before any UI change.

## SHAs

- Source: `astro-source@5d1ad4c14cdf7c369e2d2db90e14efecd47d79af`
- Production: `main@f4ba4b0a9d2e4e663d763b67f197acaf418579c6`
- Rollback tag: `pre-p2-remediation` (points at the source SHA above)

## Confirmed defects (matches PRD section 1 exactly)

Pulled live text from `https://whatmattersbuilt.co/work/` (pixel screenshot unavailable in this session, browser pane isn't compositing frames, structural/text capture used instead):

- Duplicate title/organisation on every row where they're equal: `Soracha / SORACHA`, `Bauntung Digital / BAUNTUNG DIGITAL`, `KKBC / KKBC`, etc., 9 of 18 rows show this exact duplication.
- A "PREVIEW" label appears as a separate line after every single row, 18 times, confirming the "tiny pill" complaint.
- All 18 rows use the identical layout with no visual distinction for Featured vs. non-Featured, ongoing vs. delivered beyond a text label.

This matches PRD section 1.1 and 1.2's stated problems precisely, confirms the remediation is targeting a real, currently-live defect, not a hypothetical one.

## What's explicitly NOT touched yet

No component code has been written for this PRD. Per section 31 ("This release must not go straight from PRD to code") and the repeated concept-approval gates throughout (sections 10.3, 31, 67), the next step is presenting design concepts for user approval, not implementation.
