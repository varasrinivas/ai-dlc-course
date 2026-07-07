# Lab M02 — Run one oversight cycle for real

> Module: M02 — AI-DLC Core Principles
> Audience: both · Estimated time: 20 min
> Domain: Prior Auth Portal (AuthRequest, Member, Provider, ClinicalCriteria, AUTO_APPROVE_THRESHOLD)

## Path A — Understand It (no tooling required)

**Artifact:** one full oversight cycle from the intake unit of work (UW-1), transcribed below.

```text
AI:  Plan for UW-1 intake validation posted (12 steps, 4 files).
     Summary: schema check → Member eligibility → Provider
     network status → hand off to ClinicalCriteria scoring.
AI:  Question: an AuthRequest for an ineligible Member — reject
     at intake, or accept and log for outreach? Blocking step 6
     until you answer.
PO:  Reject at intake. Log it for member outreach — regulatory.
AI:  Plan updated: step 6 = reject + outreach log. Decision
     recorded in docs/decisions.md. Proceeding with steps 1–5;
     the staging deploy still waits for your sign-off.
```

**Trace it:**
1. Label every line with its protocol move: **PLAN**, **ASK**, **DEFER**, **DECIDE**, or
   **EXECUTE**. (Some lines carry two moves — the question line both asks and defers.)
2. Note the granularity of the block: the AI froze step 6, not the whole plan.
3. Find both checkpoints in the transcript — one resolved, one still pending.

**Check yourself:**
1. Which line is the human checkpoint?
2. What would the AI-managed version from M01 have done instead of asking?
3. Where did this decision get preserved, and who reads it next?

<details><summary>Answers</summary>

1. The PO's line — a named human resolving a deferred decision; note the AI blocked only
   step 6, not the whole plan. (The still-pending checkpoint is the staging deploy sign-off.)
2. Picked a default silently — the triage bot resolved its threshold question by assuming
   0.70 and kept going.
3. In `docs/decisions.md` — context memory. The next session's AI (and the next human)
   reads it instead of re-asking.

</details>

## Path B — Build It with AI

> The unit of work: run one real oversight cycle on the intake plan. The team has answered
> three of the M01 elaboration questions — those answers are course canon and appear in the
> prompt. Both variants below must produce the same artifact. Run in the `prior-auth-api`
> folder from Lab M00 (steering file already in place).

### Claude Code variant

```text
# Claude Code
cd prior-auth-api
claude
> Intent: plan intake validation for auth requests. Human decisions
> so far: (1) AUTO_APPROVE_THRESHOLD changes require medical
> director sign-off. (2) Ineligible Member → reject at intake and
> write an outreach log entry. (3) Urgent requests → priority flag
> on the same intake path. Do NOT write code. Create
> docs/M02-intake-plan.md: a step-by-step plan where every decision
> is marked [AI-proposed] or [HUMAN-DECIDED: the answer], ending
> with a "Still open — deferred" section for anything my three
> answers did not cover. Touch no other file.
```

**Expected artifact:** `docs/M02-intake-plan.md` — a step-by-step intake-validation plan in
which every decision line carries exactly one marker, the three supplied answers appear as
`[HUMAN-DECIDED: …]`, and a non-empty "Still open — deferred" section closes the file. No
code files created or modified.
**Verify:** open the file and check the markers; `Get-ChildItem -Recurse prior-auth-api`
shows only the steering file and the two docs files (M01 questions, M02 plan).

### Codex CLI variant

```text
# Codex CLI
cd prior-auth-api
codex
> Intent: plan intake validation for auth requests. Human decisions
> so far: (1) AUTO_APPROVE_THRESHOLD changes require medical
> director sign-off. (2) Ineligible Member → reject at intake and
> write an outreach log entry. (3) Urgent requests → priority flag
> on the same intake path. Do NOT write code. Create
> docs/M02-intake-plan.md: a step-by-step plan where every decision
> is marked [AI-proposed] or [HUMAN-DECIDED: the answer], ending
> with a "Still open — deferred" section for anything my three
> answers did not cover. Touch no other file.
```

**Expected artifact:** the same `docs/M02-intake-plan.md`, steered by AGENTS.md instead of
CLAUDE.md.
**Verify:** same checks as the Claude Code variant.

**Parity note:** both engines land on the identical artifact — one marked-up plan file, zero
code. Step ordering and wording will differ between engines; the three human decisions and
the marker discipline must not.

## Done when

- [ ] `docs/M02-intake-plan.md` exists and every decision line carries exactly one marker —
      `[AI-proposed]` or `[HUMAN-DECIDED: …]`.
- [ ] All three canonical answers appear as `[HUMAN-DECIDED]` entries, and the
      "Still open — deferred" section lists at least one genuinely open question.
- [ ] Neither engine created or modified a code file — and you can point at the exact line
      where a human, not the engine, decided.
