# Walkthrough 07

> Stage 2.9 Delivery Planning, then the Inception phase check.
> Reference run: intent `261011-urgent-auth-clock`, turns 070 to 076.

## Background

Delivery Planning is the last Inception stage. It decides **how the approved units get
built**: in what order, in what slices, with which human stops, and what happens when an
outside decision slips. It doesn't change what the units are. The dependency graph from
step 06 is fixed input.

**A bolt is AI-DLC's delivery slice.** In AWS AI-DLC v2 a bolt covers one or more
dependency-linked units and ends in code that runs and passes its repo's gate. Bolts
replace sprints: they're sized in hours to days, and each ends with a human checkpoint per
unit, not a demo at a fixed date. `bolt-plan.md` records the grouping and the reasons for
it, without touching the dependency graph.

**The walking skeleton comes first.** With the skeleton stance on, the first unit starts
with the smallest slice that works end to end, and a human approves that slice before the
rest of the unit is built. The skeleton is defined as one observable behaviour, not as a
layer. Here: an urgent request goes in through the real entry point, is stored, and comes
back out with its urgency. It proves the build, test and storage path is real before the
hard work starts on top of it.

**Order is set by dependencies and risk.**

| Bolt | Contents | Why this order |
|---|---|---|
| Bolt 1 | U1 `api-urgency-clock` in prior-auth-api: skeleton, checkpoint, then the rest of U1 | U1 has no dependencies and publishes the contract the others need |
| Bolt 2 | U2 `notify-service`, then U3 `web-urgent-queue`, one unit at a time | Both depend only on U1's published contract, not on each other |

Inside a large unit, risk goes first: the clock edges, the concurrency, the privacy
allow-lists. Delivery Planning asks what worries the room most, and each answer becomes an
early, test-first item.

**Construction settings are chosen here**, and they matter:

- **Iteration: unit-major.** Each unit runs all its design stages and Code Generation,
  then its checkpoint, before the next unit starts. This is the default for solo work and
  the one to use the first time.
- **Execution: serial.** Parallel units (U2 and U3 together) need stage-major order with
  swarm execution. You can ask for it in plain words, but it is not the default.
- **Unit ownership.** v2's team mode, where each person claims a unit in their own
  checkout, needs a single-repo intent. For a three-repo intent, one conductor runs
  Construction from the hub, and each repo lead reviews at their own unit's checkpoint.
  The engine refuses team ownership for this intent.
- **The verification command** that every unit checkpoint will run. It can be deferred to
  the first checkpoint if the gate it names doesn't exist yet.

**The Inception phase check** closes the phase. It writes
`verification/phase-check-inception.md` and counts things: every requirement traced to a
story, every story to a component, every story to a unit. A deferral is allowed only if it
names the downstream stage that picks it up. A gap fails the check. It's the boundary
between deciding and building: once it passes, Construction starts writing design
documents per unit, and soon after that, code.

After the gate, the Rally stories are drafted from the approved files and imported by
hand. Rally is a mirror of the record, not the record.

## In the reference workspace

### The workspace before this step

Domain Design, Units Generation and Contract Design were approved and locked. The ledger
(`inception/gate-decisions.md`) carried the accepted findings from all three gates. No
repo had changed since its seed commit. `inception/delivery-planning/` did not exist yet.

The last thing the engine said before this stage (turn 070-mob):

> I approved Contract Design and added R-01 to R-06 to the ledger. Every v1.1.0 schema is
> now open, C-2 has its fallback, and U3 pins the whole folder but uses only the queue
> read.

### The commands, as typed

**The four Delivery Planning answers** (turn 071-mob):

```text
Q1: A. Dependencies already set the order: skeleton first, then the riskiest clock and alert work inside U1, then publishing v1.1.0, then U2 before U3. A WSJF score would only restate that (Tech lead, PO agrees)
Q2: A. Keep it to one Bolt with milestones M1, M2 and M3. U1 is one unit in one repo, so it gets one squash-merge to prior-auth-api `main`. The M1 skeleton checkpoint stays a hard stop: the api lead reviews it and the tech lead approves it. If M2 runs long, we split at the M2/M3 boundary through a plan amendment at the gate, not on the fly (Tech lead)
Q3: A. Accepted as proposed. OQ-1: US2.4 is held and comes back through a plan amendment once compliance confirms the 168h reading (Compliance lead). I-7 and I-4: if they slip, we publish v1.1.0 in the fallback {referenceId, status} form. The extra fields come later as v1.2.0, a new version and never an edit to v1.1.0. U2 and U3 re-pin only through their own plan change. D-003 holds either way (api lead, Compliance lead with the privacy office). The web row-model decision holds only U3 and does not change web D-001 (web lead). OQ-10 blocks nothing (Compliance lead)
Q4: A, B, C. A: the clock edges are the regulatory risk. Test the boundary and ±1 ms with fixed instants and explicit offsets (UM director, QA lead). B: concurrency in the file store and outbox decides whether a notice is sent exactly once (notify lead, api lead). C: allow-list tests in all three repos protect prior-auth-api D-003, notify D-001 and web D-001 (Compliance lead). E is not picked as a worry because the existing rule already covers it: if web starts below 80%, that comes back to U3's gate for explicit approval (QA lead)

Done. I've filled in all four answers. Ready for the two protected questions.
```

**Summary confirmed** (turn 072-mob, abridged):

```text
1. Looks correct. This matches the plan we agreed. Bolt 1 is U1 in prior-auth-api: the walking skeleton comes first, then a hard-stop checkpoint (the api lead reviews it and the tech lead approves it). M2 and M3 follow, and the bolt ends in one squash-merge. [...] (Tech lead + PO)
```

**Protected question 1, the verification command: deferred** (turn 073-mob):

```text
1. Defer to the U1 skeleton checkpoint. `npm run verify` doesn't exist in `prior-auth-api` yet, because U1 adds it. At that checkpoint we'll propose the full `npm run verify` gate in `prior-auth-api` as the command. That gate runs `npm ci` → typecheck → lint → tests with the 80% coverage floor → `npm audit --omit=dev --audit-level=high` → secret scan. It must also include at least one test through the skeleton's real entry point: store an urgent request, then read it back with its urgency. The api lead reviews it and the tech lead approves it there. (Tech lead + QA lead)
```

**Protected question 2, staffing** (turn 074-mob):

```text
1. From this session: you build each unit in its own repo, one unit at a time. Bolt 1 is U1 in prior-auth-api, starting with the walking skeleton. Bolt 2 is U2 in prior-auth-notify, then U3 in prior-auth-web. Keep a human checkpoint on every unit: the repo lead reviews their own unit (U1 api lead, U2 notify lead, U3 web lead), and the tech lead approves it before it merges to that repo's local main. Don't run anything autonomously. (Tech lead)
```

**The Delivery Planning gate: Approve** (turn 076-mob):

```text
1. Approve. This matches what we agreed. Bolt 1 is U1 `api-urgency-clock` in prior-auth-api. It starts with the walking skeleton, where urgency is stored and returned. It then stops at a checkpoint: the api lead reviews and the tech lead approves. Next comes the test-first regulatory core, which publishes contract v1.1.0. Bolt 2 runs U2 in prior-auth-notify and then U3 in prior-auth-web, one unit at a time, each in its own repo. Both pin v1.1.0. The settings stay as they are: serial, unit-major, checkpoints on, the verification command approved at the U1 skeleton checkpoint, and nothing autonomous. The scripted end-to-end run stays at Build and Test as the end-of-intent check. Recorded rules are unchanged (prior-auth-api D-001/D-002/D-003, prior-auth-web D-001). After approval I'll run `rally-draft` and fill `rally-map.md` (tech lead + PO)
```

<!-- not captured: /rally-draft was not run in the reference run at this point; the hub's tracking/rally/ holds only rally-import-template.csv, so there is no real rally-import.csv or rally-map.md to show -->
<!-- not captured: the card's "Try this" (asking what would change with U2 and U3 in parallel) was not run in the reference run -->

### What the engine showed

**It proposed the bolt shape and asked only the open parts** (turn 070-mob):

> **Delivery Planning** is the last Inception stage. It plans the **Bolts**: one build
> pass over a piece of the work, ending in code that runs and passes its repo's gate. Most
> of the plan is already settled:
> - **Bolt 1** is U1: the walking skeleton first, then a checkpoint, then the rest of U1.
> - **Bolt 2** is U2, then U3, one at a time.
> - Each repo lead reviews their own unit, and the tech lead approves it.
>
> There are 4 questions in `inception/delivery-planning/delivery-planning-questions.md`:
> [...]
> 2. **Should U1 be one Bolt or two?** I suggest one Bolt with three milestones:
>    - M1: the skeleton, then the checkpoint;
>    - M2: the regulatory core, then contract publication;
>    - M3: the queue endpoint and the export.
> 3. **What if an outside decision slips?** Proposed:
>    - **OQ-1:** U1's plan goes ahead with only the STANDARD due-time story held back.
>    - **I-7 / I-4:** publish the safe {referenceId, status} form, and add the extra fields
>      later as a minor version. U2 is never blocked.
>    - **The web decision:** it only holds U3.
> 4. **What worries you most?** Pick any: clock edges, file-store concurrency, privacy
>    leaks, U1's size, web coverage. Each one you pick becomes an early, test-first item.

**The answer file was blank again, and it said so** (turn 071-mob):

> The four `[Answer]:` lines in the file were blank again, so I wrote your answers in from
> your message, word for word. If you're editing the file directly, it may not be saving
> to `inception/delivery-planning/delivery-planning-questions.md`.

**It refused team ownership for a three-repo intent** (turn 073-mob):

> **Second question: how do you want to staff Construction?** You can run the work from
> this session, with one unit at a time as already set. Or each team can own a unit and
> approve its work independently.
>
> Because this intent spans three sibling repos, only the first option works here. Team
> ownership needs the workspace root itself to be the source repo, and it isn't.
>
> 1. **From this session.** I build each unit in its own repo, and each repo lead reviews
>    and the tech lead approves at every checkpoint (recommended, and the only supported
>    option)
> 2. **Each team owns a unit.** Not available while the intent spans sibling repos.

**It remembered "nothing autonomous" for a question that comes later** (turn 074-mob):

> You also said nothing should run autonomously. The choice between continuing
> automatically and reviewing each checkpoint comes up after the walking skeleton is
> approved. When it does, I'll record **review each checkpoint**, following that
> instruction.

(It did. That question appeared at U1's checkpoint in step 08, turn 117.)

**The gate, with the phase check already passed** (turn 075-mob):

> 📅 **Delivery Planning is ready for your approval. It's the last step of Inception.**
> [...]
> - **`verification/phase-check-inception.md`:** **PASS**, with no gaps across
>   requirements, stories, components and units.
>
> **Construction settings:**
> - one unit at a time, serially, with checkpoints on;
> - run from this session;
> - the verification command deferred to the U1 skeleton checkpoint;
> - review at every checkpoint, with nothing run autonomously.
>
> No recorded rule changes.
>
> 1. **Approve**: Inception ends, and Construction starts with Functional Design for U1
> 2. **Request Changes**: tell me what to change

**Approval rolled straight into Construction** (turn 076-mob):

> AI-DLC continued straight into Construction, so I started Functional Design for U1.
> Nothing has been built, and this step stops at questions for you. If you want to run
> `rally-draft` and fill in `rally-map.md` first, go ahead; these questions will wait.

### The workspace after this step

```text
inception\delivery-planning
    bolt-plan.md
    delivery-planning-questions.md
    external-dependency-map.md
    memory.md
    risk-and-sequencing-rationale.md
    team-allocation.md

verification
    phase-check-ideation.md
    phase-check-inception.md
```

**The bolt plan** (`inception/delivery-planning/bolt-plan.md`), sequence and Bolt 1:

```markdown
## Sequence

| Order | Bolt | Unit | Repo |
|---|---|---|---|
| 1 | Bolt 1 | U1 `u1-api-urgency-clock` | prior-auth-api |
| 2 | Bolt 2, first | U2 `u2-notify-service` | prior-auth-notify |
| 3 | Bolt 2, second | U3 `u3-web-urgent-queue` | prior-auth-web |
| — | End-of-intent check | The scripted end-to-end run (US8.1 to US8.4) | Workspace e2e folder (QA lead) |

This follows the unit dependency graph exactly: U1 first, then U2 and U3, which each depend only on U1's published contract. Choosing U2 before U3 is one of the two valid orders, not a deviation.

---

## Bolt 1: U1 api-urgency-clock (prior-auth-api), walking skeleton first

**Walking skeleton:** the first slice is the smallest working version that proves the pieces connect inside prior-auth-api. A request is submitted as URGENT through the real `submit` entry point, stored in the file store, and read back with its urgency (US1.1, AC1.1.1).

| Milestone | Contents | Ends with |
|---|---|---|
| **M1: skeleton** | Baseline run of the existing suite (OQ-11). Enablers: ESLint (with the sibling-import ban), Prettier, coverage (80% over `src/`), `npm run verify`, Node pin, lockfile. RequestStore, minimal AuthRequestLifecycle and ApiCommandLine `submit`. US1.1. | **Hard-stop checkpoint.** The api lead reviews and the tech lead approves. Evidence: `npm run verify` output, plus the real-entry-point test. |
| **M2: regulatory core** | Early and test-first [Q4]: clock edges (US2.3, US2.4*, US2.7 at the boundary and ±1 ms, fixed instants, explicit offsets), file-store and outbox concurrency (US5.2; ledger R-12 and R-13), allow-list tests (US6.1, US7.4). [...] **Contract v1.1.0 published** to `prior-auth-api/contracts/v1.1.0/` once I-7 and I-4 are settled, or in the fallback form [Q3]. | v1.1.0 published, which unblocks U2's and U3's plans |
| **M3: reads** | US4.1 (QueueProjection plus GET /queue on 127.0.0.1), US7.1 and US7.2 (export). | Unit complete, then `npm run verify`, then one squash-merge to prior-auth-api `main` |
[...]
**Splitting:** U1 stays one Bolt [Q2]. If M2 runs long, U1 is split at the M2/M3 boundary only through a plan amendment at the gate, never on the fly.
```

**The phase check** (`verification/phase-check-inception.md`), the counts:

```markdown
**Verdict: PASS.** There are no GAP or ORPHAN entries, no invalid targets, and no missing upstream IDs.
[...]
| Upstream | Count | OK | Deferred | N/A | GAP |
|---|---|---|---|---|---|
| FR and FR sub-IDs | 61 | 61 | 0 | 0 | 0 |
| NFR | 17 | 12 | 5 | 0 | 0 |

Deferred, each with a named downstream stage:
- NFR9 (synthetic data), NFR11 (go-live security), NFR12 (no `--host`) and NFR16 (capacity, OQ-12) go to NFR Requirements;
- NFR14 (coverage and the `verify` gate) goes to Build and Test.
[...]
## Stories to Units (`units-generation/traceability.json`)

| Upstream | Count | OK | Deferred | N/A | GAP |
|---|---|---|---|---|---|
| US1.1 to US8.4 | 37 | 32 | 4 | 1 | 0 |
[...]
## Open Items Carried into Construction (not gaps)

| Item | Owner | When |
|---|---|---|
| OQ-1 | Compliance lead | Before U1's plan (US2.4 is held otherwise) |
| I-7, I-4 | Api lead; compliance lead with the privacy office | Before v1.1.0 is published (fallback otherwise) |
| The web row-model decision | Web lead | Before U3's plan |
| OQ-10, OQ-12 | Compliance lead / UM director | Not blocking |
```

**The state file** (`aidlc-state.md`, Runtime State). The Construction settings agreed at
this gate, as the file reads in the reference workspace now. Two lines were filled in
later, in step 08: the engine recorded `Skeleton Stance: on` at the end of U1's
Functional Design (turn 081-mob), and the verification command at U1's checkpoint
(turn 112-mob):

```markdown
## Runtime State
- **Revision Count**: 4
- **Construction Checkpoints**: enabled
- **Construction Iteration**: unit-major
- **Construction Execution**: serial

- **Unit Ownership**: solo

- **Skeleton Stance**: on
[...]
- **Construction Verification Command**: node scripts/verify-all.mjs
```
