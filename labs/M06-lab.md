# Lab M06 — Read the room, then run the loop

> Module: M06 — Mob Elaboration in Practice
> Audience: both · Estimated time: 25 min
> Domain: Prior Auth Portal (intake epic; AuthRequest, Member, Provider, nurse review queue)

## Path A — Understand It (no tooling required)

**Artifact:** a Mob Elaboration excerpt from the intake session — one clean loop, one
disagreement, one parked question.

```text
AI:   Urgent requests use a priority flag on the same path
      [decided M02]. Still open: what SLA does urgent carry? My
      guess: 24 hours, same as standard. I won't decide — SLA is
      clinical territory.
SME:  Not 24 — urgent means STAT imaging too. 4 hours. Add it
      to the criteria.
AI:   Restating: priority flag, same path; urgent SLA is 4 hours
      including STAT imaging. Recording… done. Next.

SME:  Urgent ones should also phone the queue lead directly.
PO:   No side channels — everything through the queue, or audit
      can't see it.
FAC:  Jurisdiction check: routing policy — whose call?
PO:   Mine. Queue only. SLA alarm instead of a phone call.
AI:   Restating: no side channels; 4-hour SLA raises a queue
      alarm. Recording… done.

AI:   R7's audit log — portal DB or the org compliance store?
ARCH: Genuinely don't know. Compliance owns that answer.
FAC:  Parked: owner Priya (architect), answer by Friday. Blocks
      R7's immutable score log in bolt 2's scoring engine, and
      UW-1c's handoff into it — bolt order may shift.
```

**Trace it:**
1. Mark the five loop stages in the first exchange (ask + guess, bounded discussion,
   named decision, restate, record).
2. In the second exchange, identify the deciding authority and what the facilitator asked.
3. Extract the parking-lot row: owner, date, blocked unit of work.

**Check yourself:**
1. In the first exchange, where are the five stages?
2. In the second, what did the facilitator do that a consensus-seeker wouldn't?
3. What three fields make the parked question a promise instead of a graveyard entry?

<details><summary>Answers</summary>

1. Ask + best guess (AI's first line), bounded discussion (SME's answer), decision by a
   named owner (the SME — clinical territory), restate (AI's "Restating…"), record
   ("Recording… done").
2. Asked whose call it was — jurisdiction, not agreement; the PO owned routing policy, so
   the SME's preference informed but didn't decide.
3. Owner (Priya), date (Friday), and the blocked work — R7's immutable score log in bolt 2's
   scoring engine, plus UW-1c's handoff into it — which is what lets it reorder the backlog
   instead of silently rotting.

</details>

## Path B — Build It with AI

> The unit of work: run a live question loop with your engine as the elaborating AI — you
> are the room. This lab is interactive on purpose: the conversation is the ritual. Both
> variants produce the same artifact. Run in the `prior-auth-api` folder (requires
> `docs/M05-inception.md` from Lab M05).

### Claude Code variant

```text
# Claude Code
cd prior-auth-api
claude
> Run Mob Elaboration on docs/M05-inception.md. Present your open
> questions ONE at a time: state your best guess and why you will
> not decide alone, then wait for my answer. After each answer,
> restate it as a constraint before the next question. When all
> are answered or parked (owner + date), write
> docs/M06-elaboration-log.md: a question → decision → constraint
> table, then acceptance criteria (3 testable clauses each, naming
> their requirement) for two stories. Do NOT write code.
```

**Expected artifact:** `docs/M06-elaboration-log.md` — a question → decision → constraint
table with ≥3 completed loops, then acceptance criteria (3 testable, requirement-naming
clauses each) for two stories of the provider-visibility epic. No code.
**Verify:** the engine waited for your answer at every question (never answered itself);
every acceptance clause names its requirement; no code files created.

### Codex CLI variant

```text
# Codex CLI
cd prior-auth-api
codex
> Run Mob Elaboration on docs/M05-inception.md. Present your open
> questions ONE at a time: state your best guess and why you will
> not decide alone, then wait for my answer. After each answer,
> restate it as a constraint before the next question. When all
> are answered or parked (owner + date), write
> docs/M06-elaboration-log.md: a question → decision → constraint
> table, then acceptance criteria (3 testable clauses each, naming
> their requirement) for two stories. Do NOT write code.
```

**Expected artifact:** the same `docs/M06-elaboration-log.md`, steered by AGENTS.md.
**Verify:** same checks as the Claude Code variant.

**Parity note:** the conversations will differ between engines — different question order,
different best guesses; that contrast is instructive. The artifact must match in structure:
a loops table (question → decision → constraint) plus traceable acceptance criteria.

## Done when

- [ ] `docs/M06-elaboration-log.md` exists with ≥3 completed loops, your decisions
      restated as constraints.
- [ ] Two stories carry acceptance criteria that are testable, traceable (name their
      requirement), and edge-bearing.
- [ ] The engine never answered its own question, and no code was written.
