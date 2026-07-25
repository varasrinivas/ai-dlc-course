# Plan — Interdependent units of work (enhancement to M06 + M18)

> **Type:** cross-module enhancement, not a new module. Two coordinated edits, one
> theme: dependencies between units of work.
> **Split:** M06 (Track 2, *both*) **detects** coupling at Mob Elaboration; M18
> (Track 4, *practitioner*) **resolves** it at Construction.
> **Domain anchor for the worked example:** the capstone's B2 → B3 dependency — B2
> scoring *produces* the match score that B3's queue routing *consumes*. The capstone
> already serialises this (bolt order); this enhancement gives the method behind
> "the sequence writes itself from the dependencies" (M23) and adds the parallel
> alternative.

---

## The gap, stated precisely

The course teaches two things about multi-unit work and misses the one in between:

- **M06** parks a unit when a *question* blocks it (owner + date + blocked UW). That is
  **decision coupling**.
- **M18** parallelises units that are **disjoint** — they share a pinned interface but
  neither needs the other's *output*. It says so explicitly: *"Parallelize only what's
  disjoint."*
- **Missing: producer/consumer coupling** — UW-β consumes an artifact UW-α produces.
  You cannot build both at once against a shared *idea* of the interface, because one
  side needs the other's *real result*. Nothing teaches how to spot this at planning
  time, or the choice it forces at build time.

The two honest resolutions:

1. **Serialise** — order the units so the producer finishes first (the capstone's
   default: B1 → B2 → B3 → B4). Cheap, always correct, costs wall-clock.
2. **Decouple with a contract + stub** — pin the interface (M18's existing move), then
   let the consumer build against a *stub* of it while the producer builds the real
   thing. Two coupled units become two parallelisable bolts. Costs a stub and a real
   integration test at the seam.

The decision rule is the payload: **parallelise-with-stub only when the interface is
stable and the seam is small; otherwise serialise.** Coupling discovered *mid-bolt* is
the same protocol as any seam surprise — stop and defer, re-plan the order.

---

## Part 1 — M06 (detection), surgical, no new section

M06 is at the 4-section schema max, so **no new `<h2>`.** Three light touches:

1. **Extend "The clarifying-question loop" section** (the parking paragraph). It
   currently parks one kind of thing: an unanswerable question. Add one to two
   sentences naming a *second* kind of parked item surfaced in the same loop — a
   **dependency**: "this unit consumes what another unit produces." Its "owner" isn't a
   person and a date; it's **the producing unit and the interface between them**. The
   move at Elaboration is to name the interface as an acceptance-criterion-shaped
   contract now, so Construction can later choose to serialise or stub (forward-ref:
   "M18 resolves it"). Keep the section ≤ 300 words — trim, don't just append.

2. **Extend fig 6.1's PARKED box** caption/label so the dashed "PARKED" exit reads as
   *two* reasons: "unowned question → owner+date" and "cross-unit dependency →
   producer UW + interface". A one-line label change inside the existing SVG; no new
   figure.

3. **Lab M06 Path A — add a 4th exchange** to the transcript: the AI surfaces that the
   review-queue story consumes the score the scoring story produces, and asks whether
   to serialise or pin-and-stub. The parked row now shows a dependency, not a question.
   Add one check-question + answer. (Path B prompt gets one added clause: "if a unit
   consumes another unit's output, record the dependency and the interface, not just a
   date.") Keep the in-module lab and `labs/M06-lab.md` in parity.

4. **Recap** — add one bullet: dependencies are parked like questions, but their owner
   is a producing unit and an interface; resolving them is M18's job.

**Why here and not a new section:** detection is cheap exactly *because* it happens in
the room where the decomposition is still soft. Folding it into the parking mechanism
keeps M06's "one loop, explicit exits" spine intact and respects the section cap.

---

## Part 2 — M18 (resolution), a new 4th concept section

M18 has 3 concept sections → room for a 4th. This is where the method lives.

### New section: `<h2>` **Coupled seams: when a unit needs another's output**

Placement: **after "Merge discipline"** (so the disjoint case is fully built first),
before fig 18.1's figure block — or immediately after the figure. Draft (~250 words,
must stay ≤ 300):

> Everything so far assumed **disjoint** units — a shared interface, but neither slice
> waiting on the other's result. Real backlogs aren't always so kind. In the capstone,
> B3's review queue *consumes* the score B2 *produces*: a genuine producer/consumer
> dependency. You have two honest moves, and choosing between them is the skill.
>
> **Serialise.** Order the units so the producer finishes first — B2 before B3, the
> capstone's default. Always correct, needs no scaffolding, and costs only wall-clock.
> When the interface is still moving or the consumer is small, this is the right answer;
> don't build machinery to avoid a short wait.
>
> **Decouple with a contract and a stub.** Pin the interface exactly as you would for
> disjoint fan-out — but now the pinned contract does double duty: the producer builds
> *to* it, and the consumer builds *against a stub of it*, a fake that returns
> contract-shaped data so the consumer's bolt can run before the producer exists. Two
> coupled units become two parallel bolts. The price is the stub plus one real
> integration test at the seam — because a consumer that only ever saw the stub has
> never met the real producer.
>
> The rule: **stub-decouple only when the interface is stable and the seam is small;
> otherwise serialise.** And a dependency discovered *mid-bolt* is not a merge problem
> to muscle through — it's the seam telling you the decomposition was wrong. Stop,
> defer, re-order. Same protocol as every other pinned-contract surprise.

Reconcile with the existing "Parallel units of work" section in one clause there:
change "Parallelize only what's disjoint" → "Parallelize what's disjoint directly —
and what's *coupled* only after a stub makes it disjoint in practice (see below)," so
the two sections don't contradict.

### Second SVG (optional but recommended — architecture module allows two)

**fig 18.2 — serialise vs stub-decouple.** Small decision diagram, viewBox ~`0 0 760
220`. Left: `SERIALISE` — B2 box → (produces score) → B3 box, one lane, "correct,
costs wall-clock". Right: `STUB-DECOUPLE` — pinned contract chip in the middle; B2
building to it and B3 building against a dashed `STUB` of it, two lanes, joined by a
`seam integration test` node. Footer label: "stub-decouple when the interface is
stable and the seam is small — else serialise." currentColor + `var(--t4)` /
`var(--accent)` / `var(--warn)`, no fixed width. If we skip it, the section stands on
prose; flag as nice-to-have.

### Lab M18 — extend Path A (keep Path B as-is)

Current Path A shows a *disjoint* merge with a contract deviation. Add a short **second
trace** (or a Part 2 to Path A): an orchestration log where B3's queue is built against
a **stub** of B2's `ScoredRequest` contract, then the real B2 lands and the **seam
integration test** runs (and catches that the stub returned a score field the real
producer names differently — the exact failure a stub hides). One check-question +
answer: *why does a stubbed consumer still need a real integration test?* Keep
`labs/M18-lab.md` in parity. Path B stays the disjoint drill — adding a stubbed build
would bloat a 30-min lab; note in the plan that a stub drill could be a future M18b.

### Recap — add one bullet

> Coupled units aren't disjoint: **serialise** them (producer first) when the interface
> is soft, or **stub-decouple** them (consumer builds against a pinned stub, one seam
> integration test) when it's stable — never force parallel work through a merge.

---

## Continuity edits (small, but required for consistency)

- **M06 → M18 forward-ref** in the new M06 parking sentence ("Construction resolves it
  — M18").
- **M18 → capstone back-ref**: the new section names B2 → B3 explicitly; check M23's
  "the sequence writes itself from the dependencies" and M25/M26 so the worked example
  matches how the capstone actually orders those bolts (it serialises — this section
  says so and offers the stub alternative as the road not taken).
- **M23** gets one optional clause noting the two resolutions exist, pointing at M18,
  so the capstone's serialise-by-default is a *choice*, not the only option.

## Audience implication (flag for the author)

Detection (M06) is `both`; resolution (M18) is `practitioner`. A leader on the leader
path (T0→T1→T2→T3→T7) sees the dependency *exist* but not how it's resolved. That's
defensible — resolution is a build concern — but if leaders should see the
serialise-vs-decouple *tradeoff* (it's a scheduling/cost decision, which is leadership-
shaped), consider a one-paragraph mirror in M29 (team topology), where decision-domain
seams already appear. Left as an author call; not in this plan's core scope.

## Schema / standards check

- M06 stays at 4 concept sections (no new `<h2>`); M18 goes 3 → 4. Both legal.
- One analogy per module preserved — **no new Lakeview block.** M18's existing
  chalked-shared-wall analogy already carries the seam metaphor; the new section leans
  on it verbally without adding a block. M06's analogy is untouched.
- New section ≤ 300 words; M06 edits must keep their sections ≤ 300 (trim on insert).
- Both labs updated in-module *and* in `labs/`, dual-engine parity preserved.
- Domain stays Prior Auth (B2/B3, ScoredRequest); no second domain, no foo/bar.

## Build order (if approved)

1. M18 first — it holds the method and the worked example M06 forward-refs.
2. M06 second — its forward-ref then points at real content.
3. Update both `labs/*.md`, then run `scripts/validate-course.ps1` and the structural
   audit (section counts, word budgets, analogy count, parity).

## Open questions for review

- **fig 18.2**: build the second SVG, or keep the section prose-only? (Recommend build.)
- **Path B stub drill**: extend M18's Path B to include a stubbed build, or leave Path B
  disjoint and keep the stub in Path A only? (Recommend Path A only — protects the
  30-min budget.)
- **M23 clause**: touch the capstone to name the choice, or leave the capstone's
  serialise-by-default silent and let M18 own the concept? (Recommend the one-clause
  pointer — it's the payoff of the whole thread.)
