# Toolchain audit

Per-tool call for this project, made against what the site actually is: a small, fully static Astro marketing/portfolio site, no backend, no large codebase, no video or generated-image content in scope for this sprint. USE means actively applicable and already in use or worth using here. HOLD means plausible later but not justified now. REJECT means a real mismatch for this project. N/A means the tool doesn't apply to what this project is.

| Tool | Call | Reasoning |
|---|---|---|
| Astro + TypeScript strict | USE | Already the entire stack. `npx astro check` runs clean (0 errors) as of this sprint. |
| RTK (token-killer CLI proxy) | USE | Installed and available (`/c/Users/hp/.local/bin/rtk`), used for routine git/file operations through this sprint's hook-based rewriting. |
| Caveman / Ponytail (response-style skills) | USE | Both active this session per global config. They govern how I communicate and how much code I write, not what gets shipped — no effect on the site itself, but real effect on session efficiency. |
| Taste Skill / UI/UX ProMax / front-end design stack | HOLD | This sprint is explicitly a closeout sprint, not a redesign sprint (P2 is out of scope by the PRD's own terms). The visual design was locked in an earlier P2 sprint. Re-running the design stack now would be scope creep against this sprint's own instructions. Revisit when a real P2 visual sprint is scoped. |
| Graphify (knowledge graph) | N/A | No `graphify-out/graph.json` exists in this repo, and this codebase doesn't have the scale (god nodes, deep cross-file relationship webs) that graphify is built for — it's ~50 Astro files with a flat, legible structure. Running it here would produce a graph nobody needs to query. |
| Obsidian | N/A | No vault, no note-taking workflow tied to this project. This project's documentation lives in `docs/*.md` in the repo itself, which is the right place for evidence that needs to travel with the code and be verifiable via git history. |
| Remotion | N/A | No video content in this project's scope. Nothing here calls for programmatic video generation. |
| Impeccable | HOLD | Not evaluated this sprint — no task in the P0/P1/P3 closeout scope touched anything Impeccable would apply to. Flagging as unevaluated rather than guessing at a verdict; a real call needs a task that actually exercises it. |

## What this audit is for

The PRD asked for an explicit USE/HOLD/REJECT/N/A call on the named tool list rather than silence, so that "we didn't use X" reads as a deliberate decision with a reason, not an oversight. Nothing here was tested by running it and finding it lacking — the N/A and HOLD calls are scope mismatches, verified against what this project actually contains (file counts, absence of a graph output, absence of video/image-gen tasks in this sprint), not opinions about the tools themselves.
