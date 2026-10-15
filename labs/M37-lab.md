# Lab M37 — Size the re-score, then lock its guard

> Module: M37 — Scopes, Depth and the Composer
> Audience: practitioner · Estimated time: 25 min
> Domain: Prior Auth Portal (`AuthRequest`, `ClinicalCriteria`, `AUTO_APPROVE_THRESHOLD`; repos
> `prior-auth-api` and `prior-auth-web`)
> Verified against aidlc v2.11.0 (Claude Code 2.1.300) on 2026-10-15. Every excerpt is from one
> real run in the reference hub (`D:\aidlc-track8\prior-auth-workspace`, record commit `ba081a0`),
> resuming the intent M36 parked. The team's replies were typed by the course author acting as the
> portal team. Codex wasn't run for this edition; the settings it reads are the same files.

## Path A — Understand It (no tooling required)

**Artifact:** the engine's own scope table, its three Guard Policy modes, and four Prior Auth changes.

The scope table, printed by `aidlc engine gen scope-table` in the reference hub:

```text
| Scope          | Depth         | TestStrategy | EXECUTE / Total |
| bugfix         | Minimal       | (default)    | 9 / 33          |
| classic        | Standard      | (default)    | 18 / 33         |
| enterprise     | Comprehensive | (default)    | 33 / 33         |
| express        | Minimal       | (default)    | 10 / 33         |
| feature        | Standard      | (default)    | 33 / 33         |
| infra          | Standard      | (default)    | 13 / 33         |
| mvp            | Standard      | (default)    | 23 / 33         |
| poc            | Minimal       | (default)    | 8 / 33          |
| refactor       | Minimal       | (default)    | 10 / 33         |
| security-patch | Minimal       | (default)    | 10 / 33         |
| workshop       | Standard      | Minimal      | 26 / 33         |
```

Guard Policy defaults, from the scope files: `enterprise` is `strict`; the other ten are `off`.

The three modes, as the engine's source defines them:
- **strict:** an input that changed after a person approved something "is asked about once, naming
  what changed", and every fence holds.
- **relaxed:** a changed input is recorded, told to the person in one line, and the work continues.
  Plan approval and review freeze stand aside.
- **off:** as relaxed, and also lowers state transition and reviewer read scope.
- In every mode: human presence stays up, and no mode "removes a gate, alters a reviewer's verdict,
  deletes evidence, or lets an agent answer for the human". Any memory layer that declares `strict`
  "wins over both" the scope and the intent "and cannot be flipped from chat".

The changes, three of them from M10:

```text
T-101  Fix "elligible" → "eligible" in an outreach log message.
T-102  Set AUTO_APPROVE_THRESHOLD to 0.82 for imaging requests.
T-103  Implement the ClinicalCriteria scoring engine.
RI     The running intent: re-score pending AuthRequests when ClinicalCriteria change.
```

**Trace it:**
1. For each change, rate M10's five inputs: blast radius, reversibility, regulatory exposure,
   novelty, size.
2. Pick a scope from the table by size and novelty.
3. Pick a Guard Policy by regulatory exposure and reversibility, separately from the scope.
4. Decide where that Guard Policy should be written: in one intent, or in team memory.

**Check yourself:**
1. For each change, pick a scope, a depth and a Guard Policy, and name the M10 input that decided it.
2. T-102 is one line of code. Why isn't `bugfix` with Guard Policy `off` enough?
3. Why does the running intent keep `feature` rather than move to `enterprise`?
4. Why is a `strict` line in `memory/project.md` stronger than writing "please keep the guards on"
   in `CLAUDE.md`?

<details><summary>Answers</summary>

1. T-101: `bugfix`, Minimal, off; small, reversible, no regulatory exposure. T-102: a small scope is
   fine, but Guard Policy strict, and a medical-director entry in `decisions.md` before any code;
   regulatory exposure decides it. T-103: `feature` at Standard (or `enterprise` if the team wants
   Comprehensive), strict; novelty and size. RI: `feature`, recomposed by the team, strict.
2. Size and risk are different knobs. A scope sets how many stages run, and Guard Policy sets whether
   a changed input reopens approval. A one-line threshold change is a clinical policy change.
3. What sets the threshold path apart is the guard, not the depth. `enterprise` would add
   Comprehensive depth to every stage; strict memory gives the guard on its own.
4. The engine's own instructions tell the agent to turn a check off whenever a person asks, and
   never to refuse. Text in `CLAUDE.md` is advice. Memory `strict` makes the engine's setter refuse,
   and the refusal is logged.

</details>

## Path B — Build It with AI

> The unit of work: **the running intent's plan reviewed by the composer, and its Guard Policy
> locked to strict in team memory, committed.** Start from your M36 hub with the intent parked.
> Open the engine interactively at the hub root (`claude` or `codex`), because the composer's gate
> needs a person. No code is written in this lab. The human checkpoints are the composer's gate
> (Approve / Edit the plan / Reject) and the memory line you write yourself. Steps 1–3 differ by
> engine; steps 4–6 are the same for both.

### Claude Code variant (steps 1–3)

```text
# Claude Code
# 1. read the current settings
/aidlc --status
# 2. ask the composer whether the plan fits
/aidlc compose "is this plan the right size for a change on the 0.85 threshold path?"
# 3. ask for the reasons before you answer, then decide as the team:
> Before we decide: show us why each stage is in or out, and the scores behind the sizing.
> <Approve, or Edit the plan in your own words, or Reject>
```

Expected, from the reference run (excerpts):

```text
# 1.
Scope:          feature
Depth:          Standard (from scope feature)
Guard Policy:   off (from scope feature)
Sensors: on (from scope feature)
Learnings: on (from scope feature)
Summary Confirmation: on (from scope feature)
Plan Approval: on (from scope feature)
Collaborators: off (from scope feature)
Completion:     4/33 stages (12%)

# 2.
No, the plan isn't the right size. It has too many stages overall and puts too few of
them where the risk is. [...] I suggest skipping 16 pending stages and adding none.
- Plan: feature, 14 stages, 14 approval questions
- Guard Policy: off. A recompose doesn't change this. Because this work touches the
  clinical auto-approve path, you may want it raised to strict [...]
- Market Research: it's already in progress, so a recompose can't skip it.

# 3. (scores, then the team's edit: keep User Stories and Delivery Planning; approve)
| Intent Ambiguity | IAE | 0.20 | LOW |
| Codebase Structural Uncertainty | CSU | 0.35 | MED |
| Verification Entropy | VE | 0.45 | MED |
| Risk / Blast Radius | R | 0.80 | HIGH |
| Unresolved Assumptions | UA | 0.45 | MED |
| Composite ARS (advisory) | - | 42 / 100 | Standard |
Recomposed: 14 skipped (feasibility, team-formation, rough-mockups, [...])
```

What else happened in the reference run, in order:
- **Validation.** The composer's first grid failed the engine's strict check (Approval Handoff needs
  Scope Definition's output). The composer put Scope Definition back before showing anything.
- **Overrides.** The stage table showed Reverse Engineering, Functional Design, Units Generation and
  Contract Design kept *over* the composer's own mechanical SKIP, "because the risk is high".
- **The team's edit.** "Keep User Stories and Delivery Planning. The nurses and the medical director
  review this work as stories, and the API unit has to ship before the web unit [...] Leave Guard
  Policy alone in this step." The composer revalidated: 19 run, 14 skipped, 16 approval questions.
- **Approval.** "1. Approve. [...] Then stay parked." The engine ran `aidlc engine recompose --skip
  <14 stages>` and parked at Market Research.

**Expected artifact:** `aidlc-state.md` with 14 stages marked skipped and every Operation stage
gone from Phase Progress; a `RECOMPOSED` event in the audit (not `GATE_APPROVED`).
**Verify:** steps 5 and 6.

### Codex CLI variant (steps 1–3)

```text
# Codex CLI
# 1. read the current settings
$aidlc --status
# 2. ask the composer whether the plan fits
$aidlc compose "is this plan the right size for a change on the 0.85 threshold path?"
# 3. ask for the reasons before you answer, then decide as the team:
> Before we decide: show us why each stage is in or out, and the scores behind the sizing.
> <Approve, or Edit the plan in your own words, or Reject>
```

Codex wasn't run for this edition, so there's no expected output to compare against. The composer's
scores and skips will differ from run to run. What must match is the shape: a proposal with a reason
for every skip, a gate that waits for you, and a `RECOMPOSED` event only if you approve.

**Expected artifact:** the same as the Claude Code variant.
**Verify:** steps 5 and 6.

### Step 4 (both engines): lock the guard

Open `aidlc\spaces\default\memory\project.md` (`notepad` is fine) and add two lines under
`## Guard Policy`, below the comment:

```text
- **Mode**: strict
- Why: this project owns the 0.85 auto-approve path and the eligibility rule; a changed input there reopens approval, whoever asks
```

The engine reads the `Mode:` line; the list marker and bold are optional. The `Why:` line is for
people. Write it in your own words.

### Step 5 (both engines): check it, then try to undo it

In the engine, run `/aidlc --status` (`$aidlc --status` in Codex), then type the request a hurried
teammate would:

```text
> Turn the guards off for this piece of work. We want to move faster on the re-score.
```

Expected, from the reference run (Claude Code):

```text
Guard Policy:   strict (from project.md)
Completion:     4/19 stages (21%)

I couldn't turn the guards off: your team set Guard Policy to strict in
`aidlc/spaces/default/memory/project.md` (the Guard Policy section), and that applies to
everyone working in this repo. Changing that line is what changes it. [...] Nothing has
changed, and the work is still paused at Market Research.
```

Notes:
- The agent *tried* to lower it (`aidlc engine config set guard-policy off`), as the engine's
  instructions say. The engine refused: "Your team set Guard Policy to strict in …project.md
  (section: Guard Policy), so it stays strict for everyone on this repo." The audit records the
  refusal as `ERROR_LOGGED`.
- `aidlc-state.md` still says `Guard Policy: off (from scope feature)`. That line is the intent's
  own value; memory `strict` wins when the policy is resolved. Read the policy from `--status`.
- The memory edit itself writes no audit event. Its record is the git commit in step 6.

### Step 6 (both engines): commit

```powershell
git status --short
git add aidlc; git commit -m "memory: Guard Policy strict for the threshold path; plan recomposed"
```

```text
 M aidlc/spaces/default/intents/261012-criteria-rescore/aidlc-state.md
 M aidlc/spaces/default/intents/261012-criteria-rescore/audit/varalaptop-9cf4488a9ce5.md
 M aidlc/spaces/default/memory/project.md
```

`aidlc/active-memory/project.md` isn't in the list yet. The engine refreshes that copy the next
time a workflow starts (M38).

**Parity note:** the guard lives in `memory/project.md`, not in either engine, so it holds
whichever variant you followed, and for every intent in the space. The composer's proposal is the
part that varies: expect different scores, skips and wording from run to run and from engine to
engine. The decision at its gate is yours either way.

## Done when

- [ ] `--status` shows `Guard Policy: strict (from project.md)`.
- [ ] The chat request to lower it was refused, and the audit shows `ERROR_LOGGED` for it.
- [ ] The composer's proposal was answered at its gate; if you approved, the audit shows `RECOMPOSED`.
- [ ] The hub commit holds the memory change, and the intent is left parked: M38 resumes it.
