# Before you begin

This walkthrough is the long form of the practice kit. The step cards in `steps/` tell you
what to type. These pages tell you why, and show what the reference run on one Windows
machine actually looked like: the folders, the commands, the output and the engine's own
words. You should not need the runbook to follow them.

Everything quoted under "In the reference workspace" comes from that run, at
`D:\aidlc-practice\`. It used Claude Code against AWS AI-DLC v2.11.0, and moved to
2.11.1-preview.20261011.1 partway through step 08. Output captured after that point says so.

## The feature

The utilization management (UM) director wants urgent prior auth requests decided inside
72 hours, with nurses seeing those requests first and providers notified the moment a
determination exists. An at-risk alert should fire before the clock runs out.

The deadline is not the team's invention. For Medicare Advantage, Medicaid and CHIP, and
exchange plans, the CMS Interoperability and Prior Authorization rule (CMS-0057-F) sets
72 hours for expedited and 7 calendar days for standard decisions from January 1, 2026.
Your compliance team owns the exact reading, including when the clock starts. In the
reference run the room chose "when the request is complete", and that one answer shaped
the success metrics, the requirements and the code.

Three repos have to change together, and one of them does not exist yet.

| Repo | What changes | Starting point | Unit of work |
|---|---|---|---|
| `prior-auth-api` (TypeScript + Jest) | `AuthRequest.urgency` (`STANDARD` or `URGENT`) and `decisionDueAt`; urgent requests go to the front of the nurse review queue; emits `determination.issued` and `sla.at-risk`; publishes the contract. The auto-approve rule stays as it is: score ≥ `AUTO_APPROVE_THRESHOLD` (0.85). | Brownfield | `api-urgency-clock` |
| `prior-auth-web` (React + Vitest) | Urgency badge and countdown in `AuthQueue`; `URGENT` first, then by due time. | Brownfield | `web-urgent-queue` |
| `prior-auth-notify` (new, TypeScript) | Consumes the two events; sends provider and member notices with status and `referenceId` only (decision D-003: no clinical content). | Greenfield | `notify-service` |

### Who owns what

Every decision in this run has an owner, and the engine asks you to name them. Running
solo, you play every seat; write the role after each answer, as the reference run did.

| Seat | Owns |
|---|---|
| Product owner (PO) | Scope, priority, the final say on the brief |
| UM director | The clock, the success targets, the working calendar |
| Nurse lead / nurse supervisor | Who is alerted, and the nurse queue view |
| Compliance lead | The regulatory reading, privacy, retention |
| Tech lead | Feasibility, the team, workspace setup |
| api lead, web lead, notify lead | Their repo's unit, its code-generation plan, its checkpoint |
| QA lead | Build and test across the repo boundary |
| Release owner | Deploy order |

[`answers/mob-answer-sheet.md`](../answers/mob-answer-sheet.md) lists each decision the
reference run met and who answered it.

## Where Markdown lives

The most common multi-repo mistake is putting the feature record inside one of the service
repos. The other repos can't see it, and it outlives the feature in the wrong place.
AI-DLC v2 avoids this with a **workspace**: a hub folder that holds the AI-DLC record, with
each code repo cloned beside it. Markdown ends up in three homes, and each has one rule.

| Home | Path | The one rule | What lives there |
|---|---|---|---|
| 1. The hub | `prior-auth-workspace\aidlc\` | Everything about the feature. The hub is its own git repo. | The intent record (state, audit, every stage's artifacts); per-repo code knowledge in `codekb\<repo>\`; the team method in `memory\` and standards in `knowledge\` |
| 2. Each code repo | `prior-auth-workspace\prior-auth-*\` | Everything that must outlive the feature. | Code and tests (generated into the repo, never the hub); steering in `AGENTS.md`, which `CLAUDE.md` imports; `docs\decisions.md`, the durable domain decisions, copied over from the hub's ADR log at close-out |
| 3. The tracker | `prior-auth-workspace\tracking\rally\` → Rally | A mirror for reporting, never the source of truth. | An import file the AI drafts and a human imports; one map file of Rally IDs; state moves at human gates, not on AI activity |

The hub's `.gitignore` lists the three sibling folders, so the hub never commits
application code. Each sibling keeps its own `.git` and its own history. AWS ships no Rally
or Jira integration; home 3 is this course's convention.

## The whole run on one page

Ten steps, five phases, 33 stages at enterprise scope. In v2 every stage the scope runs
ends at a human gate; the gate column names the ones that matter most. Paths are relative
to the intent folder, `aidlc\spaces\default\intents\<id>\` (in the reference run,
`261011-urgent-auth-clock`), unless they start with `codekb\`, `memory\`, `tracking\` or a
repo name.

| Step | Phase · stages | Main gate | Files written |
|---|---|---|---|
| 01 Workspace | Before the lifecycle | None; `aidlc doctor` shows 0 problems | `repos.json`, `.gitignore` (managed block), `aidlc.code-workspace`, `.claude\` or `.codex\`, `aidlc\spaces\default\memory\*` |
| 02 Intent and scope | 0 Initialization (0.1–0.3), 1 Ideation (1.1–1.7) | 1.1 intent statement; 1.7 initiative brief is the go/no-go | `aidlc-state.md`, `audit\`; `ideation\intent-capture\` (`intent-statement.md`, `stakeholder-map.md`, questions); the rest of `ideation\`, ending in `ideation\approval-handoff\initiative-brief.md`; `verification\phase-check-ideation.md` |
| 03 Read the repos | 2 Inception · 2.1 Reverse Engineering, 2.2 Practices Discovery | codekb per repo; practices promoted to `memory\` | `codekb\<repo>\` (business overview, architecture, code structure, API docs, component inventory, tech stack, dependencies, code quality, timestamp); `inception\practices-discovery\`, promoted into `memory\team.md` and `memory\project.md` |
| 04 Requirements | 2 · 2.3 Requirements Analysis (Mob Elaboration) | Every `[Answer]:` filled | `inception\requirements-analysis\requirements-analysis-questions.md`, `requirements.md`; new rows in `audit\` |
| 05 Stories and Rally | 2 · 2.4 User Stories, 2.5 Refined Mockups | Stories approved | `inception\user-stories\stories.md`, `personas.md`; `inception\refined-mockups\` |
| 06 Design, units, contract | 2 · 2.6 Domain Design, 2.7 Units Generation, 2.8 Contract Design | One unit per repo; contract summary | `inception\domain-design\components.md`, `decisions.md`; `inception\units-generation\unit-of-work*.md`; `inception\contract-design\contract-summary.md` |
| 07 Bolt plan | 2 · 2.9 Delivery Planning, then the phase check | Bolt plan, then import Rally stories | `inception\delivery-planning\` (bolt plan, sequencing rationale, team allocation, dependency map); `verification\phase-check-inception.md`; `tracking\rally\<intent>\rally-import.csv`, `rally-map.md` |
| 08 Construction | 3 Construction · 3.1–3.5, per unit | Code-generation plan per unit, before any code; verified-unit checkpoint | `construction\<unit>\` (functional design, NFR requirements, NFR design, code generation); code in `prior-auth-api\src\`, `prior-auth-api\contracts\`, `prior-auth-notify\src\`, `prior-auth-web\src\` |
| 09 Build and test | 3 · 3.6 Build and Test, 3.7 CI Pipeline | Contract and end-to-end tests pass | `construction\build-and-test\build-instructions.md`, `test-results.md`; `construction\ci-pipeline\quality-gates.md`; the Construction phase check |
| 10 Operate and close | 4 Operation · 4.1–4.7, then close-out | Deploys in order api → notify → web; close-out | `operation\` (rollback runbook, deployment log, SLO config, incident runbooks); new entries in `prior-auth-api\docs\decisions.md` and `prior-auth-notify\docs\decisions.md` |

Code reaches a repo only during Construction, and only through the engine's per-repo
anchor. Rally changes only after a human gate.

## Gate checklist

Seventeen gates in run order. The engine's own record of each approval is the audit shard
under `audit\`; this list is for the room.

| # | Phase | Gate | Who approves |
|---|---|---|---|
| 1 | Ideation | 1.1 Intent statement approved | PO + UM director |
| 2 | Ideation | 1.4 Scope document approved | PO + tech lead |
| 3 | Ideation | 1.7 Initiative brief approved, then create the Rally Feature | Sponsor |
| 4 | Inception | 2.1 codekb approved: prior-auth-api, prior-auth-web | Each repo lead |
| 5 | Inception | 2.2 Practices promoted to `memory\` (repo-steering rule included) | Tech lead |
| 6 | Inception | 2.3 Requirements approved: every `[Answer]:` filled | The mob |
| 7 | Inception | 2.4 User stories approved | PO |
| 8 | Inception | 2.6 Domain design and ADR log approved | Architect |
| 9 | Inception | 2.7 Units approved: one unit per repo; repo set locked | Tech lead |
| 10 | Inception | 2.8 Contract summary approved | api lead + web lead + notify lead |
| 11 | Inception | 2.9 Bolt plan approved, then import Rally stories (Defined) | Tech lead + PO |
| 12 | Construction | U1 skeleton checkpoint approved | api lead |
| 13 | Construction | Per unit: code-generation plan approved, then Rally In-Progress | Owning repo lead |
| 14 | Construction | Per unit: verified unit checkpoint, then Rally Completed | Owning repo lead |
| 15 | Construction | 3.6 Build and Test approved: contract and end-to-end | QA lead |
| 16 | Operation | Deploys approved in order: api → notify → web | Release owner |
| 17 | Operation | Close-out: ADRs copied into each repo's `decisions.md`; Rally Accepted; intent complete | Tech lead + PO |

At every gate, reply in plain words: `Approve`, or `Request Changes: <what and why>`.

## Claude Code ↔ Codex CLI

The method, stages, gates and artifacts are the same on both engines. Only the shell
around them differs, and one hub can hold both.

| Concern | Claude Code | Codex CLI |
|---|---|---|
| Project setup | `aidlc config --harness claude --yes` | `aidlc config --harness codex --yes` |
| Invoke or resume | `/aidlc` | `$aidlc` |
| Engine directory | `.claude\` | `.codex\` (skills go to `.agents\skills\`) |
| AI-DLC onboarding | `.claude\CLAUDE.md`, whose first line is `@.claude/rules/aidlc.md` | `developer_instructions` in `.codex\config.toml`; the same text in `.codex\onboarding.md` for you to read; an AI-DLC block in the hub's `AGENTS.md` |
| First-run extra | Accept the workspace trust dialog once, interactively | In `codex`, type `/hooks`, press `t` to trust all, then `Esc`. Codex finds project hooks only in a git repo, one more reason the hub is its own repo. |
| Repo steering (each repo) | `CLAUDE.md` imports `@AGENTS.md` and `@docs/decisions.md` | `AGENTS.md` |
| Intent record, gates, artifacts | Identical: `aidlc\spaces\...`. Teammates on different engines can share one intent. | Same |

The reference run used Claude Code throughout. A second hub, `D:\aidlc-practice\codex-workspace`,
was configured for Codex to check the setup; `aidlc doctor` there reported one outstanding
action, the hook trust above.
