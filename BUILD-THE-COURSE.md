# BUILD-THE-COURSE — AWS AI-DLC Course Kit

A Claude-Code-driven kit for authoring **"AWS AI-DLC — Method, Engines, and Leadership"** — a
single-file interactive HTML course. Same pattern as the Spring and NestJS/Angular kits:
standards + curriculum + seeded player + slash commands, modules built **one at a time**.

## What's in here

```
CLAUDE.md                    authoring standards (Claude Code reads this on launch)
curriculum-map.md            8 tracks, 33 modules, dual-audience tags, sequencing rationale
course/index.html            render engine + M00 built as the worked example  ← open in a browser
.claude/commands/            /plan-module  /build-module  /build-lab  /validate-module
templates/
  module.schema.json         the shape of a module object
  lab-template.md            dual-path, dual-engine lab format
scripts/validate-course.ps1  mechanical checks + node --check syntax gate
plans/                       per-module plans land here (M01.plan.md, ...)
labs/                        standalone copies of each lab
SETUP.md                     standalone copy of P01 — how to run the companion repos
prior-auth-api/              companion repo 1 — TypeScript + Jest (labs run here)
prior-auth-web/              companion repo 2 — React + Vite + Vitest
```

**Learners start at `SETUP.md` / page P01**: prerequisites, clone, install, and the verbatim
expected output of `npm test`, `npm run typecheck`, and `npm run dev` in both companion repos.
Those output blocks are transcripts of real runs — re-run the commands and update both copies
whenever the repos change.

## Preview the course

Open `course/index.html` in a browser — fully self-contained. You'll see **M00** rendered:
the bolt rail, the audience filter (All / Leader / Builder), two SVG visuals (the AI-DLC loop
and the Prior Auth Portal flow), the Scrum→AI-DLC bridge table, and the dual-path lab with
Claude Code / Codex engine tabs. Every module you build appears in the sidebar automatically.

## How to build it (in Claude Code, on Windows)

Do **not** ask Claude Code to "build all 33 modules." Build one per session:

1. Open this kit folder in Claude Code — it reads `CLAUDE.md` automatically.
2. **Plan:** `/plan-module M01` → review `plans/M01.plan.md`; refine until objectives, hook,
   visuals, and the lab outline (both engine variants!) are right.
3. **Build:** `/build-module M01` → injects the module into `course/index.html` and runs the
   `node --check` gate.
4. **Lab:** `/build-lab M01` → writes `labs/M01-lab.md`.
5. **Validate:** `/validate-module M01` → 20-point check
   (`.\scripts\validate-course.ps1 -Module M01` runs the mechanical half).
6. Reload `course/index.html`. Next session, next module. Build in curriculum order
   (Track 0 → Track 7).

## What's specific to this course

- **Dual audience.** Every module carries `audience: leader | practitioner | both`. The player
  filters the sidebar by path. Leader-only modules swap the build lab for a decision exercise.
- **Dual engine.** Path B of every practitioner lab ships in two variants — Claude Code and
  Codex CLI — that must produce the same artifact. The `.engine-tabs` component renders them.
  This is the course's core argument made physical: one methodology, interchangeable engines.
- **The Lakeview build.** Every module carries exactly one recurring-analogy block: Meera and
  Ravi's custom-home build, with a fixed cast (design desk, crews, site walkthroughs, build
  book, inspector, North/South crews) mapped one-to-one onto AI-DLC. The story progresses in
  curriculum order — `CLAUDE.md` pins the cast and the track-by-track beats, `/plan-module`
  drafts each beat for review, and validation fails a module without its analogy block. The
  analogy world is deliberately non-healthcare so it never blurs with the Prior Auth domain.
- **Methodology fidelity.** The AI-DLC facts (three phases, bolts, Mob Elaboration, adaptive
  rigor, the Bedrock/Amazon Stores/Blue Origin evidence) are pinned in `CLAUDE.md` — module
  content must not drift from them.

## Tip

Build **M01–M04** first to finish Track 1, then run a `/validate-module` pass over all five
existing modules before entering Track 2 — it locks the voice, the visual style, and the
engine-parity discipline early, when it's cheap to correct.
