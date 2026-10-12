# Walkthrough 02

## Background

You don't create an intent by hand. Describing the work creates one. This step takes one
paragraph of intent and turns it into an approved **initiative brief**, the go/no-go for
Inception. On the way you meet the rhythm every later stage repeats.

### Initialization: three stages, no gates

When you type `/aidlc` with a description, Phase 0 runs on its own:

| Stage | What it does |
|---|---|
| 0.1 Workspace scaffold | Makes the intent folder `aidlc\spaces\default\intents\<yymmdd>-<slug>\` with one folder per phase, plus `verification\` and `audit\` |
| 0.2 Workspace detection | Scans the hub: languages, frameworks, build system, brownfield or greenfield, and the sibling repos |
| 0.3 State init | Writes `aidlc-state.md` and adds a row to `intents.json`, including the repo list |

Nobody approves these. The first human moment is the first question file.

### Scope: say it out loud

Scope decides which of the 33 stages run and how deep each goes. With no `--scope`,
AI-DLC v2.11 uses **classic**, which skips Ideation and Operation. This feature needs both.

| Scope | Stages | Fit for this feature |
|---|---|---|
| enterprise | 33, comprehensive depth, strict guard policy | Chosen: PHI, a regulatory deadline, three deployables, and Operation stages you'll need (SLO, alarms, rollback) |
| feature | 33, standard depth | Fine if compliance doesn't need comprehensive artifacts; a faster first pass |
| classic | 18, v1-style; no Ideation, no Operation | Loses the deploy and observe stages the deadline depends on |

Choosing the scope is a team decision. You can change it mid-run with `/aidlc --scope <name>`.

### The stage rhythm

Every Ideation stage, and nearly every stage after it, goes the same way:

1. **Questions in a file.** The engine writes `<stage>-questions.md` with multiple-choice
   questions, each ending in an `[Answer]:` tag, and a *Sources* list at the top citing your
   description and your `memory\` rules. You choose how to answer: guide me (in chat), I'll
   edit the file, or chat and let the engine extract decisions.
2. **Follow-ups.** If an answer opens a new question, or collides with a recorded rule, the
   engine adds Q12, Q13 and so on. That is the method working, not a loop.
3. **Summary confirmation.** Before writing anything, it restates every answer and asks
   *Looks correct* or *Request changes*. Read it as carefully as the documents; it is what
   they are built from.
4. **Artifacts.** Every statement carries a source tag: `[Q4]`, `[desc]`, `[memory:M2]`.
5. **AI review.** At enterprise scope a reviewer agent (here, a product lead) raises
   numbered findings, and the engine gives its own view of each.
6. **The gate.** `Approve`, or `Request Changes: <what and why>`. New facts you give at the
   gate become new numbered answers, so the revised documents can cite them.

The decisions do not live in chat. The question file holds the answers, and
`audit\<host>-<clone>.md` records every human turn and every gate decision.

### The rest of Ideation

| Stage | Slug | Output in the reference run |
|---|---|---|
| 1.1 Intent Capture & Framing | `intent-capture` | `intent-statement.md`, `stakeholder-map.md` |
| 1.2 Market Research | `market-research` | Skipped at the engine's suggestion: build, not buy |
| 1.3 Feasibility & Constraints | `feasibility` | `feasibility-assessment.md`, `constraint-register.md`, `raid-log.md` |
| 1.4 Scope Definition | `scope-definition` | `scope-document.md`, `intent-backlog.md` |
| 1.5 Team Formation | `team-formation` | `team-assessment.md`, `skill-matrix.md`, `mob-composition.md` |
| 1.6 Rough Mockups | `rough-mockups` | `user-flow.md`, `wireframes.md` |
| 1.7 Approval & Handoff | `approval-handoff` | `initiative-brief.md`, `decision-log.md`, then `verification\phase-check-ideation.md` |

After 1.7 is approved, a human creates the Rally **Feature** from the brief. AI-DLC does
not talk to Rally.

## In the reference workspace

### The workspace before this step

The hub from step 01, with no intent yet:

```text
prior-auth-workspace\
├── .claude\
├── .gitignore
├── aidlc.code-workspace
├── repos.json
├── aidlc\spaces\default\memory\   org.md  team.md  project.md  phases\  templates\
├── prior-auth-api\
├── prior-auth-web\
└── prior-auth-notify\
```

### The commands, as typed

The reference run drove Claude Code headless, one turn per `claude -p` call, so each turn
could be logged. The first turn sends the same text you would type at the `claude` prompt:

```powershell
# Claude Code
$intent = 'Urgent prior auth requests get a 72-hour determination clock: urgent requests jump the nurse review queue, providers and members are notified when a determination exists, and an at-risk alert fires before the clock runs out. Spans prior-auth-api, prior-auth-web and a new prior-auth-notify service.'
$prompt = "/aidlc --scope enterprise $intent"
$out = claude -p $prompt --output-format json --permission-mode acceptEdits --allowedTools "Bash(aidlc:*)" "Bash(git:*)" "Bash(npm:*)" "Bash(npx:*)" "Bash(bun:*)" "Bash(ls:*)" "Bash(cat:*)" 2>&1
```

The first lines of what came back, before the JSON:

```text
Ignoring 45 permissions.allow entries from .claude/settings.json: this workspace has not been trusted. Run Claude Code interactively here once and accept the trust dialog, [...]
```

That is the card's "headless `claude -p` ignores the project's permissions" snag. Open
`claude` interactively in the hub once and accept the trust dialog first.

Interactively, the whole step is typed replies: `2` to pick "I'll edit the file", `done`
after saving answers, `1` for *Looks correct*, and `Approve` or `Request Changes: ...` at
each gate.

### What the engine showed

After Initialization, the first message lists the questions and asks how you want to
answer (turn 001-start):

```text
I've read the three repos' decision logs and drafted the framing questions for this initiative.

I wrote 11 questions to `aidlc/spaces/default/intents/261011-urgent-auth-clock/ideation/intent-capture/intent-capture-questions.md`. [...]

The decision logs show three questions nobody has answered yet: notification channels, re-scoring after a determination exists, and the default nurse view. Q11 asks whether the first two are out of scope. None of the existing rules change: the 0.85 auto-approve threshold (prior-auth-api D-001) stays, and notices still carry status and referenceId only (prior-auth-api D-003).

How would you like to answer the questions?

1. Guide me: we go through each question here
2. I'll edit the file: you fill in the answers in the file directly
3. Chat: we talk it through and I pull the decisions out of the conversation
4. Other
```

The room answered in the file. One answer brought standard requests in, so the engine
added Q12; the next answer then collided with a recorded rule, and it stopped to ask Q13
(turn 003-ic-q12):

```text
Your answer didn't reach AI-DLC. Please give it once more. If it happens again, type /aidlc --doctor.
[...]
In Q12 you said the at-risk alert should carry whether the request is urgent. That conflicts with a recorded rule: notices and event payloads carry status and referenceId only (prior-auth-api D-003, decided with privacy office review). Urgency isn't clinical content, but it is an extra field, and recorded rules can't be changed in this workflow. The choices are:

1. The alert carries status and referenceId only. The assigned nurse and supervisor see the urgency when they open the request on the authenticated screen.
2. Keep urgency in the alert and take it to the privacy office. It stays an open question until they rule.
3. Treat the alert as internal to nurses, so the rule doesn't apply to it. Ask the privacy office to confirm, and keep it as an open question until they do.
4. Not yet defined.
5. Other.
```

With every question answered, the summary to confirm before anything is written (turn
004-ic-q13):

```text
**Stage:** Intent Capture & Framing
**Confirming:** Consolidated answers in `aidlc/spaces/default/intents/261011-urgent-auth-clock/ideation/intent-capture/intent-capture-questions.md` before generating [...] `intent-statement.md`, [...] `stakeholder-map.md`, [...]
**Why now:** All stage questions are answered; artifact generation will use this confirmed summary.
[...]
- **Problem and trigger:** CMS-0057-F requires urgent (expedited) decisions within 72 hours from January 1, 2026, for Medicare Advantage, Medicaid and exchange lines. Compliance owns the exact reading (Q1, Q6).
- **Urgency:** the provider marks a request URGENT at submission and v1 takes it as-is. There is no nurse downgrade in v1 (Q2).
- **Clock start:** the clock starts when the request is complete. An incomplete urgent request shows "clock not started", and the provider is told what is missing (Q3).
[...]
1. Looks correct: generate the intent statement and stakeholder map from these answers
2. Request changes: revise one or more answers before anything is generated
3. Other
```

The gate, with the product-lead reviewer's findings on the table and the engine's own
view under them (turn 008-ic-learn):

```text
**Stage:** Intent Capture & Framing
**Review outcome:** Concerns remain for your decision.
[...]
| ID | Severity | Where | Status |
|---|---|---|---|
| R-01 | Major | intent-statement.md > Problem Statement, thir... | New |
| R-02 | Major | intent-statement.md > "## Assumptions & Open... | New |
| R-03 | Major | intent-statement.md > Success Metrics | New |
| R-04 | Minor | intent-statement.md > Initiative Trigger | New |
| R-05 | Minor | intent-statement.md > Key Facts Confirmed and... | New |
| R-06 | Minor | stakeholder-map.md > Decision-Makers vs. Infl... | New |

> R-03 Finding: Standard requests are in scope with a 7-calendar-day due date, notices and an at-risk alert, but both metrics cover urgent requests only. [...] The metrics also start at "request becoming complete", so a request stuck at "clock not started" is never measured [...]
[...]
I think the review got R-01 and R-02 right. R-01 is a sentence I wrote that your answers don't support. For R-02, I put the privacy office item under open decisions instead of the open-questions section. R-03 and R-04 need facts only you have: whether standard requests and "clock not started" are measured, and where compliance stands now that the rule is in effect.

Intent Capture & Framing complete. How would you like to proceed?

1. Approve: continue to Market Research, with the open findings accepted
2. Request Changes: tell me which findings to fix, and I'll revise and have it checked again
3. Other
```

The room replied `Request Changes` with the missing facts. The engine turned them into
answers before touching the documents (turn 009-ic-changes):

```text
I've recorded your change request. The new facts you gave (the alert fallback, the standard-request target, how "clock not started" requests are tracked, and the unknown exposure) aren't in your earlier answers. So I've added them as four follow-up answers, Q16 to Q19, in your words, so the revised documents can cite them. Since that adds to the summary you confirmed, it needs one more confirmation before I edit the documents.
```

On the second review all six findings came back resolved (turn 011-mob):

```text
**Review outcome:** 6 findings marked fixed by the reviewer.
**Why now:** Revision re-checked.
[...]
> R-03 Reviewer note: Success Metrics now cover standard determinations (100% within 7 calendar days), the 1-business-day provider notice of what is missing, and a weekly by-age report on requests at "clock not started" (Q17).
```

At 1.2, the engine checked whether the stage applied before writing questions (turn
012-mob):

```text
Before I write questions for Market Research, I want to check that it applies here. This stage is meant for work that has a market position to win or a real build-versus-buy choice, and it is normally skipped for internal capabilities.
[...]
1. Skip Market Research: record that it doesn't apply, for the reasons above, and move on to Feasibility & Constraints
2. Run Market Research: write the questions, including a buy-versus-build look at commercial options
3. Other
```

Stages 1.3 to 1.6 followed the same rhythm. The last gate, 1.7 (turn 035-mob):

```text
Approval & Handoff is ready for your review. What it produced is in `aidlc/spaces/default/intents/261011-urgent-auth-clock/ideation/approval-handoff/`.

**Review:** `aidlc/spaces/default/intents/261011-urgent-auth-clock/ideation/approval-handoff/`, plus `aidlc/spaces/default/intents/261011-urgent-auth-clock/verification/phase-check-ideation.md`
[...]
If you approve, ideation closes and Inception starts with Reverse Engineering. [...]

1. Approve: close ideation and continue to Reverse Engineering
2. Request Changes: give revision feedback
3. Reject Initiative: end the workflow here
4. Other
```

### The workspace after this step

Right after the first turn, Initialization had made the record and the first question file
(listing taken by the run at that moment):

```text
aidlc/spaces/default/intents/261011-urgent-auth-clock:
aidlc-state.md
audit/
construction/
ideation/
inception/
initialization/
operation/
project-description.json
verification/

aidlc/spaces/default/intents/261011-urgent-auth-clock/audit:
varalaptop-d3e03ad83f38.md
[...]
aidlc/spaces/default/intents/261011-urgent-auth-clock/ideation/intent-capture:
intent-capture-questions.md
memory.md
```

By the 1.7 gate, Ideation held:

```text
aidlc\spaces\default\intents\
├── intents.json
└── 261011-urgent-auth-clock\
    ├── aidlc-state.md
    ├── audit\varalaptop-d3e03ad83f38.md
    ├── ideation\
    │   ├── intent-capture\     intent-capture-questions.md  intent-statement.md
    │   │                       stakeholder-map.md  memory.md  reviews\review-01.md  review-02.md
    │   ├── market-research\    memory.md   (stage skipped)
    │   ├── feasibility\        feasibility-questions.md  feasibility-assessment.md
    │   │                       constraint-register.md  raid-log.md  memory.md
    │   ├── scope-definition\   scope-definition-questions.md  scope-document.md
    │   │                       intent-backlog.md  memory.md
    │   ├── team-formation\     team-formation-questions.md  team-assessment.md
    │   │                       skill-matrix.md  mob-composition.md  memory.md
    │   ├── rough-mockups\      rough-mockups-questions.md  user-flow.md  wireframes.md
    │   │                       memory.md  reviews\review-01.md  review-02.md
    │   └── approval-handoff\   approval-handoff-questions.md  initiative-brief.md
    │                           decision-log.md  memory.md
    └── verification\phase-check-ideation.md
```

There is no build-vs-buy file: Market Research was skipped, and the brief records the
build decision instead.

**The registry row.** Nobody typed `--repos`; the engine found the siblings on disk:

```text
[
  {
    "uuid": "01a12a2d-ed32-7437-a30e-3daa507f0eb2",
    "slug": "urgent-auth-clock",
    "dirName": "261011-urgent-auth-clock",
    "scope": "enterprise",
    "repos": [
      "prior-auth-api",
      "prior-auth-notify",
      "prior-auth-web"
    ],
    "status": "in-flight",
    "request": "411f3e5c"
  }
]
```

**A question file, as answered.** The top of `intent-capture-questions.md`, then two
questions. M1 and M2 are the hub rules you pasted in step 01:

```text
# Intent Capture & Framing — Questions

## Sources

- [desc] Initial description: "Urgent prior auth requests get a 72-hour determination clock: [...]"
- [scope] Workflow-selected scope: `enterprise`.
- [memory:M1] `aidlc/spaces/default/memory/project.md#Forbidden`: "NEVER change a rule recorded in a repo's docs/decisions.md (e.g. prior-auth-api D-001: a criteria score >= 0.85 auto-approves); raise it as a question at the gate instead (affirmed by the tech lead at workspace setup)"
- [memory:M2] `aidlc/spaces/default/memory/project.md#Forbidden`: "NEVER put clinical content, criteria detail or scores in a notification or event payload; status and referenceId only (prior-auth-api D-003) (affirmed by the tech lead at workspace setup)"
[...]

## Q3. When does the 72-hour clock start?

Context: an at-risk alert "before the clock runs out" only works if everyone agrees when the clock started.

A. When the request is first received, even if information is missing
B. When the request is complete (all required information received)
C. When the request is received, but the clock pauses while waiting for information from the provider
D. Not yet defined
E. Not applicable
X. Other (please specify)

[Answer]: B. The clock starts when the request is complete (all required documentation received). An incomplete urgent request shows "clock not started" and the provider is told what is missing. (UM director, confirmed by compliance)

[...]

## Q16. If the privacy office does not confirm compliance's reading of the alert rule, what does the at-risk alert carry?

Context: raised at the approval gate (review finding R-02).

A. referenceId and status only; the nurse sees the urgency on the authenticated screen
B. The alert is held until the privacy office rules
C. Not yet defined
X. Other (please specify)

[Answer]: A. Fallback if privacy declines: the alert carries referenceId and status only and urgency is seen on the authenticated screen. This is compliance's position until the privacy office confirms. (Compliance lead)
```

**The statement it built.** Every row cites its answer (`intent-statement.md`, Success
Metrics, after the revision):

```text
| Metric | Target | Source |
|--------|--------|--------|
| Urgent determinations issued within 72 hours of the request becoming complete | 100% | [Q5] |
| Urgent requests that miss the 72-hour deadline | Zero per month | [Q5] |
| Standard determinations issued within 7 calendar days of the request becoming complete | 100% | [Q17] |
| Provider told what is missing from an incomplete request | Within 1 business day | [Q17] |
| Requests waiting at "clock not started", reported by age to the UM director | Every week | [Q17] |
```

**The gate, in the audit shard.** The rejection and the later approval of 1.1:

```text
## Gate Rejected
**Timestamp**: 2026-10-11T09:09:43Z
**Event**: GATE_REJECTED
**Stage**: intent-capture
**Feedback**: Request Changes: fix R-01 and R-02 as the reviewer says [...]
[...]
## Gate Approved
**Timestamp**: 2026-10-11T09:24:42Z
**Event**: GATE_APPROVED
**Stage**: intent-capture
**User Input**: Approve
```

**The state file.** The shape of `aidlc-state.md`. This copy was read on 2026-10-12, in
Construction, so Ideation and Inception already show as completed. Watch the checkbox for
the current stage move as you reply; the legend in the file explains each state.

```text
## Project Information
[...]
- **Project Type**: Brownfield
- **Project Type Source**: workspace scan
- **Scope**: enterprise
- **Start Date**: 2026-10-11T08:56:55Z
[...]
## Scope Configuration
- **Stages to Execute**: 0.1, 0.2, 0.3, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 2.1, 2.2, [...] 4.6, 4.7
- **Stages to Skip**: none
- **Depth**: Comprehensive
- **Test Strategy**: Comprehensive
[...]
- **Guard Policy**: strict (from scope enterprise)
[...]
- **Summary Confirmation**: on (from scope enterprise)
- **Plan Approval**: on (from scope enterprise)
[...]
## Stage Progress
<!-- Checkbox states: [ ] not started, [-] in progress, [?] awaiting approval (gate open), [R] revising (user rejected gate), [x] completed, [S] skipped via --stage/--phase jump -->

### INITIALIZATION PHASE
- [x] workspace-scaffold — EXECUTE
- [x] workspace-detection — EXECUTE
- [x] state-init — EXECUTE

### IDEATION PHASE
- [x] intent-capture — EXECUTE
- [S] market-research — EXECUTE
- [x] feasibility — EXECUTE
- [x] scope-definition — EXECUTE
- [x] team-formation — EXECUTE
- [x] rough-mockups — EXECUTE
- [x] approval-handoff — EXECUTE
[...]
## Current Status
- **Lifecycle Phase**: CONSTRUCTION
- **Current Stage**: functional-design
[...]
```

<!-- not captured: aidlc-state.md as it stood during step 02 (the hub's record was not committed between turns); the copy above is from 2026-10-12 -->
