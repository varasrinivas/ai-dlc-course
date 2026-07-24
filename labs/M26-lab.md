# Lab M26 — Audit the table, then build the queue

> Module: M26 — Bolt 3: Nurse Review Queue
> Audience: practitioner · Estimated time: 40 min
> Domain: Prior Auth Portal (nurse review queue, AuthStatus state machine, 4h urgent SLA)

## Path A — Understand It (no tooling required)

**Artifact:** the transition table and four event sequences.

```text
TABLE  (intake)→RECEIVED · (intake)→REJECTED (terminal) ·
       RECEIVED→SCORED · SCORED→AUTO_APPROVED ·
       SCORED→PENDING_REVIEW · PENDING_REVIEW→IN_REVIEW ·
       IN_REVIEW→REVIEWED · IN_REVIEW→PENDING_REVIEW (timeout)
       precedence: timeout beats simultaneous claim

SEQ1  RECEIVED→SCORED→PENDING_REVIEW→IN_REVIEW→REVIEWED
SEQ2  …→IN_REVIEW→(timeout)→PENDING_REVIEW→IN_REVIEW→REVIEWED
SEQ3  RECEIVED→IN_REVIEW  ("nurse grabbed it early")
SEQ4  claim arrives as timeout fires on the same item
```

**Trace it:**
1. Validate each sequence against the table (legal, illegal, or resolved-by-rule).
2. Find where the below-threshold invariant is checked twice.
3. For SEQ3, name what the loud rejection protects.

**Check yourself:**
1. Validate SEQ1–SEQ4 against the table.
2. Where is the below-threshold invariant checked twice, and why isn't once enough?
3. What does SEQ3's loud rejection protect, concretely?

<details><summary>Answers</summary>

1. SEQ1 legal (happy path); SEQ2 legal (requeue loop, priority preserved); SEQ3
   illegal — no edge exists, rejected with a correlation id; SEQ4 resolved by
   precedence — timeout wins, the item requeues, the claim retries against it:
   deterministic, not racy.
2. At the blocking queue write (scoring time) and in the reconciliation sweep — once
   isn't enough because the write path can fail after scoring persists; the sweep
   catches exactly the gap the alarm watches.
3. The audit trail: a request reviewed without ever being scored-and-queued is a
   determination whose provenance can't be reconstructed — SEQ3 is the triage bot's
   ghost, and the table exorcises it.

</details>

## Path B — Build It with AI

> The unit of work: B3's core — the queue module and the state machine. Run in the
> `prior-auth-api` folder (requires the B2 close-out).

### Claude Code variant

```text
# Claude Code
cd prior-auth-api
claude
> Bolt 3 core. Read docs/M23-capstone-inception.md and
> docs/M25-bolt2-close.md. Plan first, STOP for approval. Then:
> queue entries from B2's routing flags (carry priority + score
> components); claim/timeout/requeue with one owner per item and
> timeout-beats-claim precedence; urgent-first ordering; the
> AuthStatus transition table as DATA with a guard that rejects
> illegal transitions loudly (correlation id); the reconciliation
> sweep. Tests, exactly: rejects_illegal_transition,
> urgent_orders_first, requeues_on_claim_timeout,
> one_owner_per_claimed_item, queues_within_60s_of_scoring,
> below_threshold_always_queued_or_determined. Run gates, show
> output. Close with docs/M26-bolt3-close.md.
```

**Expected artifact:** the queue module, the data-driven transition guard, the
reconciliation sweep, six named tests green, and the bolt close-out.
**Verify:** the transition table is data an auditor could read in one screen (not
scattered conditionals); all six tests green; the close-out hands B4 the REVIEWED
contract.

### Codex CLI variant

```text
# Codex CLI
cd prior-auth-api
codex
> Bolt 3 core. Read docs/M23-capstone-inception.md and
> docs/M25-bolt2-close.md. Do NOT write yet — plan and stop for
> approval. Then: queue entries from B2's routing flags (carry
> priority + score components); claim/timeout/requeue with one
> owner per item and timeout-beats-claim precedence; urgent-first
> ordering; the AuthStatus transition table as DATA with a guard
> that rejects illegal transitions loudly (correlation id); the
> reconciliation sweep. Tests, exactly:
> rejects_illegal_transition, urgent_orders_first,
> requeues_on_claim_timeout, one_owner_per_claimed_item,
> queues_within_60s_of_scoring,
> below_threshold_always_queued_or_determined. Run gates, show
> output. Close with docs/M26-bolt3-close.md.
```

**Expected artifact:** the same queue, guard, sweep, tests, and close-out.
**Verify:** same checks — and read the state-machine hunks yourself: the table should
be one screen.

**Parity note:** identical semantics and test names from either engine. The
SME-decided rules (claim-not-push, timeout precedence, urgent-first) are decisions.md
content — both engines inherit them from the chain, which is why neither should ask
about them again.

## Done when

- [ ] The queue routes, claims, times out, and reconciles; all six named tests are
      green.
- [ ] The transition table reads as data in one screen; illegal transitions fail
      loudly with correlation ids.
- [ ] `docs/M26-bolt3-close.md` hands B4 the REVIEWED contract.
