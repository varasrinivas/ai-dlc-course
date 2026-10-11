# Track 8 plan: Running AI-DLC on AWS's v2 engine

> Status: **approved**, 2026-10-11 (all four decisions taken as recommended; see Decisions). Nothing
> is built yet. Each module still gets its own
> `/plan-module M3X` pass after this track plan is approved.
> Pinned to `awslabs/aidlc-workflows` **v2.11.0**. Every v2 fact below was checked against the pinned
> docs used for the v2 alignment audit (`plans/v2-alignment-audit.md`, Sources).

## Why this track exists

Tracks 0–7 teach the method by hand: a bare engine, plain files, rituals run by people. That is the
course's deliberate choice, and the audit kept it. But AWS now ships the method as an engine: an
`aidlc` CLI that installs into Claude Code or Codex, numbers 33 stages, writes the record, and holds
the gates. Learners who finish Track 7 and go to work will meet that engine. Track 8 answers one
question: **what changes when the engine runs the method for you, and what must stay in human hands?**

It also gives the v2 notes added across the course (the "In AWS's v2 workflows" callouts) a place to
land as practice, and absorbs the multi-repo runbook into the curriculum.

## Shape

- **Track 8 — Running AI-DLC on AWS's v2 engine.** Six modules, **M35–M40**, about 3 hours.
- Audience: practitioner-led; M40 is `both` so leaders have one entry point.
- Paths: practitioner path gains T8 at the end; leader path gains M40 only.
- Prerequisite: Tracks 2–5 (the hand-run method and both engines). Track 6 recommended.
- Domain: the same Prior Auth Portal repos. The track's running intent is a real change the
  capstone left open: **re-score pending requests when `ClinicalCriteria` change**, a guardrail-class
  change (it touches the 0.85 threshold path), so the engine has to run its stricter scopes.
- Engine parity: every Path B runs on both harnesses. `/aidlc` in Claude Code, `$aidlc` in Codex.
  Same intent, same artifacts.

## Module list

| ID | Title | Audience | Minutes | Key concepts (v2 stage / command) |
|---|---|---|---|---|
| M35 | Install the engine, keep the method | practitioner | 30 | `install.ps1`, `aidlc doctor`, `aidlc config --harness claude\|codex`, `/aidlc` vs `$aidlc`, onboarding files (`.claude/CLAUDE.md`, `.codex/onboarding.md`, shared root `AGENTS.md` block), Codex hooks trust and git-repo requirement. Hand-run file → v2 file map. Initialization 0.1–0.3 |
| M36 | The record: spaces, intents, memory, audit | practitioner | 30 | `aidlc/spaces/<space>/intents/<YYMMDD>-<label>/`, `aidlc-state.md`, `audit/<host>-<clone>.md` shards, the 115-event taxonomy, `memory/` rules layered org → team → project → phase → stage, `knowledge/`, `codekb/`. Where `docs/decisions.md` goes now |
| M37 | Scopes, depth and the composer | practitioner | 25 | 11 scopes × 3 depths, the adaptive composer, `scope save`, Guard Policy (`strict` on `enterprise`), fences. M10's dial → v2 knobs; choosing the scope for a guardrail-class change |
| M38 | Inception on the engine | practitioner | 35 | 1.1 Intent Capture, 2.1 Reverse Engineering into `codekb/prior-auth-api/`, questions files with `[Answer]:`, Approve / Request Changes gates, 2.3 Requirements, 2.4 User Stories (the agent mob), 2.7 Units Generation (unit DAG), 2.9 Delivery Planning (`bolt-plan.md`). Where Mob Elaboration still happens: the humans in the room answering the file |
| M39 | Construction on the engine | practitioner | 35 | Per-unit 3.1–3.5, plan approval, walking skeleton, verified unit checkpoint (`bolt checkpoint`), unit-major vs stage-major and swarm, 3.6 Build and Test once, `bolt set-autonomy` and why the course keeps it off for the threshold path |
| M40 | Multi-repo intents and teams on the engine | both | 30 | Hub workspace, sibling repos, `repos.json` + workspace sync, `--repo <name>`, per-repo `codekb/`, team mode (`Unit Ownership: team`) and its single-repo limit, Rally as a human mirror. Teaches from `runbook/multi-repo-feature.html` |

Six modules is the floor that keeps one module per idea. A seventh, **governance on the engine**
(fences, Guard Policy, `aidlc attest` provenance, mapping to M30/M34), is folded into M36 and M37 for
now; split it out if M36 runs long.

## Per-module notes

**M35 — Install the engine, keep the method.**
Hook: the platform team mandates AWS's engine for every repo next quarter; the portal team has run
AI-DLC by hand for a year and has to decide what survives. Concepts: what the installer actually
writes (and to which files you already own), the onboarding block vs your rules, the hand-run → v2 map
(table: `CLAUDE.md`/`AGENTS.md` → onboarding + `memory/`; `docs/decisions.md` → `memory/` rules +
intent ADRs; `docs/units/` → `inception/units/`; semantic map → `codekb/`). Lab A: read a diff of
`prior-auth-api` before and after `aidlc config`. Lab B: install, `aidlc doctor`, configure both
harnesses, confirm the domain rules still load.
Visual: the two-column file map; the install sequence.

**M36 — The record.**
Hook: the compliance officer from M11 returns and asks for the same four-minute check, this time on
the engine's record. Concepts: the intent folder, state vs audit (`aidlc-state.md` vs audit shards),
memory layering, what is committed. Lab A: trace one approval from questions file → gate → audit
event. Lab B: start the running intent, stop after Initialization, inspect the record on both engines.
Visual: the intent folder tree with owner badges (reuse the runbook's explorer idea, statically).

**M37 — Scopes, depth and the composer.**
Hook: a developer starts the re-score change with `bugfix`; the threshold path makes that the wrong
call. Concepts: scope picks stages, depth picks detail, composer proposes, human decides; Guard Policy
and fences as mechanical gates (M17's lock, now built in). Lab A: given four Prior Auth changes, pick
scope + depth and justify against M10's policy. Lab B: run the composer on the running intent in both
engines and compare its plan with the hand-scored M10 dial.
Visual: the 11-scope × 33-stage grid, with the guardrail-class path highlighted.

**M38 — Inception on the engine.**
Hook: the first engine-run Inception produces more questions than the team's hand-run one did.
Concepts: Reverse Engineering on a brownfield repo (9 files), questions files, the stages that always
run, the unit DAG and `bolt-plan.md`. Lab A: read a real answered questions file and its gate record.
Lab B: run Inception for the running intent through 2.9 on both engines; answer the questions as the
team, not as the AI.
Visual: Inception stage chain with gates; the unit DAG for the re-score intent.

**M39 — Construction on the engine.**
Hook: the engine offers "Continue automatically"; the tech lead says no for the threshold unit.
Concepts: per-unit stages, plan approval, verified checkpoints, walking skeleton, serial vs swarm.
Lab A: review a unit checkpoint and its verification receipt. Lab B: build the first unit on both
engines with plan approval on; prove the 0.85 guardrail test runs at the checkpoint.
Visual: the Construction walk, unit-major vs stage-major side by side.

**M40 — Multi-repo intents and teams.**
Hook: the urgent-auth 72-hour clock from the runbook lands on three repos. Concepts: hub workspace,
`--repo`, team mode's single-repo limit and the workaround, Rally mapping (M33's pair). Lab A (both):
trace the runbook's file explorer for one gate. Lab B — Build It: add `prior-auth-web` to the intent
and run 2.1 on it. Lead It variant for leaders: decide unit ownership for the three repos.
Visual: reuse the runbook's swimlane map in course style.

## Prerequisites before any module is built

1. **Root `CLAUDE.md`:** add Track 8 to the methodology section (v2's five phases and 33 stages as the
   engine view, the three phases as the method view), and decide the Lakeview question below.
2. **`curriculum-map.md`:** a Track 8 section and the new totals (43 entries / 41 modules).
3. **`course/index.html`:** `TRACK_META[8]`, a `--t8` color token in `:root` (light and dark), and the
   M00 path lists. Injected by script, per the injection rule.
4. **Real transcripts.** Like P01, every expected-output block in Track 8 is a transcript of a real
   run. That means installing `aidlc` v2.11.0 on this machine and running each lab on both engines
   before its module is built. Record the versions in each module.
5. **Two deploys, not one**, per the deploy notes: the course file and the learnings hub card (link
   list, `cnt`, "N modules · 9 tracks").

## Decisions (approved 2026-10-11)

All four went as recommended: (1) coda beats, with the site office as the new cast member; (2) the
`prior-auth-workspace/` hub folder, placed **outside** the kit at setup (Claude Code reads every
parent `CLAUDE.md`, so an in-kit hub would load the course-authoring rules into engine sessions); (3) a version stamp per module and a re-verify pass per minor
release; (4) the engine is an option, not a replacement. The beats and rules are now in `CLAUDE.md`
(Lakeview T8 coda, "Track 8 rules"), and Track 8 is in `curriculum-map.md`.

The options as reviewed:

1. **The Lakeview saga.** `CLAUDE.md` makes one analogy beat per module mandatory, but also says the
   saga ends at M34. Options:
   - **(a) Coda beats (recommended).** A short post-epilogue arc: the firm adopts a site-management
     system that schedules crews and keeps the build book for them; Meera and Ravi learn what it
     can't do (sign). Fits the track's question exactly. Needs new beats in `CLAUDE.md`.
   - (b) Exempt Track 8 from the analogy, like P00/P01. Simpler; breaks the "every module" rule.
2. **Where the engine's workspace lives.** The practice repos are folders inside the course repo.
   v2 writes `aidlc/` at the workspace root and needs a git repo. Options: (a) a new
   `prior-auth-workspace/` hub folder in the kit with the two repos as siblings (recommended; matches
   the runbook), or (b) run the engine at the kit root, which puts `aidlc/` in the course repo.
3. **Version churn.** v2 moves fast (2.11.0 shipped 2026-10-08). Pin each module to a version with a
   "verified against vX on date" stamp, and accept a re-verify pass per minor release? (recommended)
4. **Hand-run vs engine stance.** Track 8 presents the engine as an option, not a replacement, and
   keeps the course's hand-run tracks as the way to learn the method. Confirm.

## Next step

Review this plan. Once the decisions are made: update `CLAUDE.md` and `curriculum-map.md`, install
`aidlc` and capture the M35 transcripts, then `/plan-module M35`.
