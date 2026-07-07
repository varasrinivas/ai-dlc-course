# Lab M08 — Sit the review, then chair one

> Module: M08 — Mob Construction & Human Checkpoints
> Audience: practitioner · Estimated time: 25 min
> Domain: Prior Auth Portal (UW-1a increment; AuthRequest, Member, outreach log)

## Path A — Understand It (no tooling required)

**Artifact:** the Mob Construction transcript for UW-1a.

```text
AI:    Two deviations from the approved plan. One: serviceCode
       format check added — schema allowed strings the payer
       rejects downstream. Two: outreach log writes through a
       buffer — direct writes stalled intake by 40ms p95.
ARCH:  Explain the buffer flush condition, line 118.
AI:    Flush at 250ms or 50 entries, whichever first; on crash,
       unflushed entries replay from the intake event log, so no
       outreach entry is lost — ordering with the reject response
       is not guaranteed, which AC-2 does not require.
QA:    (spot-explain) I'll take the eligibility hunk… it ports
       the lookup so tests fake it; reject path writes exactly
       one log entry — that's writes_outreach_log_once.
PO:    Where does 250ms come from?
AI:    Chosen arbitrarily; not in the plan or decisions.md.
PO:    Send back: extract the threshold to config, name it,
       justify the default in the increment summary.
```

**Trace it:**
1. Mark where deviations lead the session, and what each deviation's reason is.
2. Name the gate each exchange exercises (mechanical vs human; which human gate).
3. Write the send-back's re-entry step as a narrow re-plan.

**Check yourself:**
1. Which human gate did the PO's exchange exercise, and why did it fail?
2. Which technique was QA running, and what did it prove?
3. Write the send-back as a narrow re-plan step.

<details><summary>Answers</summary>

1. Constraints honored / every line explained — the 250ms was an *undecided decision*
   hiding as a constant; "chosen arbitrarily" is an honest answer that fails the gate.
2. Spot-explain sampling — a human explaining a hunk back proves the room's
   understanding, not the AI's.
3. "Re-plan step 5b: move flush threshold to config as OUTREACH_FLUSH_MS, default 250
   with a one-line justification; re-run tests; present the delta only." One step, one
   file cluster, tests already green as the mechanical gate.

</details>

## Path B — Build It with AI

> The unit of work: review the M07 increment as a mob of one. If you skipped Lab M07,
> run its Path B first — this review needs a real diff. Both variants produce the same
> artifact. Run in the `prior-auth-api` folder.

### Claude Code variant

```text
# Claude Code
cd prior-auth-api
claude
> Run Mob Construction on the UW-1a increment you built. Present
> it against the approved plan: deviations FIRST with reasons,
> then walk each acceptance criterion to its test. Then answer my
> questions — any line, plain words. I will end with one send-back
> containing a decision; apply it, re-run the tests, and write
> docs/M08-review-log.md with four sections: deviations presented,
> Q&A, the send-back, disposition.
```

**Expected artifact:** `docs/M08-review-log.md` with four sections (deviations, Q&A,
send-back, disposition), plus the applied send-back change with tests still green.
**Verify:** deviations came first; your ≥2 questions got plain-words answers; `npx jest`
green after the change; the send-back in the log reads as a decision, not a vibe.

### Codex CLI variant

```text
# Codex CLI
cd prior-auth-api
codex
> Run Mob Construction on the UW-1a increment you built. Present
> it against the approved plan: deviations FIRST with reasons,
> then walk each acceptance criterion to its test. Then answer my
> questions — any line, plain words. I will end with one send-back
> containing a decision; apply it, re-run the tests, and write
> docs/M08-review-log.md with four sections: deviations presented,
> Q&A, the send-back, disposition.
```

**Expected artifact:** the same four-section review log and applied change, steered by
AGENTS.md.
**Verify:** same checks as the Claude Code variant.

**Parity note:** both engines produce the same artifact structure — a four-section review
log and a green re-run after the send-back. The Q&A content will differ by engine; that
difference is the interesting part, not a defect.

## Done when

- [ ] The review opened with deviations and their reasons, before anything that matched
      the plan.
- [ ] You asked at least two any-line questions and got plain-words answers.
- [ ] One send-back phrased as a decision was applied; `npx jest` is green; the log has
      all four sections.
