# Lab M05 — Trace an Inception, then run one

> Module: M05 — Inception: Intent → Units of Work
> Audience: both · Estimated time: 25 min
> Domain: Prior Auth Portal (AuthRequest, Member, Provider, AUTO_APPROVE_THRESHOLD, nurse review queue)

## Path A — Understand It (no tooling required)

**Artifact:** the intake epic's Inception trace, compressed to three stages.

```text
INTENT (excerpt): "…without a single determination below
  threshold skipping nurse review."

REQUIREMENTS (4 of 9):
  R3  Intake rejects AuthRequests for ineligible Members and
      writes an outreach log entry.          [decided M02]
  R4  GUARDRAIL: score < AUTO_APPROVE_THRESHOLD (0.85) routes
      to the nurse review queue — no bypass path may exist.
      ? [policy] a request auto-approved at 0.91 re-scores at
        0.62 — does the determination stand, or reopen for
        nurse review?
  R6  Urgent requests carry a priority flag on the same path.
  R7  Every score is logged immutably for audit.
      ? [data] where does the audit log live — portal DB or
        the org's compliance store?

STORY S2 (from R4): "As a nurse reviewer, I see every
  below-threshold request in my queue within 60 seconds of
  scoring, so no determination waits on a refresh."
  ACCEPTANCE: queue entry exists ≤ 60s after score persisted;
  no state where scored-below-threshold ≠ queued-or-determined.
  ? [integration] does queue entry creation block the scoring
    transaction, or run async with a reconciliation check?
```

**Trace it:**
1. Find the intent clause that R4 (the guardrail) traces to.
2. Classify each of the three attached questions: policy, edge case, data, or integration.
3. Test story S2 against the M03 sizing rule — one AI construction loop, one human
   checkpoint, reviewable alone. Decide what you'd split.

**Check yourself:**
1. Which clause of the intent does R4 trace to?
2. Classify the three attached questions.
3. Does S2 pass the sizing rule as one unit of work — and what would you split if not?

<details><summary>Answers</summary>

1. The final clause — "without a single determination below threshold skipping nurse
   review"; the guardrail is the intent's constraint made testable.
2. R4: policy. R7: data. S2: integration.
3. Borderline: the queue-write path is one loop and one checkpoint, but the reconciliation
   check is a second reviewable concern — most teams split it into UW "queue write
   (blocking)" and UW "reconciliation sweep", each independently reviewable.

</details>

## Path B — Build It with AI

> The unit of work: run Inception on a fresh intent — "Providers keep calling to ask where
> their request is — give them visibility into AuthRequest status without exposing member
> PHI." Both variants below must produce the same artifact. Run in the `prior-auth-api`
> folder from Lab M00.

### Claude Code variant

```text
# Claude Code
cd prior-auth-api
claude
> Intent: providers keep calling to ask where their request is —
> give them visibility into AuthRequest status without exposing
> member PHI. Run Inception only — do NOT write code. Create
> docs/M05-inception.md with: (1) the intent restated in your own
> words, (2) 4-6 requirements including at least one PHI guardrail,
> (3) at least 3 clarifying questions, each tagged [policy], [edge],
> [data], or [integration], (4) a draft unit-of-work list where
> each UW has a one-line sizing justification. Touch no other file.
```

**Expected artifact:** `docs/M05-inception.md` — restated intent, 4–6 requirements with a
PHI guardrail, ≥3 tagged clarifying questions, and a justified unit-of-work list. No code.
**Verify:** the restatement is faithful to the intent; the guardrail names PHI; every UW
carries a sizing justification; `Get-ChildItem -Recurse` from inside `prior-auth-api` shows
docs files only (steering file, M01, M02, M03, M05).

### Codex CLI variant

```text
# Codex CLI
cd prior-auth-api
codex
> Intent: providers keep calling to ask where their request is —
> give them visibility into AuthRequest status without exposing
> member PHI. Run Inception only — do NOT write code. Create
> docs/M05-inception.md with: (1) the intent restated in your own
> words, (2) 4-6 requirements including at least one PHI guardrail,
> (3) at least 3 clarifying questions, each tagged [policy], [edge],
> [data], or [integration], (4) a draft unit-of-work list where
> each UW has a one-line sizing justification. Touch no other file.
```

**Expected artifact:** the same `docs/M05-inception.md`, steered by AGENTS.md.
**Verify:** same checks as the Claude Code variant.

**Parity note:** both engines produce the same four-section Inception artifact. Question
sets will differ between engines — that's expected and instructive; the tags, the PHI
guardrail, and the structure must not differ.

## Done when

- [ ] `docs/M05-inception.md` has all four sections: restatement, requirements (with a
      PHI guardrail), ≥3 tagged questions, justified UW list.
- [ ] At least one question is one you genuinely couldn't answer without a human decider.
- [ ] No code was written by either engine.
