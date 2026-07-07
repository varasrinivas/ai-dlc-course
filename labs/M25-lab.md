# Lab M25 — Walk the no-bypass proof, then build the matcher

> Module: M25 — Bolt 2: Clinical Criteria Matching
> Audience: practitioner · Estimated time: 40 min
> Domain: Prior Auth Portal (ClinicalCriteria, AUTO_APPROVE_THRESHOLD 0.85, compliance store)

## Path A — Understand It (no tooling required)

**Artifact:** the adversarial review exchange and the negative-test list.

```text
ARCH: Empty criteria set for a serviceCode — score is what?
AI:   Undefined in the plan. My guess: skip scoring, route to
      review. Deferring — this is approval semantics.
SME:  Score it 0.0 explicitly. Ignorance is not approval.
      Route to review. Make it an AC.
QA:   And exactly 0.85?
AI:   Current comparison is ≥ — 0.85 approves. Decide?
PO:   ≥ stands. Document it in the audit note.

TESTS
no_auto_approval_below_threshold   → the guardrail property
approves_at_exact_threshold        → ≥ semantics, decided
empty_criteria_scores_zero         → ignorance ≠ approval
score_log_immutable                → update attempt fails loudly
persists_score_before_routing      → ordering is an AC
```

**Trace it:**
1. Map each test to the property it guards and the decision that created it.
2. Find the AC that encodes ordering, and say why it's an AC rather than an
   implementation detail.
3. Replay both exchanges against the M06 loop stages.

**Check yourself:**
1. Why does the empty-criteria case deserve an AC instead of a code comment?
2. What makes the ≥ exchange a good checkpoint rather than pedantry?
3. Which test would have caught M01's triage bot?

<details><summary>Answers</summary>

1. Because it's approval semantics — a member outcome — and ACs get tests and review;
   comments get archaeology. "Ignorance is not approval" is policy, and policy lives
   where the pipeline can enforce it.
2. Boundary behavior on a regulated threshold is exactly the question an auditor
   asks; deciding it out loud, recording it, and testing it costs three minutes now
   versus an incident review later.
3. `no_auto_approval_below_threshold` — the triage bot's 0.70 assumption was
   precisely a bypass of the (undecided) threshold property; here the property is
   decided, locked in config, and unreachable to violate without a failing test.

</details>

## Path B — Build It with AI

> The unit of work: B2's core — the matcher and threshold path. Run in the
> `prior-auth-api` folder (requires the B1 close-out and the gated config from
> Lab M17).

### Claude Code variant

```text
# Claude Code
cd prior-auth-api
claude
> Bolt 2 core. Read docs/M23-capstone-inception.md and
> docs/M24-bolt1-close.md. Plan first, STOP for approval. Then:
> ClinicalCriteria matcher (criteria-set fixtures per
> serviceCode, per-criterion components), threshold path reading
> config/threshold.json ONLY (no 0.85 literal anywhere else),
> in-memory compliance-store port with immutability enforced,
> score persisted before routing. Tests, exactly these names:
> no_auto_approval_below_threshold, approves_at_exact_threshold,
> empty_criteria_scores_zero, score_log_immutable,
> persists_score_before_routing. Assemble the PHI evidence-pack
> stub per docs/M11-stage-phi-review.md. Run gates, show output.
> Close with docs/M25-bolt2-close.md.
```

**Expected artifact:** the matcher, threshold path, immutable compliance-store port,
five named property tests green, the PHI evidence-pack stub, and the bolt close-out.
**Verify:** a search for "0.85" hits only `config/threshold.json`; all five tests
green; the close-out records the score-distribution learning hook for M31.

### Codex CLI variant

```text
# Codex CLI
cd prior-auth-api
codex
> Bolt 2 core. Read docs/M23-capstone-inception.md and
> docs/M24-bolt1-close.md. Do NOT write yet — plan and stop for
> approval. Then: ClinicalCriteria matcher (criteria-set fixtures
> per serviceCode, per-criterion components), threshold path
> reading config/threshold.json ONLY (no 0.85 literal anywhere
> else), in-memory compliance-store port with immutability
> enforced, score persisted before routing. Tests, exactly these
> names: no_auto_approval_below_threshold,
> approves_at_exact_threshold, empty_criteria_scores_zero,
> score_log_immutable, persists_score_before_routing. Assemble
> the PHI evidence-pack stub per docs/M11-stage-phi-review.md.
> Run gates, show output. Close with docs/M25-bolt2-close.md.
```

**Expected artifact:** the same matcher, tests, evidence pack, and close-out.
**Verify:** same checks — and run the no-bypass walk yourself on the final diff:
trace every path to AUTO_APPROVED before signing.

**Parity note:** identical property-test names and behavior from either engine. This
is the bolt where your M17 gates earn their keep — if your threshold gate is
mechanized on one engine only, your M22 policy already told you which seat to use.

## Done when

- [ ] All five property tests are green; the threshold literal exists only in the
      gated config.
- [ ] The PHI evidence-pack stub is assembled per the M11 stage definition.
- [ ] You personally walked every code path to AUTO_APPROVED, and
      `docs/M25-bolt2-close.md` is written.
