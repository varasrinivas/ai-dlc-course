# Walkthrough 06

> Stages 2.6 Domain Design, 2.7 Units Generation, 2.8 Contract Design.
> Reference run: intent `261011-urgent-auth-clock`, turns 057 to 070, run headless with
> Claude Code against `aidlc` v2.11.0.

## Background

This is the step where the feature gets an architecture. Up to now the intent has been
words: requirements, stories, mockups. Three stages turn those words into something a
build can be organised around.

| Stage | Question it answers | What it writes | Who owns the gate |
|---|---|---|---|
| 2.6 Domain Design | Which components exist, which repo owns each one, and why? | `components.md`, `decisions.md` (the intent's ADR log), `traceability.json` | Architect |
| 2.7 Units Generation | How is the work cut into units of work? | `unit-of-work.md`, `unit-of-work-dependency.md`, `unit-of-work-story-map.md` | Tech lead |
| 2.8 Contract Design | What exactly crosses the boundary between units? | `contract-summary.md` | All three repo leads |

**Domain Design** produces a component catalogue and an ADR log. The catalogue gives
every component and every entity exactly one owning repo. The ADR log records the
architecture choices with their context, consequences and rejected alternatives. In a
brownfield intent most ADRs come from what the existing code already does, so the steering
files and decision logs you wrote in step 01 show up here. The ADR log belongs to the
**intent** and lives in the hub. In step 10 you copy the entries that constrain a repo into
that repo's own `docs/decisions.md`.

**Units Generation** cuts the work into units and tags each with a **kind** (`service`,
`ui`, `spec`, and so on). The kind decides which Construction documents the unit owes: a
`ui` unit, for example, owes no infrastructure design. This is the gate where the repo set
and the unit boundaries lock. Everything in Construction is planned per unit.

**Contract Design** writes the agreements between units: who provides each element, who
consumes it, the mechanism, the version, and the ownership rules.

Two rules make a multi-repo feature work, and both are tested at this step:

1. **One unit = one repo.** During Construction the engine anchors every git operation to
   one repo. A unit that spans two repos fights the engine, and it also makes review and
   rollback unclear. If units come out uneven in size, that's honest: split a large unit
   into bolts in step 07, never across repos.
2. **The contract exists in two forms.** `contract-summary.md` in the hub is the design
   record. The machine-readable contract (`prior-auth-api/contracts/v1.1.0/`) is code that
   the providing unit generates in Construction, and consumers pin a copy of it. Because
   U2 and U3 depend on the contract and not on U1's source, they can be built against it
   as soon as it is published.

Each of the three stages runs the same loop you met in step 02: a question file, a
summary to confirm, a draft, an AI architecture review, then the gate. Two things are
worth watching in this step specifically:

- **Locked documents and the ledger.** Once a review is final, the documents it covered are
  frozen. A finding accepted at the gate is not edited in; it goes into
  `inception/gate-decisions.md`, the ledger, which every later plan must read. When you
  read an approved artifact, read the ledger beside it.
- **Should-fix findings accepted as risk.** In the reference run, all three gates passed
  with should-fix findings carried forward. Each is a small debt that Construction
  inherits, so make sure each one names who decided it and where it will be handled.

## In the reference workspace

### The workspace before this step

The hub had finished Requirements, User Stories and Refined Mockups. Under the intent,
`inception/` held these stage folders and the ledger (names from the folder listing,
limited to the stages already run):

```text
inception/
  gate-decisions.md
  practices-discovery/
  requirements-analysis/
  reverse-engineering/
  user-stories/
  refined-mockups/
```

The three repos were untouched since their seed commits. `prior-auth-api` on `main`:

```text
936b5eb seed: prior-auth-api
```

Refined Mockups had just been approved, and the engine went straight into Domain Design
(turn 057-mob).

### The commands, as typed

Every reply below went to the engine through the resumed `/aidlc` session. Roles in
brackets are part of the reply: the engine records who decided each answer.

**Domain Design answers** (turn 058-mob, abridged to four of the ten):

```text
Q1: A. One writer for AuthRequest and its times, with pure helpers so we can test one rule at a time. (api lead, architect agrees)
Q2: A. DeterminationService stays pure and keeps prior-auth-api D-001 (>= 0.85 auto-approves) and D-002 (eligibility outranks score) exactly as written. A nurse determination can only be APPROVED or DENIED. The lifecycle sets determinedAt once and refuses a second one. (api lead)
[...]
Q6: A. Transactional outbox inside the request record, with the claim made under a per-request lock. No alert is lost, the stored time is set once, and notify dedupes any re-send. Event payloads stay field-by-field per prior-auth-api D-003. (api lead, compliance agrees)
[...]
Q8: A. One read-only GET /queue that binds to 127.0.0.1 only and uses Node http. Queue rows carry the reference id only, per prior-auth-web D-001, and the endpoint is checked against contract v1.1.0. (api lead, web lead agrees)
[...]
Done. All 10 answered.
```

**Domain Design, first gate: Request Changes** (turn 061-mob), because the review had a
blocking finding:

```text
2. Request Changes: apply R-01 to R-06 as recorded and fold in the notes R-07 to R-11. R-01 is blocking, so don't approve until every change to a request takes its lock and re-reads the record under it. When the reviewer checks again, also confirm that decisions.md has an ADR for "one clock owner": prior-auth-api computes `decisionDueAt`, and web and notify only read it. Also confirm there is an ADR for "at-risk alert payload per compliance reading". [...] Leave prior-auth-api D-001/D-002/D-003 and prior-auth-web D-001 unchanged. Every component and entity must keep exactly one owning repo. (Architect, with tech lead and api lead)
```

**Domain Design, second gate: Approve** (turn 062-mob, abridged):

```text
Approve. All four findings are accepted and go into the ledger for U1's and U2's plans:
- **R-12 and R-13** (tech lead): apply both fixes as you described them. [...]
- **R-14** (compliance lead + nurse lead): under ADR-013's fallback, the at-risk alert carries referenceId and status only, with no urgency and no due time. Notify does not read C-1 or work out a due time to fill that gap: one clock, one owner. [...]
- **R-15** (api lead): fix the stale `EventPublisher` line when U1's plan is written.

No recorded rule changes (D-001, D-002, D-003, web D-001). Continue to Units Generation. (Architect, tech lead)
```

**Units Generation answers** (turn 063-mob):

```text
Q1: B. US8 stays out of the units. Our plan is three units, one per repo, and the scripted end-to-end run is the end-of-intent check (Practices Q8), not something built as a unit. It runs at Build and Test from the workspace e2e folder, owned by the QA lead, with the result approved by the tech lead. It drives each repo only through its public commands, GET /queue, the event files and the outbox, and never imports source. (Tech lead, confirmed by QA lead)
Q2: A. Keep U1 as one unit (XL) in prior-auth-api, as the scope decided. The walking skeleton is its first slice: urgency stored and read back, then a checkpoint where the api lead reviews and the tech lead approves. If Delivery Planning needs to, it can split U1's work across Bolts inside prior-auth-api. Splitting it into two units would put a second clock-owning unit in the same repo and give U2 and U3 more dependencies to manage, for no gain. (Tech lead + api lead)
```

**Units Generation gate: Approve** (turn 066-mob), the gate where the repo set locks:

```text
1. Approve. The three units are one per repo, as we planned: U1 is in prior-auth-api, U2 in prior-auth-notify and U3 in prior-auth-web. No unit spans two repos. U2 and U3 depend on U1 only through contract v1.1.0 (tech lead).

We accept both findings and are carrying them into the Delivery Planning ledger:
- R-01: accepted. Delivery Planning sets the order. Bolt 1 is U1, with the walking skeleton first, a checkpoint, then the rest of U1. U1 publishes v1.1.0 to `prior-auth-api/contracts/` once I-7 and I-4 are settled. U2 and U3 then wait only for that published contract, not for all of U1 (tech lead).
- R-02: accepted. Change US4.5's trace status to N/A so it matches Domain Design. [...] (web lead).
```

**Contract Design answers** (turn 067-mob, abridged):

```text
Q1: A. Open schemas so a later minor doesn't break consumers pinned to v1.1.0; each side's exact allow-list tests keep guarding what is sent and shown (prior-auth-api D-003, prior-auth-web D-001, prior-auth-notify D-001) (api lead, with web and notify leads)
Q2: A. v1.1.0 is the first published version, and web's mirror without PENDING_NURSE_REVIEW is recorded as the de-facto v1.0, so every v1.1.0 change is additive and no v1.0.0 folder is published (api lead)
Q3: A. Settle it now: urgency is optional in the C-3 schema and U1 always sends it. When it is absent, notify leaves it out of the alert and never writes STANDARD, because notify does not derive clock or urgency data (one clock, one owner) (api lead, notify lead consulted)
[...]
```

**Contract Design gate: Approve, with rulings for the ledger** (turn 070-mob):

```text
Approve. Answers for the ledger:
R-01: Open both schemas, the export row and the Error body, so the text matches Q1: every object schema in v1.1.0 is open. The seven export columns are enforced by the required list and the provider's exact-key allow-list test, which fails if a column is added. If we close a schema later, that is a new decision with sign-off. (api lead + tech lead)
R-02: Accept the proposed fallback. If I-7 rules against issuedAt, C-2's required set becomes {referenceId, status} and issuedAt is removed before v1.1.0 is first published. [...] (api lead, confirmed by compliance)
R-03: U3 does not use C-1. It uses only the queue read and the common definitions. [...] (web lead)
R-04 to R-06: All three notes accepted. [...] (tech lead)
```

Hold on to R-01. In step 08 the kit's plan reviewer flags it as a conflict, and the
tech lead reverses it at U1's plan gate (G-01).

<!-- not captured: the card's "Try this" (Request Changes to move queue ordering into prior-auth-web) was not run in the reference run -->

### What the engine showed

**It asked only what earlier stages hadn't settled.** Domain Design opened with ten
questions and named the open items each one closed (turn 057-mob):

> **Domain Design has started.** There are 10 questions in
> `inception/domain-design/domain-design-questions.md`. They settle the items earlier
> stages sent here: OQ-13, OQ-14 and R-08.
> [...]
> - **Q2:** `DeterminationService` stays pure, with prior-auth-api D-001 and D-002
>   unchanged. It gains a check that a nurse decision is APPROVED or DENIED.

**It checked an ambiguous answer instead of guessing** (turn 058-mob):

> In Q8 you wrote "queue rows carry the reference id only". I've put that in the summary
> as "rows stay within prior-auth-web D-001": the row model has exactly the five keys
> already in the ledger, and referenceId is the identifier. That way it doesn't read as
> dropping Procedure, Submitted, Due and Status. If you meant something stricter, say so.

**The architecture reviewer found a real concurrency bug in the design** (turn 059-mob):

> The architecture reviewer returned **not ready**, with 1 blocking finding, 5 should-fix
> items and 5 notes. The catalogue itself checks out: every edge is symmetric, there are
> no cycles, each entity has one owner, all 37 stories are traced, and no recorded rule
> changes. The problems are in my concurrency design.
>
> **R-01, blocking.** I put the lock only on the alert claim. `determine`,
> `mark-complete` and the publisher's "mark sent" also rewrite the same request file
> without a lock, and the check and publisher run as separate overlapping processes. Two
> consequences:
> - a stale write can wipe out a determination and its C-2 event;
> - a stale read can fire an alert on a request that was already decided.

**It recommended against approving while a finding was blocking** (turn 060-mob):

> 1. **Approve**: continue to Units Generation as it stands (not recommended while R-01 is
>    blocking)
> 2. **Request Changes**: I apply R-01 to R-06 and the notes, the reviewer checks again,
>    and you see the gate again

**The revision passed, with the two ADRs the room asked for** (turn 061-mob):

> - **R-01 holds for every change:** submit, score, mark complete, determination, the
>   alert claim and mark sent all lock and re-read. Id allocation uses the store-wide lock.
> - **All of R-01 to R-11 are resolved.**
> - **ADR-012 (one clock owner) and ADR-013 (the at-risk alert payload)** are present and
>   complete.
> - **Every component and entity has exactly one repo:** 9 api, 5 notify and 4 web
>   components.
> [...]
> The document is locked now, so I can't edit it in place. If you approve, R-12 to R-15
> go into the ledger for U1's and U2's plans, the same way as the earlier gates.

**Units Generation offered a fourth unit, then let the room decline it** (turn 062-mob):

> 1. **Where do the end-to-end stories (US8.1–US8.4) live?** One option is a fourth unit,
>    U4 `e2e-scripted-run`, in the workspace hub repo, owned by the QA lead. [...] The
>    other is to leave it out of the units and run it as the Build and Test end-of-intent
>    check.

**The units review confirmed the one-repo rule mechanically** (turn 064-mob):

> What it confirmed:
> - each unit sits in exactly one repo;
> - the components match the domain design's "Ownership by repo" table exactly;
> - the dependency block is well formed with no cycles;
> - all 37 stories line up between the story map and the traceability file;
> - your preconditions are carried, and no recorded rule changes.
>
> **Findings:**
> - **R-01, should-fix:** in the story map, "contract v1.1.0 published" is the *last* step
>   of U1's internal order. That makes it look as though U2 and U3 must wait for all of U1.
>   [...]

**The Units Generation gate** (turn 065-mob):

> 🔧 **Units Generation is ready for your approval.**
> [...]
> | Unit | Repo | Kind | Size | Stories |
> |---|---|---|---|---|
> | U1 `u1-api-urgency-clock` | prior-auth-api | service | XL | 23 (walking skeleton first, then checkpoint) |
> | U2 `u2-notify-service` | prior-auth-notify | service | M | 4 |
> | U3 `u3-web-urgent-queue` | prior-auth-web | ui | M | 6 |

**The contract review caught the engine contradicting the room's own answer**
(turn 068-mob):

> **Should-fix, each needing your call:**
> - **R-01, closed schemas:** you chose open schemas in Q1. I closed two:
>   - the export row: its seven columns are fixed;
>   - the error body: only the typed error name.
>
>   Either confirm both as deliberate exceptions, or open them.
> - **R-02, C-2 fallback:** only C-3 has an I-7 fallback written, but `issuedAt` in C-2 is
>   provisional too. Proposed fallback: C-2 becomes {referenceId, status}, and NFR2 then
>   reads determinedAt from the stored record (Requirements R-04).

**It also noticed a blank answer file** (turn 067-mob):

> When I opened `contract-design-questions.md`, the six `[Answer]:` lines were still blank,
> so I copied your answers from chat, word for word with attributions. If you saved a
> different version, tell me.

### The workspace after this step

Three stage folders, each with its questions file, its outputs and its review records:

```text
inception\domain-design
|   components.md
|   decisions.md
|   domain-design-questions.md
|   memory.md
|   traceability.json
|
\---reviews
        review-01.md
        review-02.md

inception\units-generation
|   memory.md
|   traceability.json
|   unit-of-work-dependency.md
|   unit-of-work-story-map.md
|   unit-of-work.md
|   units-generation-questions.md
|
\---reviews
        review-01.md

inception\contract-design
|   contract-design-questions.md
|   contract-summary.md
|   memory.md
|
\---reviews
        review-01.md
```

`inception/gate-decisions.md` gained three sections: "Domain Design gate (review-02, R-12
to R-15)", "Units Generation gate (review-01, R-01 and R-02)" and "Contract Design gate
(review-01, R-01 to R-06)". No repo changed: the contract is still only a design record.
U1 generates the code form in step 08.

**The ADR log** (`inception/domain-design/decisions.md`), headings:

```text
## ADR-001: One owner of AuthRequest, with pure helpers
## ADR-002: DeterminationService stays pure and unchanged
## ADR-003: PENDING at submission, scoring as its own step
## ADR-004: Local JSON file store behind a RequestStore port
## ADR-005: CLI entry points with an explicit --now
## ADR-006: Transactional outbox inside the request record
## ADR-007: completeAt can never be earlier than submittedAt
## ADR-008: The web queue read is a loopback GET /queue
## ADR-009: prior-auth-notify is four components behind one run-and-exit command
## ADR-010: prior-auth-web is split into source, formatter, clock and screen
## ADR-011: Every cross-repo edge goes through contract v1.1.0 only
## ADR-012: One clock owner
## ADR-013: At-risk alert payload per the compliance reading
```

One ADR in full shape, so you can see what a reviewed entry carries:

```markdown
## ADR-012: One clock owner

- **Context:**
  - A deadline computed in two places can disagree, and a disagreement is a regulatory miss (R-3).
  - prior-auth-notify's `AGENTS.md` says "Never compute the decision clock… One clock, one owner: prior-auth-api".
  - The project rule forbids computing or deriving `decisionDueAt` outside prior-auth-api.
- **Decision:**
  - `DecisionClock` in prior-auth-api is the only place `decisionDueAt` is computed.
  - `AuthRequestLifecycle` stores it once, at completion.
  - prior-auth-web (`QueueSource`, `DueText`) and prior-auth-notify (`NoticeComposer`) only read the value they receive through contract v1.1.0. They display or copy it, and never derive it.
  [...]
- **Alternatives Rejected:**
  - **Each consumer computes the due time from completeAt and urgency.** Rejected: it duplicates the regulatory rule in three repos, and it breaks the project rule and prior-auth-notify's steering.
  - **A shared clock library.** Rejected: shared source across repos is forbidden (ADR-011).
```

**The units** (`inception/units-generation/unit-of-work.md`):

```markdown
| Unit ID | Directory | Repo | Kind | Size | Deployment model |
|---|---|---|---|---|---|
| U1 | `u1-api-urgency-clock` | prior-auth-api | service | XL | Standalone. CLI commands plus a loopback read; deployed first at go-live. |
| U2 | `u2-notify-service` | prior-auth-notify | service | M | Standalone. A run-and-exit command; deployed second at go-live. |
| U3 | `u3-web-urgent-queue` | prior-auth-web | ui | M | Standalone. A Vite single-page app; deployed third at go-live. |

**One unit = one repo.** No unit spans two repos. Units coordinate only through contract v1.1.0, published by U1 in `prior-auth-api/contracts/` and pinned by U2 and U3 as committed copies. [...]
```

**The dependency graph** (`unit-of-work-dependency.md`). Every edge points at U1, and the
edge labels name the contract parts, not U1's code:

```yaml
units:
  - name: api-urgency-clock
    kind: service
    depends_on: []
  - name: notify-service
    kind: service
    depends_on: [api-urgency-clock]
  - name: web-urgent-queue
    kind: ui
    depends_on: [api-urgency-clock]
```

**The contract's ownership rules** (`inception/contract-design/contract-summary.md`):

```markdown
## Contract Ownership Rules

- **Owner:** U1 (the api lead) owns every spec. The tech lead approves each published version.
- **Published versions are immutable:** a folder is never changed in place.
- **Versioning is semver** [Q6]:
  - **Minor:** adding an optional field, or adding an export column.
  - **Major:** removing, renaming or retyping a field, or adding a status or urgency value. [...]
[...]
- **What is sent is guarded by exact allow-list tests on each side:**
  - U1: C-2, C-3, C-1, queue items, export (prior-auth-api D-003).
  - U2: notices exactly {referenceId, status}, and alerts exactly the received C-3 fields (prior-auth-notify D-001).
  - U3: the row model exactly {referenceId, procedureCode, submittedAt, decisionDueAt, status} (prior-auth-web D-001).
- **Before first publication:** the I-7 and I-4 outcome is applied to C-2 and C-3 before v1.1.0 is first published [Q6], so the fallback never changes a published version.
```

And the step 02 privacy decision, still carried inline in the `sla.at-risk` spec:

```yaml
    description: >
      One JSON line per request, at most once (FR6.3), appended to the sla.at-risk event file. For the
      internal nurse workflow only: the assigned nurse and the nurse supervisor, addressed by role in the
      outbox file name (R-12, ADR-013). urgency and decisionDueAt are provisional pending the privacy office
      (I-4) and I-7. If not confirmed before first publication, the payload is {referenceId, status} only and
      notify adds nothing (R-14).
```
