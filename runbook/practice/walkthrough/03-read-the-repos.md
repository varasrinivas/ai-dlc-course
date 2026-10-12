# Walkthrough 03

Stages 2.1 Reverse Engineering and 2.2 Practices Discovery, as they ran in the reference
workspace. Pair this page with [step card 03](../steps/03-read-the-repos.md): the card tells
you what to do, and this page shows what it looked like.

## Background

Ideation ended with a signed brief and a decision log. Nobody has written a requirement yet,
and that is deliberate. Before the engine drafts requirements for three repos, it reads all
three. AI-DLC calls this **semantic context building**: turning code nobody on the mob wrote
this week into a short, checked description that every later stage can lean on.

**2.1 Reverse Engineering is a two-step pipeline.** A *developer* agent scans each repo and
writes a scan report into the intent (`inception/reverse-engineering/developer-scan-<repo>.md`).
An *architect* agent then turns each scan into nine documents in a store that belongs to the
**space**, not the intent:

| File | What it answers |
|---|---|
| `business-overview.md` | What the repo is for, who uses it, which recorded rules govern it |
| `architecture.md` | How the parts fit today, with interaction diagrams |
| `code-structure.md` | Where things live |
| `api-documentation.md` | What the repo exposes, and what it calls |
| `component-inventory.md` | Every component, with its role |
| `technology-stack.md` / `dependencies.md` | Runtime, tooling and pinned versions |
| `code-quality-assessment.md` | Findings (F-01, F-02 ...), gaps and debt |
| `reverse-engineering-timestamp.md` | The commit scanned, the depth, and what was *not* read |

Because the store lives at `aidlc/spaces/default/codekb/<repo>/`, the next intent that touches
prior-auth-api finds it and can reuse it if the code hasn't moved. The timestamp file records the
commit and a fingerprint so the engine can tell.

**Each repo needs its own complete scan before approval.** That includes prior-auth-notify, which
is greenfield. The runbook expected nothing to scan there; AI-DLC v2.11 scanned it anyway and kept
two lists apart: what the steering commits the service to, and what exists. That separation is
what you check as notify lead.

**What a good scan looks like.** A good scan says what is *not* there. prior-auth-api has
services and entities but no HTTP layer, no persistence and no messaging. A scan that invents
endpoints would poison every stage after it, because requirements, design and code all read the
codekb. The repo leads review their own repo's documents against the code, not against what they
remember.

**2.2 Practices Discovery** settles how this team builds and tests. A *release engineer* agent
drafts the practices from the repos' steering files. Three inspectors (quality, developer,
devsecops) review the draft independently, without seeing each other's notes. The engine then asks
only the questions the code can't answer: merge style, tests first or after, how the coverage
floor is measured, what "checks pass" means without CI. Your answers become the team's standing
rules.

**Promotion is the point of 2.2.** When you approve, the practices are written into
`memory/team.md` and the ALWAYS/NEVER rules into `memory/project.md`. From then on every stage
and every unit reads them. This is where the "read each repo's rules first" block from step 01 is
confirmed, and it is the cheapest place to change a team rule: before any plan cites it.

| Seat | Checks |
|---|---|
| api lead | `codekb/prior-auth-api/`: no HTTP layer claimed, D-001 to D-003 cited, the seeded gaps named |
| web lead | `codekb/prior-auth-web/api-documentation.md` describes what the app *calls* |
| notify lead | `codekb/prior-auth-notify/` keeps "committed, not built" apart from "exists" |
| Tech lead | The promoted practices and the 17 ALWAYS/NEVER rules |

## In the reference workspace

### The workspace before this step

The hub just after the Approval & Handoff gate (turn 036-mob), trimmed. The sibling repos are at
their seed commits. Every stage folder under `inception/` already holds a `memory.md`, created when
the intent was initialised; nothing else is there yet.

```text
D:\aidlc-practice\prior-auth-workspace\
  .claude\
  aidlc.code-workspace
  repos.json
  tracking\rally\rally-import-template.csv
  aidlc\spaces\default\
    memory\
      org.md
      project.md
      team.md
      phases\  templates\
    intents\261011-urgent-auth-clock\
      aidlc-state.md
      audit\varalaptop-d3e03ad83f38.md
      ideation\
        approval-handoff\   approval-handoff-questions.md  decision-log.md  initiative-brief.md
        feasibility\        constraint-register.md  feasibility-assessment.md  raid-log.md  [...]
        intent-capture\     intent-statement.md  stakeholder-map.md  [...]
        rough-mockups\      user-flow.md  wireframes.md  [...]
        scope-definition\   intent-backlog.md  scope-document.md  [...]
        team-formation\     mob-composition.md  skill-matrix.md  team-assessment.md  [...]
      inception\
        reverse-engineering\memory.md
        practices-discovery\memory.md
        [...]
      verification\phase-check-ideation.md
  prior-auth-api\        seed commit 936b5eb
    AGENTS.md  CLAUDE.md  README.md  docs\decisions.md
    src\determination\  auth-status.enum.ts  determination.entity.ts
                        determination.service.ts  determination.service.spec.ts
    src\domain\         auth-request.entity.ts  clinical-criteria.ts
                        member.entity.ts  provider.entity.ts
  prior-auth-web\        seed commit ce2477d
    AGENTS.md  CLAUDE.md  README.md  docs\decisions.md
    src\App.tsx  src\components\AuthQueue.tsx  src\components\StatusBadge.tsx
    src\data\sample.ts  src\domain\auth.ts  [...]
  prior-auth-notify\     seed commit 5340d84
    AGENTS.md  CLAUDE.md  README.md  docs\decisions.md  src\index.ts  [...]
```

### The commands, as typed

Nothing new is typed to start the scans. The approval of Approval & Handoff moved the engine into
Inception by itself:

```text
# Claude Code
1. Approve. The brief and the decision log match what the room decided. The PO signs the brief. Compliance signs off the CMS-0057-F reading. [...] No recorded rule changes (api D-001/D-002/D-003, web D-001/D-002). Close ideation and go on to Reverse Engineering. The PO will create the Rally Feature by hand from the brief. (PO, sponsor; compliance lead)
```

At the "anything to add for next time?" prompt after the scans (turn 037-mob), and again after
Practices Discovery (turn 041-mob), the reply was just:

```text
# Claude Code
1
```

The Reverse Engineering gate, with each repo lead signing for their own scan (turn 038-re-approve):

```text
# Claude Code
Approve. api lead: prior-auth-api codekb is accurate: no HTTP layer claimed, D-001/D-002/D-003 cited, F-05 re-score and F-07 overloaded PENDING recorded. web lead: prior-auth-web api-documentation correctly says the app calls nothing yet and reads static SAMPLE_QUEUE. notify lead: notify codekb keeps committed-not-built separate from what exists. (api lead, web lead, notify lead)
```

The 13 Practices Discovery answers, edited into the file and then sent with `done` (turn 039-mob, trimmed):

```text
# Claude Code
Q1: A. Squash-merge. That's the org default, and it gives one commit per unit on each repo's main (Tech lead)
Q2: X. Nothing is pushed in this practice run. Approved units merge to local main only, and pushing to remotes is a later decision outside this intent (Tech lead)
Q3: B. The full verify gate plus one test through the real entry point: store an urgent request, then read it back with urgency. Tests and typecheck alone don't prove the real path (Tech lead + QA lead)
Q4: A. Tests first in all three repos, as each repo's AGENTS.md requires. The failing run is recorded in each unit's code-generation summary (Tech lead)
[...]
Q12: A. Inside the owning repo, a bare `// (D-001)`. From another repo, `// (prior-auth-api D-003)` (Tech lead)
Q13: A, B, C, D, E, F, G, H. All of them: they protect the recorded decisions (api D-003, web D-001), privacy and the decision logs (Tech lead + compliance)

done
```

Confirming the summary (turn 040-mob), then approving the practices (turn 042-mob, trimmed):

```text
# Claude Code
1. Looks correct. This matches the practices the room promoted: TypeScript strict, D-ids cited in code, plan before code, one unit = one repo, consumers pin the contract copy and never import api source, and local-only with nothing pushed. Go ahead and generate the artifacts. (Tech lead)
```

```text
# Claude Code
1 — Approve. Both files match what the room affirmed: TypeScript strict in all three repos; snake_case sentence test names; D-id citations in code (`// (D-001)` inside the owning repo, repo-qualified from another repo); a numbered plan and a human stop before any code; one unit = one repo; consumers pin contract v1.1.0 from `prior-auth-api/contracts/` and never import sibling source (Tech lead). [...]
```

The audit trail records both gates (`audit\varalaptop-d3e03ad83f38.md`):

```text
**Timestamp**: 2026-10-11T10:56:17Z
**Event**: GATE_APPROVED
**Stage**: reverse-engineering
**User Input**: Approve
[...]
**Timestamp**: 2026-10-11T11:17:15Z
**Event**: GATE_APPROVED
**Stage**: practices-discovery
**User Input**: Approve
```

<!-- not captured: the developer/architect subagent calls themselves; the turn JSON kept only the final result -->

### What the engine showed

The scan summary arrived as one message covering all three repos (turn 036-mob):

```text
# 🔍 Reverse Engineering Complete

All three repos now have a code knowledge base. Each is a full first scan of what people wrote; AI-DLC's own files and dependency folders were left out.

| Repo | Knowledge base | What the scan found |
|------|----------------|---------------------|
| prior-auth-api | `aidlc/spaces/default/codekb/prior-auth-api/` (9 files) | Domain types and the determination rules (D-001, D-002) only. No time, urgency, deadline, queue, events, web layer or storage, and no `contracts/` folder yet. 9 components, findings F-01 to F-15. |
| prior-auth-notify | `aidlc/spaces/default/codekb/prior-auth-notify/` (9 files) | A placeholder service. What its steering files commit it to is listed separately as "committed, not built". Findings F-01 to F-11. |
| prior-auth-web | `aidlc/spaces/default/codekb/prior-auth-web/` (9 files) | A static queue table over sample rows, with no API call, sorting, urgency or due field, and a date-only "submitted". 7 components, findings F-01 to F-09. |
[...]
- **Status drift in prior-auth-web.** The web repo declares a `PENDING_NURSE_REVIEW` status and cites a "D-004" that the API doesn't have. [...] The scan also found a web test (`renders_nurse_review_identically_to_pending_TODAY`) that locks in today's look; U3 will have to flip or replace it.
[...]
- **Tests first or tests after.** All three repos' AGENTS.md require tests first, while the workspace default is test-after. Practices Discovery, the next stage, is where the team settles this.
- **Coverage floor can't be enforced yet.** None of the repos has a coverage tool, a linter or CI, so the 80% enterprise coverage floor isn't enforceable yet.
- **Test baselines.** prior-auth-notify passes (no tests yet), and prior-auth-web passes 5/5 with a clean typecheck. prior-auth-api's tests and typecheck could not be run during the scan, so they still need running before Code Generation.
```

The Reverse Engineering gate offered only Approve or Request Changes, and pointed reviewers at two
files per repo (turn 037-mob):

```text
Worth checking:

- **`code-quality-assessment.md` in each repo.** Each lists that repo's findings, and the prior-auth-api one covers the gaps U1 has to fill.
- **`architecture.md` in each repo.** The interaction diagrams show how things work today and mark what is committed but not yet built.
[...]
Reverse Engineering complete. How would you like to proceed?

1. Approve: continue to Practices Discovery
2. Request Changes: give revision feedback
3. Other
```

Practices Discovery opened with the inspectors' result and the question file (turn 038-re-approve):

```text
The release engineer drafted the team's practices from the three repos, and the quality engineer, developer and security engineer each reviewed that draft on their own. They agree on most of it: tests first, as every repo's AGENTS.md already says, and the existing naming and test conventions. The questions are only the team choices the code can't answer.

I wrote 13 questions to `aidlc/spaces/default/intents/261011-urgent-auth-clock/inception/practices-discovery/practices-discovery-questions.md`:
[...]
- **Thin end-to-end slice first (Q3):** what proves U1's walking skeleton works. [...] The quality engineer objected that tests plus a type check alone don't prove the skeleton's real path.
```

One full question from that file, with its options and the room's answer
(`practices-discovery-questions.md`):

```text
### Q3. What proves U1's walking skeleton works before the checkpoint?

Context: a walking skeleton is a minimal version that runs the whole way through, built first to prove the pieces connect before the real features go in. For U1 it means urgency is stored on a request and returned. The quality engineer objected that tests plus a type check alone don't prove the skeleton's real path.

A. `npm test` and `npm run typecheck` in prior-auth-api
B. The repo's full pre-merge gate (see Q6), plus a test that goes through the skeleton's real entry point: store an urgent request, read it back
C. Not yet defined
X. Other (please specify)

[Answer]: B. The full verify gate plus one test through the real entry point: store an urgent request, then read it back with urgency. Tests and typecheck alone don't prove the real path (Tech lead + QA lead)
```

The objection behind Q3 came from the quality inspector's independent review
(`contributions\aidlc-quality-agent.md`, "Positions"):

```text
- OBJECT: `npm test` plus `npm run typecheck` as the likely skeleton verification; it skips the coverage floor and need not touch the skeleton's real path, so the verification command should be the repo's full gate plus a test through the skeleton's real entry point.
```

After generation, the engine listed what it wrote and the open points it was not settling
(turn 040-mob):

```text
# 🧭 Practices Discovery Complete

| Artifact | Contents |
|----------|----------|
| team-practices.md | The five practice areas in team voice: way of working, walking skeleton, testing posture (Methodology: tdd), deployment, code style |
| discovered-rules.md | 10 ALWAYS rules and 7 NEVER rules, all stated by people: the eight you picked in Q13, plus the repos' own steering, refined by your answers. None duplicates an existing project rule. |
| evidence.md | What the release engineer and each reviewer inspected, your 13 decisions and who made each, how all 10 objections were resolved, and the remaining uncertainties |
| practices-discovery-timestamp.md | `Discovered: 2026-10-11T11:12:39Z at commit 62ecbfa…` |
| contributions/ | The quality engineer's, developer's and security engineer's independent reviews |

If you approve, these practices are saved to the team's rules: the five areas replace the empty sections in `aidlc/spaces/default/memory/team.md`, and the ALWAYS/NEVER rules are added to `aidlc/spaces/default/memory/project.md`. From then on they apply to every stage and unit.
```

The Practices Discovery gate (turn 041-mob):

```text
Please read two files before you approve:

- `team-practices.md`, which becomes the team's standing practices
- `discovered-rules.md`, the 10 ALWAYS and 7 NEVER rules

Approving saves them into the team's and project's rules, which every later stage and unit then follows. After that comes Requirements Analysis, where the product manager turns everything approved so far into testable requirements.

Practices Discovery complete. How would you like to proceed?

1. Approve: save these practices to the team's rules and continue to Requirements Analysis
2. Request Changes: give revision feedback
3. Other
```

### The workspace after this step

```text
aidlc\spaces\default\
  codekb\
    prior-auth-api\       9 files, 926 lines
      api-documentation.md  architecture.md  business-overview.md
      code-quality-assessment.md  code-structure.md  component-inventory.md
      dependencies.md  reverse-engineering-timestamp.md  technology-stack.md
    prior-auth-notify\    9 files, 587 lines (same nine names)
    prior-auth-web\       9 files, 826 lines (same nine names)
  memory\
    project.md            +34 lines: 10 ALWAYS, 7 NEVER rules
    team.md               +192 / -14 lines: the five practice areas replace empty sections
  intents\261011-urgent-auth-clock\inception\
    reverse-engineering\
      developer-scan-prior-auth-api.md
      developer-scan-prior-auth-notify.md
      developer-scan-prior-auth-web.md
    practices-discovery\
      practices-discovery-questions.md  team-practices.md  discovered-rules.md
      evidence.md  practices-discovery-timestamp.md
      contributions\  aidlc-developer-agent.md  aidlc-devsecops-agent.md  aidlc-quality-agent.md
```

The most important file for the api lead is `codekb\prior-auth-api\api-documentation.md`. It
says what is missing instead of inventing it:

```text
| Surface | Status | Count |
|---|---|---|
| HTTP/REST endpoints | Not implemented | 0 |
| Published contract (`prior-auth-api/contracts/`) | Absent (folder does not exist on disk or in git) | 0 |
| Events / messages | Not implemented | 0 |
| Internal programmatic API | Implemented | 1 method |
| Exported types and constants | Implemented | 8 |

## External APIs

### HTTP/REST

None. `AGENTS.md` names three API resources, `auth-requests`, `members` and `determinations`,
but there is no router, controller, HTTP framework, OpenAPI document or request handler in
the repo. These names are documented intent only.
```

The greenfield repo's `business-overview.md` keeps commitments apart from code:

```text
**No business functionality is implemented.** Everything below under "Committed Functionality" is what the steering commits the service to, not behaviour that exists. [...]

## Committed Functionality (not yet built)

| Capability | Trigger | Evidence |
|---|---|---|
| Send a determination notice to provider and member | Inbound event `determination.issued` | `AGENTS.md` L9-11 |
| Send an at-risk notice | Inbound event `sla.at-risk` | `AGENTS.md` L10 |
| Restrict every notice payload to `AuthStatus` + `referenceId` | Every notice | `AGENTS.md` L19-21; `docs/decisions.md` D-001 |
```

The timestamp file bounds the scan, which is what the card's "What did you NOT read?" experiment
surfaces (`codekb\prior-auth-api\reverse-engineering-timestamp.md`):

```text
- Commit: 936b5eb ("seed: prior-auth-api"; the repo's only commit; working tree clean at scan time)
- Breadth: full rescan (first scan; no prior store)
- Depth: Comprehensive
- Coverage: every tracked file was read in full except `package-lock.json`, which was read only
  for the resolved versions of the four direct devDependencies. [...]
- Not verified in this run: `npm test` and `npm run typecheck` were not executed; the README's
  "4 passing" and clean-typecheck claims are unverified.
```

The promotion, as a diff of the hub's `memory\project.md` against its last commit (62ecbfa, made
before the run). Read-only command, PowerShell:

```text
git -C D:\aidlc-practice\prior-auth-workspace diff HEAD -- aidlc/spaces/default/memory/project.md
```

```text
+NEVER compute or derive the decision clock (`decisionDueAt`) outside `prior-auth-api`; consumers display the value they receive (`prior-auth-notify/AGENTS.md`, "One clock, one owner") (affirmed 2026-10-11)
+
+NEVER show member name, clinical content, criteria detail or scores on any `prior-auth-web` queue or list row, and never add a field to `AuthRequestSummary` without a recorded web decision; the reference id is the identifier there (prior-auth-web D-001) (affirmed 2026-10-11)
[...]
 ## Mandated
[...]
+ALWAYS write the failing test first and show it failing for the right reason before writing the code that makes it pass (all three repos' `AGENTS.md`, loop step 2; affirmed in Q4 by the tech lead) (affirmed 2026-10-11)
+
+ALWAYS run the changed repo's gates and show the runner's real output, `npm test` and `npm run typecheck` while developing and the full `npm run verify` before merge, reporting a step that cannot run as "not run", never as passed (all three repos' `AGENTS.md`, loop step 3; affirmed in Q6 by the tech lead and compliance) (affirmed 2026-10-11)
[...]
```

Every rule names where it came from: a repo's steering file, a D-id, or the question that affirmed
it. That is what lets a later plan cite it.
