# /plan-module — Plan one module before building it

Argument: a module ID from `curriculum-map.md` (e.g. `M05`). Referred to below as $ARGUMENTS.

## Steps

1. Read `CLAUDE.md`, `curriculum-map.md`, and the previous module's plan in `plans/` (if any)
   to keep continuity of voice and avoid re-teaching covered concepts.
2. Confirm the module's track, audience tag, and key concepts from the curriculum map.
3. Write `plans/$ARGUMENTS.plan.md` with exactly these sections:
   - **Objectives** — 3–5 learner outcomes ("After this module, the learner can…")
   - **Hook** — the Prior Auth Portal scenario paragraph, drafted in full
   - **Concept outline** — the 2–4 `<h2>` sections with 2–3 bullets each
   - **Analogy (mandatory)** — the Lakeview build beat for this module, drafted in full
     (60–120 words): which cast members appear, what happens on the site, and the explicit
     `maps to →` line. It must use only story beats already built in earlier modules
     (check the track-by-track beat list in CLAUDE.md) and advance the story by one step.
   - **Visual(s)** — describe each SVG: what it shows, labeled elements, which CSS track color
   - **Bridge table** — rows, or "none"
   - **Lab outline** — Path A artifact + steps; Path B unit of work with BOTH engine variants
     (Claude Code prompt/commands and Codex CLI prompt/commands) or Path B — Lead It for
     leader-only modules
   - **Recap bullets** — 3–5
   - **Open questions** — anything needing the human's decision
4. Do **not** build anything. End by telling the human to review the plan and then run
   `/build-module $ARGUMENTS`.

## Rules

- Stay inside the Prior Auth Portal domain. Check entity names against CLAUDE.md.
- Engine parity: if Path B exists, both engine variants must produce the same artifact.
- If the module depends on a concept not yet taught in curriculum order, flag it under
  Open questions instead of silently reordering content.
