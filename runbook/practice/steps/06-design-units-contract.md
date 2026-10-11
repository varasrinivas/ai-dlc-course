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
| U3 `web-urgent-queue` | ui | prior-auth-web | badge, countdown, URGENT first |

U2 and U3 depend on the **contract**, not on U1's code. That's why they can be built
against stubs.

## What you'll see

<!-- RUN-QUOTES:06 -->

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

<!-- RUN-SNAGS:06 -->
