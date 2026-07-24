# Lab M27 — Walk D-4417 backwards, then build the convergence

> Module: M27 — Bolt 4: Determinations & Notifications
> Audience: practitioner · Estimated time: 40 min
> Domain: Prior Auth Portal (Determination records, notification chain, audit trail)

## Path A — Understand It (no tooling required)

**Artifact:** determination D-4417's record set.

```text
D-4417        REVIEWED path · denied · nurse R.Okafor ·
              rationale: criteria C-3, C-7 unmet
QUEUE         PENDING_REVIEW 09:14:05 → IN_REVIEW 09:31 (claim
              R.Okafor) → REVIEWED 09:58
SCORE         0.71 · components: C-1 ✓ C-3 ✕ C-7 ✕ · persisted
              09:14:02, immutable, compliance store
REQUEST       AR-88213 · RECEIVED 09:13 · member ref M-4417-r
NOTIFICATION  "determination available, ref AR-88213" → portal
              channel · delivered 10:01 · claims feed: not
              covered for denials → sent (no suppression)

TRAP: could a record set ever show a notification with no
      determination behind it?
```

**Trace it:**
1. Perform the audit walk backwards: notification → determination → queue → score →
   request.
2. Name the bolt each record descends from.
3. Dispose of the trap by citing the invariant and the tests that enforce it.

**Check yourself:**
1. Which bolt does each record descend from?
2. What in this set would a plaintiff's attorney check first, and does it hold?
3. Dispose of the trap: which invariant makes it impossible?

<details><summary>Answers</summary>

1. REQUEST: B1. SCORE: B2 (persisted-before-routing visible in the timestamps: the
   09:14:02 score write precedes the 09:14:05 queue entry). QUEUE: B3's transition
   records. D-4417 + NOTIFICATION: B4.
2. That the denial has a human behind it — and it does: below-threshold score, nurse
   claim, her identity and criteria-level rationale on the record; the walk holds
   with no gaps.
3. Notifications trigger *only* on determination creation (B4's trigger design), and
   `notifies_on_determination` plus the audit-walk test enforce it — a notification
   without a determination has no code path that could produce it.

</details>

## Path B — Build It with AI

> The unit of work: B4's core — determinations plus the notification integration.
> Run in the `prior-auth-api` folder (requires B3's close-out and the M18 contract).

### Claude Code variant

```text
# Claude Code
cd prior-auth-api
claude
> Bolt 4 core. Read docs/M23-capstone-inception.md,
> docs/M26-bolt3-close.md, and docs/M18-contract.md. Plan first,
> STOP for approval. Then: Determination module — immutable
> records from both paths (AUTO_APPROVED: score+components;
> REVIEWED: nurse identity+decision); notification trigger on
> creation integrating the existing renderer, preference, and
> undeliverable modules against the pinned contract (defer if a
> contract change seems needed); suppression when the claims
> feed covers the event type; an audit-walk query reconstructing
> full provenance from records only. Tests, exactly:
> determination_immutable, notifies_on_determination,
> no_clinical_content_in_notification, audit_trail_reconstructs,
> suppresses_when_claims_feed_covers. Union gates, show output.
> Close with docs/M27-bolt4-close.md — mark capstone code
> complete.
```

**Expected artifact:** the Determination module (both paths), the integrated
notification chain, the suppression rule, the audit-walk query, five named tests
green on the union, and the bolt close-out.
**Verify:** the audit-walk test uses persisted records only; the pinned contract is
unchanged (or a seam event was deferred and logged); capstone code marked complete.

### Codex CLI variant

```text
# Codex CLI
cd prior-auth-api
codex
> Bolt 4 core. Read docs/M23-capstone-inception.md,
> docs/M26-bolt3-close.md, and docs/M18-contract.md. Do NOT
> write yet — plan and stop for approval. Then: Determination
> module — immutable records from both paths (AUTO_APPROVED:
> score+components; REVIEWED: nurse identity+decision);
> notification trigger on creation integrating the existing
> renderer, preference, and undeliverable modules against the
> pinned contract (defer if a contract change seems needed);
> suppression when the claims feed covers the event type; an
> audit-walk query reconstructing full provenance from records
> only. Tests, exactly: determination_immutable,
> notifies_on_determination, no_clinical_content_in_notification,
> audit_trail_reconstructs, suppresses_when_claims_feed_covers.
> Union gates, show output. Close with docs/M27-bolt4-close.md —
> mark capstone code complete.
```

**Expected artifact:** the same convergence, tests, and close-out.
**Verify:** same checks — then run the audit walk yourself on one test determination
before signing the bolt.

**Parity note:** identical record shapes, test names, and suppression semantics from
either engine. The integration is also a referendum on your M18 contracts: if the
notify slices fit without modification, the pinning discipline paid; if a seam event
fired, verify it was deferred — not "improved" mid-merge.

## Done when

- [ ] Both determination paths produce the same immutable shape with rationale.
- [ ] The notify slices integrated against the pinned contract (or the seam deferred
      properly); all five tests green on the union.
- [ ] You walked one determination backwards with your own eyes, and
      `docs/M27-bolt4-close.md` marks capstone code complete.
