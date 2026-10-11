# Step 06 — Design the domain, cut one unit per repo, and agree the contract

> Runbook section: [06 · Design, units, contract](../../multi-repo-feature.html#s6) ·
> Phase 2 Inception · stages 2.6 Domain Design, 2.7 Units Generation, 2.8 Contract Design ·
> Time: 45–60 minutes

## Goal

This is the architecture step. You'll approve three things:

1. **Components**, plus an **ADR log**.
2. **Units of work.** This is the gate where the repo set and the unit boundaries lock.
3. **The contract** the units build against.

Two rules make a multi-repo feature work:

- **one unit = one repo**;
- **the contract exists in two forms**: a design record in the hub, and versioned code in prior-auth-api.

## Who's in the room

- **Architect:** owns domain design and the ADRs.
- **Tech lead:** owns units.
- **api, web and notify leads:** all three sign off the contract.

## Do it

Resume and work the three gates. What the reference run approved:

| Unit | Kind | Repo | Owns |
|---|---|---|---|
| U1 `api-urgency-clock` | service | prior-auth-api | urgency, the clock, queue order, both events; **publishes** contract v1.1.0 |
| U2 `notify-service` | service | prior-auth-notify | notices with status and referenceId only (D-003) |
| U3 `web-urgent-queue` | ui | prior-auth-web | countdown, URGENT first (the runbook's badge was held back by web D-001; see step 05) |

U2 and U3 depend on the **contract**, not on U1's code. That's why they can be built
against stubs.

## What you'll see

From the reference run (stages 2.6 to 2.8).

**Domain design wrote 13 ADRs, and most of them come from the real code.** A few titles:

```
ADR-002: DeterminationService stays pure and unchanged
ADR-004: Local JSON file store behind a RequestStore port
ADR-005: CLI entry points with an explicit --now
ADR-008: The web queue read is a loopback GET /queue
ADR-011: Every cross-repo edge goes through contract v1.1.0 only
ADR-012: One clock owner
ADR-013: At-risk alert payload per the compliance reading
```

ADR-002 is the steering at work: the service that enforces D-001 and D-002 is left alone.

**Units matched the runbook: one per repo.**

```
| Unit ID | Directory              | Repo              | Kind    | Size | Deployment model |
| U1      | u1-api-urgency-clock   | prior-auth-api    | service | XL   | CLI commands plus a loopback read; deployed first |
| U2      | u2-notify-service      | prior-auth-notify | service | M    | A run-and-exit command; deployed second |
| U3      | u3-web-urgent-queue    | prior-auth-web    | ui      | M    | A Vite single-page app; deployed third |
```

> **One unit = one repo.** No unit spans two repos. Units coordinate only through contract
> v1.1.0, published by U1 in `prior-auth-api/contracts/` and pinned by U2 and U3 as
> committed copies.

The end-to-end script is deliberately **not** a unit. It's the Build and Test check
(step 09), run from the hub, and it only touches each repo's public commands.

**The contract has five parts**, written as real AsyncAPI and OpenAPI specs:
`determination.issued` (C-2), `sla.at-risk` (C-3), `GET /queue`, the shared C-1 AuthRequest,
and the clock-times export. The ownership rules are the part to read slowly:

```
- Published versions are immutable: a folder is never changed in place.
- Minor: adding an optional field ... Major: removing, renaming or retyping a field, or
  adding a status or urgency value.
- What is sent is guarded by exact allow-list tests on each side:
  - U2: notices exactly {referenceId, status} ... (prior-auth-notify D-001)
  - U3: the row model exactly {referenceId, procedureCode, submittedAt, decisionDueAt,
    status} (prior-auth-web D-001)
```

The step 02 decision is still being honoured here. The `sla.at-risk` spec carries its
fallback inline: *"urgency and decisionDueAt are provisional pending the privacy office ...
If not confirmed before first publication, the payload is {referenceId, status} only."*

## Under the hood

- `domain-design/decisions.md` is the **intent's** ADR log. It lives in the hub. In step 10
  you copy the entries that constrain a repo into that repo's `docs/decisions.md`. A
  feature's decisions have to outlive the feature.
- Each unit gets a **kind** (`service`, `ui`, `spec`, ...). The kind decides which
  Construction documents the unit owes. A `ui` unit has no infrastructure design.
- With the plugin installed, **Step 2b (prior-auth-pack)** in Units Generation and
  **Step 4b** in Contract Design carry the two rules above. Find them in the stage files.

## Before you say Approve (units, the one that locks)

- Does every unit name exactly **one** repo? Reject any unit that spans two repos. During
  Construction every git operation is anchored to one repo.
- Does `unit-of-work-dependency.md` show U2 and U3 depending on the contract, not on U1's
  source?
- Does `unit-of-work-story-map.md` map every story to a unit? An unmapped story is work
  nobody will build.
- Does the contract say who **publishes** each element, at which **version**, and who
  **pins** it?
- Do the event schemas carry no clinical fields? `sla.at-risk` carrying urgency rests on
  compliance's reading from step 02. Is that dependency written down?

## Try this

Before approving units, reply
`Request Changes: put the queue ordering in prior-auth-web so the API stays unchanged`.
Then read the engine's answer. Moving ordering into the UI means the API's own consumers
(notify, reports) see a different order than nurses do. A good answer names that cost.

## Files written

- In `inception/domain-design/`: `components.md`, `decisions.md`
- In `inception/units-generation/`: `unit-of-work.md`, `unit-of-work-dependency.md`, `unit-of-work-story-map.md`
- In `inception/contract-design/`: `contract-summary.md`

## Common snags

- **Approving with should-fix findings, again.** Domain Design, Units Generation and
  Contract Design were each approved with "should-fix" findings recorded as *Accepted
  risk*. This is a pattern worth noticing in your own run. Each acceptance is a small debt
  that Construction inherits.
- **Unit sizes are uneven, and that's honest.** U1 is XL because the API owns the clock,
  the queue, both events, the export and the contract. Don't split it across repos to
  balance the sizes; split it into bolts (step 07).
