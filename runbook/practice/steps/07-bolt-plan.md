# Step 07 — Plan the bolts and pass the Inception check

> Runbook section: [07 · Bolt plan](../../multi-repo-feature.html#s7) ·
> Phase 2 Inception · stage 2.9 Delivery Planning, then the phase check ·
> Time: 20–30 minutes

## Goal

Plan the **bolts**. In AI-DLC v2 a bolt is a delivery slice: one or more units that depend
on each other, built in hours to days, with a human checkpoint after each unit.

You'll also pass the **Inception phase check**, the boundary between deciding and
building. Then Rally gets its stories.

## Who's in the room

- **Tech lead:** sequencing.
- **Product owner:** the delivery commitment.

## Do it

Resume and work the gate. What the reference run approved:

- **Bolt 1.** U1 `api-urgency-clock`, starting with a **walking skeleton**: the smallest
  slice that works end to end, here urgency stored on a request and returned. Then a human
  checkpoint, then the rest of U1.
- **Bolt 2.** U2 `notify-service`, then U3 `web-urgent-queue`, **one unit at a time**.
  This is unit-major, the default for solo work.

Then, at the hub, draft the Rally import:

```text
# Claude Code
/rally-draft
```

```text
# Codex CLI
$rally-draft
```

Import `tracking/rally/<intent>/rally-import.csv` into Rally by hand. Paste the new IDs into
`rally-map.md`. Commit the hub.

## What you'll see

<!-- RUN-QUOTES:07 -->

## Under the hood

- `bolt-plan.md` groups units **without changing the dependency graph** from step 06.
- AWS v2.11 has a hard limit: **team-owned units need a single-repo intent.** With three
  repos, one conductor runs Construction and each repo lead reviews at their unit's
  checkpoint. The engine rejects `set-unit-ownership team` for this intent.
- Parallel units (U2 and U3 together) need stage-major order with swarm execution. You
  can ask for it in plain words, but the default is one at a time, and that's what to use
  the first time.
- The phase check writes `verification/phase-check-inception.md`. It confirms every
  Inception stage produced what downstream stages consume.

## Before you say Approve

- Is the walking skeleton small enough to finish in one sitting, and does it prove the
  path end to end?
- Does the plan say what happens if U1's contract changes after U2 or U3 start? Consumers
  pin a version, so a change means a new version, not a silent edit.
- Read `risk-and-sequencing-rationale.md`. Do you agree with the *reasons*, not just the
  order?
- Does the phase check pass with nothing waived?

## Try this

Ask the engine: `What would change if we ran U2 and U3 in parallel?` Read what it says
about swarm execution and checkpoints. Then keep the default.

## Files written

- In `inception/delivery-planning/`:
  - `bolt-plan.md`
  - `risk-and-sequencing-rationale.md`
  - `team-allocation.md`
  - `external-dependency-map.md`
- `verification/phase-check-inception.md`
- `tracking/rally/<intent>/rally-import.csv` and `rally-map.md`

## Common snags

<!-- RUN-SNAGS:07 -->
