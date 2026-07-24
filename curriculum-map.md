# AWS AI-DLC — Curriculum Map

> **Course:** AI-Driven Development Lifecycle (AI-DLC) — Method, Engines, and Leadership
> **Audience:** Dual-track — Engineering Leaders **and** Hands-on Practitioners
> **Engines:** Claude Code and OpenAI Codex CLI as the AI-DLC execution engines (methodology is AWS's; engines are tool-agnostic)
> **Domain anchor:** Prior Auth Portal (healthcare Utilization Management — AuthRequest, Member, Provider, ClinicalCriteria, Determination, AuthStatus)
> **Total modules:** 36 entries — the P00 prelude + M00 orientation + 34 content modules across 8 tracks

Every module carries an audience tag: `leader` | `practitioner` | `both`.
Two suggested paths are rendered in M00:
- **Leader path:** T0 → T1 → T2 → T3 (skim) → T7
- **Practitioner path:** T0 → T1 (skim) → T2 → T3 → T4 → T5 → T6

---

## Track 0 — Orientation (color: #6366f1)

| ID  | Title | Audience | Key Concepts |
|-----|-------|----------|--------------|
| P00 | Prelude: You're the Tech Lead Now | both | The whole method in one sitting, before the vocabulary arrives. **Deliberate schema exception:** the prelude carries no lab and no Lakeview beat — the saga starts at M00. Skippable for anyone who has run a bolt. |
| M00 | Course Orientation: A New Lifecycle, Two Engines | both | Course structure, the two paths, Prior Auth Portal domain intro, environment setup (Claude Code + Codex CLI) |

## Track 1 — The Case for AI-DLC (color: #b45309)

| ID  | Title | Audience | Key Concepts |
|-----|-------|----------|--------------|
| M01 | The Two Anti-Patterns | both | AI-managed (full autonomy) vs AI-assisted (narrow tasks); why both underdeliver; 10–15% vs transformative gains |
| M02 | AI-DLC Core Principles | both | AI-powered execution with human oversight; dynamic team collaboration; AI plans, asks, defers critical decisions |
| M03 | New Rituals & Vocabulary | both | Bolts (not sprints), Mob Elaboration, Mob Construction, units of work, context memory across the lifecycle |
| M04 | The Evidence | leader | Bedrock re-architecture (30 devs/18 months → 6 devs/76 days), Amazon Stores 4.5x velocity, Blue Origin 95% adoption; what made those work (small modules, monorepo context, explicit errors) |

## Track 2 — The Three Phases (color: #0d9488)

| ID  | Title | Audience | Key Concepts |
|-----|-------|----------|--------------|
| M05 | Inception: Intent → Units of Work | both | Business intent decomposition, AI-generated requirements & stories, question-driven elaboration |
| M06 | Mob Elaboration in Practice | both | Whole-team validation of AI proposals, clarifying-question loops, acceptance criteria for the Prior Auth intake epic |
| M07 | Construction: Plans, Code, Tests | practitioner | AI-proposed architecture, implementation plans, generated code + tests, human checkpoints |
| M08 | Mob Construction & Human Checkpoints | practitioner | Team-in-the-loop construction, review gates, "understand every line" discipline |
| M09 | Operations: Deploy, Observe, Preserve Context | both | Deployment artifacts, observability, sequential knowledge handoff, context preservation for future bolts |

## Track 3 — Adaptive Workflows & Context Engineering (color: #7c3aed)

| ID  | Title | Audience | Key Concepts |
|-----|-------|----------|--------------|
| M10 | Adaptive Rigor | both | Greenfield vs brownfield detection, risk-based execution, stage selection heuristics |
| M11 | The Stage Library | practitioner | Open-source workflow definition, stages & decision heuristics, extensibility |
| M12 | Semantic Context Building for Brownfield | practitioner | Codebase analysis, semantic maps, high semantics-per-token ratio |
| M13 | Context Memory Across the Lifecycle | practitioner | Plan files as durable memory, handoff artifacts, steering files (CLAUDE.md / AGENTS.md / Q Rules / Kiro Steering as one pattern) |

## Track 4 — Claude Code as the AI-DLC Engine (color: #c2410c)

| ID  | Title | Audience | Key Concepts |
|-----|-------|----------|--------------|
| M14 | Steering with CLAUDE.md | practitioner | CLAUDE.md as the steering layer, project rules, standards enforcement |
| M15 | Inception with Claude Code | practitioner | Plan mode, question-driven elaboration prompts, decomposing the Prior Auth intent into units of work |
| M16 | Construction Loops as Sessions | practitioner | One unit of work per session, plan → build → validate loop, `node --check`-style gates |
| M17 | Checkpoints: Hooks & Validation Gates | practitioner | Hooks, permission model, human approval points, test gates |
| M18 | Parallel Bolts with Subagents | practitioner | Subagents, parallel units of work, merge discipline |

## Track 5 — Codex as the AI-DLC Engine (color: #1d4ed8)

| ID  | Title | Audience | Key Concepts |
|-----|-------|----------|--------------|
| M19 | Steering with AGENTS.md | practitioner | Codex CLI setup, AGENTS.md as steering, approval modes |
| M20 | Inception & Planning with Codex | practitioner | Elaboration prompts, plan generation, decomposition parity with Claude Code |
| M21 | Construction & Review with Codex | practitioner | Build loops, sandboxing, diff review discipline |
| M22 | Choosing & Combining Engines | both | Claude Code vs Codex strengths, when to run both, one methodology / many engines |

## Track 6 — Capstone: Prior Auth Portal by AI-DLC (color: #be185d)

| ID  | Title | Audience | Key Concepts |
|-----|-------|----------|--------------|
| M23 | Capstone Kickoff: Intent → Backlog of Bolts | practitioner | Full Inception on the Prior Auth Portal, units of work, Mob Elaboration transcript |
| M24 | Bolt 1: AuthRequest Intake API | practitioner | Intake endpoints, Member/Provider validation, generated tests |
| M25 | Bolt 2: Clinical Criteria Matching | practitioner | ClinicalCriteria engine, AUTO_APPROVE_THRESHOLD (0.85), auto-approval path |
| M26 | Bolt 3: Nurse Review Queue | practitioner | Routing below-threshold requests, queue semantics, status transitions |
| M27 | Bolt 4: Determinations & Notifications | practitioner | Determination records, notification triggers, audit trail |
| M28 | Operations: Ship & Evolve the Portal | practitioner | Deployment, observability, context handoff for the next bolt cycle |

## Track 7 — Leading the Transformation (color: #4d7c0f)

| ID  | Title | Audience | Key Concepts |
|-----|-------|----------|--------------|
| M29 | Team Topology & Rituals | leader | Pods over squads, rituals replacing sprint ceremonies, role shifts (PO, architect, QA) |
| M30 | Governance, Risk & Compliance Gates | leader | Human oversight as governance, regulated-industry gates (healthcare/PHI angle), accountability structures |
| M31 | Measuring the Shift | leader | Velocity, adoption, quality signals; avoiding vanity metrics; the supporting infrastructure (CI/CD, test fidelity) |
| M32 | The Rollout Playbook | leader | Pilot → scale → sustain, enablement program design, change management for engineers |
| M33 | Migrating a Sprint Team | both | Staged sprint→bolt transition (training-wheels first bolts, dual-tracking); remapping the Jira/Rally board (epic→bolt, story→unit of work, points→bolt lead time); sequencing the first bolt for learning; ceremonies dying by starvation not decree |
| M34 | Responsible AI in the Lifecycle | both | Responsible AI dimensions mapped to AI-DLC checkpoints; fairness & bias in clinical criteria matching; PHI-safe prompting and context hygiene; transparency & audit trails for AI-authored code; human accountability as the load-bearing control |

---

## Sequencing rationale

1. **T1 before T2:** both audiences need the "why" (anti-patterns, principles, evidence) before the mechanics.
2. **T3 before the engine tracks:** adaptive workflows and context engineering are engine-agnostic — learning them first prevents tool-lock thinking.
3. **Claude Code (T4) before Codex (T5):** the deeper steering/hooks/subagent surface makes concepts concrete; T5 then teaches by contrast, and M22 resolves the "which engine" question deliberately.
4. **Capstone (T6) after both engines:** learners execute bolts with either engine and compare.
5. **T7 last but reachable early:** the leader path jumps from T3 to T7 without loss — leader modules never depend on practitioner labs.
