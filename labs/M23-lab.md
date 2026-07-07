# Lab M23 — Read the kickoff, then run the Inception

> Module: M23 — Capstone Kickoff: Intent → Backlog of Bolts
> Audience: practitioner · Estimated time: 35 min
> Domain: Prior Auth Portal (the full capstone: intake, criteria matching, review queue, determinations)

## Path A — Understand It (no tooling required)

**Artifact:** the kickoff Mob Elaboration, compressed.

```text
AI:   Stack — scaffold NestJS now, or continue the TS structure
      and port later? Consequential either way; deferring.
ARCH: NestJS now, as B1's first UW — the practice repo's shape
      should match the domain: modules per entity. Record it.
AI:   Recorded. Audit store for the score log — decisions.md
      shows it PARKED since bolt 1. Still blocking B2.
PRIYA: Closed last week: org compliance store, write-through.
      Updating the record now.
AI:   Then B2's criteria: score persisted before routing; every
      score in the compliance store immutably; below 0.85 →
      queue entry ≤ 60s (S2 carried); threshold changes gated
      per config lock.
FAC:  Note what didn't happen: nobody re-asked the urgent SLA,
      staleness, or side-channel questions. The book answered.
```

**Trace it:**
1. Separate fresh decisions from inherited constraints (the chain working).
2. Extract B2's acceptance criteria as testable clauses.
3. Explain why the stack decision becomes B1's first unit of work.

**Check yourself:**
1. Which lines are fresh decisions and which are the chain working?
2. Write B2's ACs as testable clauses.
3. Why does the stack decision belong to B1 rather than "before the capstone"?

<details><summary>Answers</summary>

1. Fresh: the stack call and Priya's compliance-store closure (a parked question
   resolving on schedule). Inherited: S2's 60-second clause, the threshold lock, and
   everything the facilitator lists as not-re-asked.
2. AC-1: a score is persisted to the compliance store before any routing occurs;
   AC-2: score writes are immutable (update attempts fail loudly); AC-3: score < 0.85
   produces a queue entry within 60s; AC-4: threshold config edits without a decision
   record are blocked by the gate.
3. Because it's executable work with a checkpoint — a scaffold is a unit of work, not
   a meeting; making it B1's first UW gives it a plan, gates, and a reviewable
   increment like everything else.

</details>

## Path B — Build It with AI

> The unit of work: the full capstone Inception. This epic qualifies for the M22
> parity experiment — run both legs if your policy says so. Run in the
> `prior-auth-api` folder.

### Claude Code variant

```text
# Claude Code
cd prior-auth-api
claude --permission-mode plan
> Capstone Inception. Intent: cut prior-auth turnaround from 4.2
> days to under 24 hours for auto-approvable requests, with no
> determination below threshold skipping nurse review. FIRST read
> the entire docs/ chain and both steering files. Then: restate;
> produce the four-bolt backlog (B1 intake API, B2 criteria
> matching, B3 review queue, B4 determinations+notifications) —
> per bolt: UWs with sizing, testable+traceable ACs, gates,
> dependencies; an inherited-constraints section citing the
> decisions.md / semantic-map lines by name; and at most 3
> genuinely new tagged questions. Include the stack decision as
> B1's first UW, deferred to me.
# decide the stack, iterate, approve →
# docs/M23-capstone-inception.md
```

**Expected artifact:** `docs/M23-capstone-inception.md` — restatement, four-bolt
backlog with UWs/ACs/gates/dependencies, cited inherited constraints, ≤3 new
questions, the stack decision recorded.
**Verify:** inherited constraints are cited (not re-asked); every AC is testable and
traceable; B1's first UW is the stack decision with a record pointer.

### Codex CLI variant

```text
# Codex CLI
cd prior-auth-api
codex
> Capstone Inception. Do NOT write any file — plan only, stop
> for approval. Intent: cut prior-auth turnaround from 4.2 days
> to under 24 hours for auto-approvable requests, with no
> determination below threshold skipping nurse review. FIRST read
> the entire docs/ chain and both steering files. Then: restate;
> produce the four-bolt backlog (B1 intake API, B2 criteria
> matching, B3 review queue, B4 determinations+notifications) —
> per bolt: UWs with sizing, testable+traceable ACs, gates,
> dependencies; an inherited-constraints section citing the
> decisions.md / semantic-map lines by name; and at most 3
> genuinely new tagged questions. Include the stack decision as
> B1's first UW, deferred to me.
# decide, approve → docs/M23-capstone-inception.md
# (parity experiment? name the file -cx and compare per M20)
```

**Expected artifact:** the same capstone inception file.
**Verify:** same checks.

**Parity note:** if you run both legs (recommended — this is the decomposition most
worth two opinions), name the files `-cc`/`-cx` and write the M20-style comparison:
restatement match, guardrail match, question overlap, bolt/UW boundary differences as
options for your mob.

## Done when

- [ ] The capstone inception file exists: four gated bolts, UWs, testable/traceable
      ACs, dependencies.
- [ ] Inherited constraints are cited by artifact and line — and were not re-asked.
- [ ] At most 3 genuinely new questions survived, and the stack decision carries a
      human's name.
