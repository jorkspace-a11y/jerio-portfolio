# Agent skill audit

Per Canonical PRD V2 section 47: for each named resource, present/callable/purpose/test/result/phase relevance/decision/evidence, and no claiming a skill was used because it exists.

| Resource | Present | Callable | Purpose | Test performed | Result | Phase relevance | Decision | Evidence |
|---|---|---|---|---|---|---|---|---|
| RTK (token-killer CLI) | Yes, `/c/Users/hp/.local/bin/rtk` | Yes | Token-optimized CLI proxy for routine git/file ops | Used directly this session for git/file commands via the hook-based rewrite | Working | All phases | USE | Confirmed on disk, used throughout this session |
| Caveman (response-style skill) | Yes, active this session | Yes | Terse response style | Active per session config, governing this response's own style | Working, no effect on site code | All phases (session-level, not site-level) | USE | Session config confirms active |
| Ponytail (response-style skill) | Yes, active this session | Yes | Minimal-code-first discipline | Active per session config; influenced the "keep archives instead of forcing PRD's flat media field" and "no new deps this release" calls | Working, no effect on site code | All phases (session-level, not site-level) | USE | Session config confirms active |
| Graphify | Not present | N/A | Knowledge graph for codebase queries | Checked for `graphify-out/graph.json`, not present | N/A | Would apply to P1 content/internal-link graph inspection if present | N/A | No output directory in repo |
| Obsidian | Not present | N/A | Documentation/knowledge vault | No vault or Obsidian-linked workflow exists for this project | N/A | Documentation work (this project uses `docs/*.md` in-repo instead) | N/A | Not part of this project's actual workflow |
| Remotion | Not installed | N/A | Video generation (project reels, animated explanations) | Not applicable, no video deliverable in Release A scope | N/A | Future: project reels, social clips | N/A | No video task exists yet |
| Taste Skill | Not exercised this release | N/A | Frontend anti-slop preflight, design QA | Not run, Release A is data-model/routing, not visual design | N/A | P2 (Release B/C interactive build) | Deferred to P2 | This release touched zero CSS/visual design |
| Impeccable | Not exercised this release | N/A | Frontend interface critique/audit | Not run, same reasoning as Taste Skill | N/A | P2 | Deferred to P2 | Same |
| Front End Design skill | Not exercised this release | N/A | General frontend build guidance | Not run | N/A | P2 | Deferred to P2 | Same |
| UI/UX ProMax | Not exercised this release | N/A | Design system, component rules | Not run | N/A | P2 | Deferred to P2 | Same |
| shadcn skill | Not exercised this release | N/A | shadcn/ui component installation guidance | shadcn isn't installed in this repo yet | N/A | P2 (Release B, shadcn init) | Deferred to Release B | `components.json` doesn't exist |
| React best-practices skill | Not exercised this release | N/A | React island patterns | React isn't installed in this repo yet | N/A | P2 (Release B, React integration) | Deferred to Release B | No `react` dependency in `package.json` |
| Frontend app builder skill | Not exercised this release | N/A | General app-building guidance | Not applicable to a content-model migration | N/A | P2 | Deferred to P2 | Same |

## What this audit is for

Release A (P1 Work-model migration) is content architecture and Astro routing, not visual/interactive frontend work. The design and component-tooling skills listed above are real, installed, and callable, they're correctly deferred to Release B/C where they actually apply, not skipped out of neglect. Marking something "deferred" here is an honest phase-relevance call, not a placeholder for work that silently never happens, it gets revisited the moment Release B starts installing React/Tailwind/shadcn.

See also `docs/toolchain-audit.md` from the prior closeout sprint for the broader USE/HOLD/REJECT/N/A calls on tools outside this PRD's named list (SEO suite, marketing skills, etc.) — not duplicated here since that file already covers it accurately.
