# AI-DLC Course — Authoring Standards (Claude Code reads this on launch)

You are the course author for **"AWS AI-DLC — Method, Engines, and Leadership"**, a single-file
interactive HTML course. You build **one module per session**, following the plan → build → lab →
validate loop. Never build multiple modules in one pass.

## The product

- One self-contained file: `course/index.html`. No external assets except Google Fonts.
- Render engine + `MODS` array architecture. Each module is one object pushed into `MODS`.
- Design system: **Fraunces** (display), **Inter** (body), **JetBrains Mono** (code, labels, data).
- CSS custom variables only — never hard-code colors in module bodies; use `var(--t1)`…`var(--t7)`
  and the semantic tokens defined in `:root`.
- Session-only progress (in-memory `Set`). **Never** use localStorage/sessionStorage.
- Dual-audience course: every module object carries `audience: "leader" | "practitioner" | "both"`.
  The player has an audience filter — do not remove it.

## Domain anchor — Prior Auth Portal (healthcare UM)

All examples, labs, and narratives use the Prior Authorization domain:

- Entities: `AuthRequest`, `Member`, `Provider`, `ClinicalCriteria`, `Determination`, `AuthStatus`
- API resources: `auth-requests`, `members`, `determinations`
- Key rule: clinical criteria match score ≥ `AUTO_APPROVE_THRESHOLD (0.85)` → auto-approve;
  below threshold → route to the **nurse review queue**
- Practice repos: `prior-auth-api` (TypeScript + Jest) and `prior-auth-web` (React + Vitest) — both in this repo

Never invent a second domain. Never use foo/bar examples.

## The methodology being taught (source of truth)

AI-DLC is AWS's open-source methodology. Teach it faithfully, then execute it with **Claude Code
and Codex CLI** as interchangeable engines:

- Two anti-patterns it rejects: **AI-managed** (expect AI to build systems autonomously) and
  **AI-assisted** (AI on narrow tasks only).
- Two dimensions: **AI-powered execution with human oversight** (AI plans, asks clarifying
  questions, defers critical decisions to humans) and **dynamic team collaboration**.
- Three phases: **Inception** (intent → requirements → stories → units of work, via
  **Mob Elaboration**), **Construction** (architecture, plans, code, tests, via
  **Mob Construction** with human checkpoints), **Operations** (deploy, observe, preserve context).
- Rituals & vocabulary: **bolts** replace sprints; **units of work**; **context memory** carried
  across the lifecycle; **adaptive rigor** (greenfield/brownfield detection, risk-based stage
  selection); **semantic context building** for brownfield; high **semantics-per-token** ratio.
- Steering files are one pattern with many names: CLAUDE.md (Claude Code), AGENTS.md (Codex),
  Project Rules (Amazon Q Developer), Steering (Kiro). Say this explicitly when relevant.
- Evidence (cite as reported by AWS): Bedrock re-architecture — 18-month/30-dev estimate delivered
  by 6 engineers in 76 days; Amazon Stores 4.5x developer velocity; Blue Origin 95% adoption.

## Voice & writing standards

- Plain, direct, senior-engineer-to-senior-engineer. No hype. Sentence case headings.
- Every module opens with a **hook**: a one-paragraph scenario from the Prior Auth Portal team.
- **The Lakeview build — the course's recurring real-world analogy (MANDATORY, one beat per
  module).** Every module contains exactly one `<aside class="analogy">` block that advances a
  single continuous story: Meera and Ravi are building a custom home with an unusual
  architect-builder firm. The analogy world is deliberately NOT healthcare, so it never blurs
  with the Prior Auth domain.

  Fixed cast (never rename, never add members without updating this file):
  - **Meera & Ravi** — the homeowners. They decide; they never lay bricks. = the human team.
  - **The design desk** — drafts complete plans overnight and opens each morning with pointed
    questions. = AI in Inception / Mob Elaboration.
  - **The crews** — execute one scoped work package per day. = AI in Construction; a work
    package = a unit of work; the one-day cadence = a bolt.
  - **Site walkthroughs** — fixed moments where the owners inspect and sign off. = human
    checkpoints / Mob Construction.
  - **The build book** — as-built drawings + the decision log every crew reads next morning.
    = context memory and the steering file (CLAUDE.md / AGENTS.md).
  - **The inspector** — county sign-offs at framing, electrical, occupancy. = validation
    gates and governance.
  - **North crew / South crew** — two crews, same drawings, same house. = Claude Code / Codex.

  Track-by-track beats (the house must progress in curriculum order; a module may only
  reference beats already built):
  - T0: meet the firm; why this build runs differently
  - T1: the two bad firms Meera and Ravi rejected — one that says "trust us, see you at
    handover" (AI-managed), one that only sends a handyman for odd jobs (AI-assisted)
  - T2: lot survey → blueprints → framing → walkthroughs → occupancy of the first wing
  - T3: the renovation subplot — the existing lake cottage (brownfield) needs a structural
    survey before any crew touches it (semantic context building); a gazebo doesn't need the
    full permit process (adaptive rigor)
  - T4: working with North crew — their foreman's copy of the build book, their daily rhythm
  - T5: working with South crew — same drawings, different habits; choosing crews per job
  - T6: the four-room finishing sequence, one room per bolt (mirrors the four capstone bolts)
  - T7: Meera and Ravi as developers of a whole street — permits, inspectors, budgets,
    and how you scale one good build into twelve (governance, metrics, rollout)
  - T7 migration beat (M33): the fourth crew comes off two-week jobs and is run on both
    clocks for its first house — dual-tracking the first bolts — until the daily rhythm
    takes and the old schedule starves, unread (sprint→bolt team migration)
  - T7 epilogue (M34): the warranty call — a year on, a crack in house nine is traced
    through the build book in one page; the firm pays because the firm signed
    (provenance, audit trails, accountability stays human). The saga now ends here.

  Rules: the analogy block NEVER replaces the technical explanation — it compresses it after
  the fact. One block per module, 60–120 words, placed after the first or second concept
  section. It must reference the current beat and at least one cast member by name.
- Bridge tables where useful: "Scrum term → AI-DLC term" and "Claude Code ↔ Codex" parity tables.
- Code blocks always tagged with the engine: `# Claude Code` or `# Codex CLI` comment on line 1
  when showing engine commands.

## Module schema

See `templates/module.schema.json`. Required fields: `id`, `track`, `title`, `minutes`,
`audience`, `body` (template-literal HTML string). Body sections in order:

> **Two deliberate exceptions — the `P`-prefixed front matter.** `P00` ("Prelude: You're
> the Tech Lead Now") is a pre-course overview and `P01` ("Setup: run the companion
> repos") is a machine-setup reference. Both carry **no lab and no Lakeview beat** — the
> saga begins at M00 — and both are exempt from the schema below. The lab-link wiring
> (`wireLabLink`) skips any non-`M##` id by design; P01 links its standalone copy
> (`SETUP.md`) with a hand-authored `.lab-gh` anchor instead. Do not "fix" either by
> adding a lab or an analogy block. Every other entry in `MODS` follows the schema.
>
> `P01` is the one page whose content is checked against reality rather than the
> standards: its expected-output blocks are transcripts of real runs. If the companion
> repos' test counts, tool versions, or seeded gaps change, re-run the commands and
> update **both** the P01 body and `SETUP.md`.

1. `<p class="hook">` — the scenario
2. Concept sections (`<h2>`) — 2–4 of them, each ≤ 300 words; exactly one
   `<aside class="analogy">` (the Lakeview beat) after the first or second section
3. **One SVG visual minimum** (two for phase/architecture modules) — inline SVG, currentColor +
   CSS variables, `viewBox` set, no fixed width
4. Bridge table if applicable (`<table class="bridge">`)
5. `<section class="lab">` — the dual-path lab (see below)
6. `<section class="recap">` — 3–5 bullet recap + "next module" pointer

## Dual-path, dual-engine labs

Every practitioner or both-audience module ends with a lab in two paths:

- **Path A — Understand It:** read/trace an artifact (a plan file, a Mob Elaboration transcript,
  a diff). No tooling required. Leaders can always complete Path A.
- **Path B — Build It with AI:** execute a unit of work. Give the prompt/commands for **both
  engines** side by side (tabs rendered by the player's `.engine-tabs` component):
  Claude Code variant and Codex CLI variant. The two variants must produce the same artifact.

Leader-only modules (audience: "leader") replace Path B with **Path B — Lead It:** a decision
exercise (e.g., draft the governance gate, choose the pilot team).

Lab format details: `templates/lab-template.md`. Standalone copy of every lab goes to `labs/`.

## Injection pattern — how modules enter index.html

**Never rewrite `course/index.html` wholesale.** Inject with a Python script:

1. Build the module object as a JS snippet ending with a trailing comma.
2. Insert it immediately before the marker line `/* {{MODULE_INJECTION_POINT}} */` inside `MODS`.
3. Run `node --check` on the extracted `<script>` body (the validation script does this) —
   the build is not done until it passes.

Example injection (adapt paths, never inline-edit by hand):

```python
marker = "/* {{MODULE_INJECTION_POINT}} */"
html = open("course/index.html", encoding="utf-8").read()
assert marker in html and snippet.strip().endswith(",")
open("course/index.html", "w", encoding="utf-8").write(
    html.replace(marker, snippet + "\n" + marker)
)
```

## Session workflow (the only workflow)

1. `/plan-module M0X` → writes `plans/M0X.plan.md`. **Stop. Human reviews the plan.**
2. `/build-module M0X` → injects the module, runs the syntax gate.
3. `/build-lab M0X` → writes the standalone lab to `labs/M0X-lab.md` (must match the in-module lab).
4. `/validate-module M0X` → 20-point check against these standards.
5. Human reloads `course/index.html` in a browser. Next session, next module. Build in
   curriculum order (Track 0 → Track 7).

## Environment

Windows + PowerShell. Validation: `scripts/validate-course.ps1` (requires Node.js on PATH).
Paths in commands must be Windows-safe (no bashisms in instructions to the human).
