# Lab M38 — Take the re-score through Inception

> Module: M38 — Inception on the Engine
> Audience: practitioner · Estimated time: 35 min reading · about 2 h with the engine
> Domain: Prior Auth Portal (`AuthRequest`, `ClinicalCriteria`, `AuthStatus`,
> `AUTO_APPROVE_THRESHOLD`; repos `prior-auth-api` and `prior-auth-web`)
> Verified against aidlc v2.11.0 (Claude Code 2.1.301) on 2026-10-16. Every excerpt is from one
> real run in the reference hub (`D:\aidlc-track8\prior-auth-workspace`, record commit `c03b800`),
> resuming the intent M37 parked. Every answer and gate reply was typed by the course author acting
> as the portal team. Codex wasn't run for this edition; it reads the same stage files.

## Path A — Understand It (no tooling required)

**Artifact:** four excerpts from the reference run.

The team's answer to Requirements Q1, in `requirements-analysis-questions.md`:

```text
## Q1. Which waiting statuses does the first version re-score, given the PENDING_NURSE_REVIEW mismatch?
A. Re-score PENDING only in this version; PENDING_NURSE_REVIEW joins the re-score once the API actually has it, through its own recorded decision
[...]
[Answer]: A — PENDING only in this version; the tech lead corrects the web AGENTS.md claim about D-004
```

Where it landed in `requirements.md`, with the line on status changes:

```text
- A2 "Waiting" means status PENDING in this version. PENDING_NURSE_REVIEW joins the re-score only once the API has it, through its own decision. Reason: Q1. [Q1]
| OQ2 | Is PENDING_NURSE_REVIEW in the API or not? Also correct the web AGENTS.md claim about D-004 | Tech lead | Widening A2 | [Q1] |

## Out of Scope
- A re-score changing a request's status, for example auto-approving at 0.85 or above. This waits for the medical director. [IC-Q4] [SD-Q5]
```

The units, from `unit-of-work-dependency.md`, and the first bolt from `bolt-plan.md`:

```text
units:
  - name: u1-api-skeleton
    kind: service
    depends_on: []
  - name: u2-rescore-run-hardening
    kind: service
    depends_on: [u1-api-skeleton]
  - name: u3-scorer-switch
    kind: service
    depends_on: [u1-api-skeleton]
  - name: u4-api-access
    kind: service
    depends_on: [u1-api-skeleton]
  - name: u5-web-detail-view
    kind: ui
    depends_on: [u1-api-skeleton, u4-api-access]

| B1 | b1-api-skeleton | U1 u1-api-skeleton | prior-auth-api | Yes | OQ6, requirements update |
```

**Trace it:**
1. Follow the team's Q1 answer into `requirements.md`. Compare A2 and OQ2 with what the team wrote.
2. Find where the status-change decision appears, and who owns it.
3. Read the `units:` block and find the unit with no dependencies.
4. Compare it with the first bolt in `bolt-plan.md`.
5. Using fig 38.1 in the module, sort the stages into `ALWAYS` and `CONDITIONAL`.

**Check yourself:**
1. Does A2 say what the team said, no more and no less? Where would a drift show up first, and who
   catches it?
2. Which unit does the engine build first, and why doesn't `bolt-plan.md` decide that?
3. Whether a re-score may change a status belongs to the medical director. Where does that appear in
   the artifacts, and where must it never appear?
4. Of the stages in fig 38.1, which could a scope have dropped, and which could it not?

<details><summary>Answers</summary>

1. Yes. A2 states the rule, and OQ2 carries the tech lead's correction with an owner. A drift shows
   first in the summary confirmation, before the artifact is written. The team catches it there, or
   at the gate, where the product-lead reviewer's findings sit beside the artifact.
2. U1: it's the only unit with no dependencies. The engine reads the DAG. `bolt-plan.md` records why
   the team wants that order, and "reordering only `bolt-plan.md` does not change the Unit the engine
   builds first".
3. Under Out of Scope, waiting for the medical director, and as an open item with an owner. It must
   never appear as a requirement or an acceptance criterion the agent filled in.
4. Scope Definition, Approval Handoff, Requirements, Units Generation and Delivery Planning are
   `ALWAYS`. Market Research, Reverse Engineering, User Stories, Domain Design and Contract Design
   are `CONDITIONAL`; M37's recompose could have dropped any of them that hadn't started, and it
   dropped Practices Discovery and Refined Mockups.

</details>

## Path B — Build It with AI

> The unit of work: **Inception completed for the running intent, every questions file answered by
> the team, parked before Construction, committed.** Start from your M37 hub with the intent parked
> at Market Research. Open the engine interactively at the hub root (`claude` or `codex`), because
> every stage needs a person. No code is written in this lab. The engine plans every stage and asks
> first; the human checkpoints are the questions files, each summary confirmation, the ten gates and
> the verification command.
>
> This is the course's longest engine run: ten gates, about two hours in the reference run. For two
> sittings, approve the Requirements gate, ask the engine to park, and come back with
> `/aidlc --resume` (`$aidlc --resume` in Codex).

### Claude Code variant (steps 1–5)

```text
# Claude Code
# 1. resume the parked intent
/aidlc --resume
# 2. at every stage: open the questions file together, fill every [Answer]:, then
> done
# 3. at every summary and gate: your own words
> Looks correct
> <Approve, or Request Changes with what to fix>
# 4. at User Stories only
> Bring the specialists in for this stage.
> Lead agent only from here.   (after its gate)
# 5. at Delivery Planning: approve the verification command only if it guards the 0.85 line
> Approve. Then park.
```

Expected, from the reference run (excerpts):

```text
# 1.
We're picking up at Market Research. You approved the shorter plan on 2026-10-15 and it
kept this stage, so I'm running it. [...]
I'll keep using the file to collect your answers, the way you chose earlier.

# Reverse Engineering
NO_STORE: no reverse-engineering-timestamp.md at aidlc/spaces/default/codekb/prior-auth-api/
- first scan, nothing to compare.

# Requirements, after done
I read your answers. They fit together, but Q4 ("these two repos are the whole system")
leaves two gaps I can't fill with a default. I added them as Q8 and Q9 [...]

# Delivery Planning
Use this command to verify each completed Unit?
1. Approve
2. Request Changes

Delivery Planning is approved and the workflow is parked. That completes Inception:
all seven stages are done.
```

What else happened in the reference run, in order:
- **Follow-ups.** Scope Definition added Q7 when two answers broke the success measure approved in
  M36; Requirements added Q8 and Q9 ("Working out how well a request meets a criteria version is
  clinical logic, not plumbing").
- **Reverse Engineering** scanned both repos in `repos.json`, nine `codekb` files each.
- **The agent mob.** "Bring the specialists in" ran `aidlc engine config set collaborators on`
  (`CEREMONY_SET` off→on). The design, developer and quality agents wrote
  `contributions/<agent>.md`; five judgment calls came to the team as Q6–Q10.
- **Guard Policy strict.** Answers given after a confirmed summary made the engine ask again: "Your
  answers to Q6-Q10 came after you confirmed the summary, so the summary needs confirming again."
- **Gates.** The team sent work back six times (Requirements twice, User Stories, Domain Design,
  Units Generation, Contract Design) before approving each stage.
- **Learning kept.** At Delivery Planning the team kept one learning, saved under Testing Posture in
  `memory/project.md` (`RULE_LEARNED`).

**Expected artifact:** the questions files with the team's answers; `codekb/<repo>/` for both repos;
`requirements.md`, `stories.md`, `components.md`, `unit-of-work.md`, `unit-of-work-dependency.md`,
`contract-summary.md`, `bolt-plan.md`, `verification-command.txt`; the intent parked at
`functional-design`.
**Verify:** step 6, then the checks under "Done when".

### Codex CLI variant (steps 1–5)

```text
# Codex CLI
# 1. resume the parked intent
$aidlc --resume
# 2. at every stage: open the questions file together, fill every [Answer]:, then
> done
# 3. at every summary and gate: your own words
> Looks correct
> <Approve, or Request Changes with what to fix>
# 4. at User Stories only
> Bring the specialists in for this stage.
> Lead agent only from here.   (after its gate)
# 5. at Delivery Planning: approve the verification command only if it guards the 0.85 line
> Approve. Then park.
```

Codex wasn't run for this edition, so there's no expected output to compare against. The questions,
follow-ups and review findings will differ from run to run. What must match is the shape: a
questions file per stage that waits for `done`, a summary to confirm, and a gate that records your
words.

**Expected artifact:** the same as the Claude Code variant.
**Verify:** step 6, then the checks under "Done when".

### Step 6 (both engines): commit

```powershell
git status --short
git add aidlc; git commit -m "intent: Inception approved, parked before Construction"
```

```text
 M aidlc/spaces/default/intents/261012-criteria-rescore/aidlc-state.md
 M aidlc/spaces/default/intents/261012-criteria-rescore/audit/varalaptop-9cf4488a9ce5.md
 M aidlc/spaces/default/memory/project.md
?? aidlc/spaces/default/codekb/
?? aidlc/spaces/default/intents/261012-criteria-rescore/ideation/approval-handoff/
?? aidlc/spaces/default/intents/261012-criteria-rescore/ideation/market-research/
?? aidlc/spaces/default/intents/261012-criteria-rescore/ideation/scope-definition/
?? aidlc/spaces/default/intents/261012-criteria-rescore/inception/
?? aidlc/spaces/default/intents/261012-criteria-rescore/verification-command.txt
?? aidlc/spaces/default/intents/261012-criteria-rescore/verification/
```

`memory/project.md` changed because the team kept one learning at Delivery Planning: "ALWAYS compare
guardrail files against a pinned pre-change commit, never against a moving `main`". The audit file
name ends in your machine's name, so yours will differ.

**Parity note:** the stages, questions files, gates and artifact paths come from the engine's stage
files, not from either harness, so both variants land on the same set of files under
`aidlc/spaces/default/`. The wording of questions, follow-ups and review findings varies from run to
run and from engine to engine. The answers and the approvals are the team's either way.

## Done when

Checks, from the hub root (PowerShell):

```powershell
$i = "aidlc\spaces\default\intents\261012-criteria-rescore"
(Get-ChildItem aidlc\spaces\default\codekb -Recurse -Filter *.md).Count     # 18 in the reference run (9 per repo)
Select-String -Path "$i\inception\units-generation\unit-of-work-dependency.md" -Pattern '^units:'
Test-Path "$i\inception\delivery-planning\bolt-plan.md"                     # True
(Select-String -Path "$i\audit\*.md" -Pattern 'GATE_APPROVED').Count       # 11: Intent Capture (M36) + these ten
```

- [ ] Every questions file holds the team's answers.
- [ ] `codekb/<repo>/` holds nine files per repo.
- [ ] `unit-of-work-dependency.md` has a `units:` block.
- [ ] `bolt-plan.md` exists.
- [ ] The audit shows a `GATE_APPROVED` for each of the ten stages.
- [ ] The hub commit holds it all, and the intent is left parked: M39 resumes it into Construction.
