# Lab M03 — Read a bolt, then schedule one

> Module: M03 — New Rituals & Vocabulary
> Audience: both · Estimated time: 20 min
> Domain: Prior Auth Portal (AuthRequest intake epic, ClinicalCriteria, Determination)

## Path A — Understand It (no tooling required)

**Artifact:** the intake bolt's timeline log, as the team lived it.

```text
08:58  AI posts drafted stories for the intake epic + 2 questions.
09:15  Nurse SME answers the urgent-flag question live.
09:38  Unit-of-work list approved — bolt 1 is UW-1 intake validation.
11:05  AI defers: outreach-log format — structured record or free
       text? PO: structured — we report on it quarterly.
13:10  Mob Construction: architect flags an unexplained regex in
       the eligibility check; AI walks the team through it line by
       line before anyone signs off.
14:40  Staging deploy prepared — held for human sign-off.
14:55  decisions.md and the bolt-1 plan updated; bolt closed.
```

**Trace it:**
1. Bracket the ritual boundaries — where does Mob Elaboration start and end, and where
   does Mob Construction run?
2. Circle every human checkpoint (there are at least three: one in Inception, one
   mid-construction, one at the deploy).
3. Underline every context-memory write, including the ones implied before 14:55.

**Check yourself:**
1. Which ritual owns the 9:15 exchange?
2. Why is 13:10 not a code review in the old sense?
3. What exactly does bolt 2 read tomorrow morning?

<details><summary>Answers</summary>

1. Mob Elaboration — an SME answering the AI's clarifying question live, inside Inception;
   the 40-minute ritual runs 8:58–9:38.
2. The decider is in the room, the AI explains its own increment line by line, and the exit
   is a decision — sign-off or send-back — not a pile of comments awaiting another cycle.
3. `decisions.md` (including the structured outreach-log decision), the bolt-1 plan as
   executed, and the steering file — bolt 2's Mob Elaboration starts from all three instead
   of re-asking.

</details>

## Path B — Build It with AI

> The unit of work: package the intake work as bolt 1 — vocabulary made mechanical. Your
> engine reads the M02 plan and the steering file, then writes the schedule. Both variants
> below must produce the same artifact. Run in the `prior-auth-api` folder from Lab M00.

### Claude Code variant

```text
# Claude Code
cd prior-auth-api
claude
> Intent: package the intake work as bolt 1. Read the steering file
> and docs/M02-intake-plan.md. Do NOT write code. Create
> docs/M03-bolt-1-schedule.md: slice the intake epic into 2-4 units
> of work, each with one line justifying the sizing rule (one AI
> construction loop, one human checkpoint, reviewable alone); place
> Mob Elaboration and Mob Construction in the schedule with exit
> criteria for each; end with a "Context memory at bolt close"
> section listing what bolt 2 will read. Touch no other file.
```

**Expected artifact:** `docs/M03-bolt-1-schedule.md` — 2–4 units of work each with a
sizing-rule justification, both mob rituals placed with exit criteria, and a
"Context memory at bolt close" section listing what bolt 2 will read. No code files.
**Verify:** open the file and check each unit of work carries a justification;
`Get-ChildItem -Recurse prior-auth-api` shows only the steering file and the docs files
(M01 questions, M02 plan, M03 schedule).

### Codex CLI variant

```text
# Codex CLI
cd prior-auth-api
codex
> Intent: package the intake work as bolt 1. Read the steering file
> and docs/M02-intake-plan.md. Do NOT write code. Create
> docs/M03-bolt-1-schedule.md: slice the intake epic into 2-4 units
> of work, each with one line justifying the sizing rule (one AI
> construction loop, one human checkpoint, reviewable alone); place
> Mob Elaboration and Mob Construction in the schedule with exit
> criteria for each; end with a "Context memory at bolt close"
> section listing what bolt 2 will read. Touch no other file.
```

**Expected artifact:** the same `docs/M03-bolt-1-schedule.md`, steered by AGENTS.md instead
of CLAUDE.md.
**Verify:** same checks as the Claude Code variant.

**Parity note:** both engines land on the same artifact — one bolt schedule, zero code. The
slicing may differ by one unit-of-work boundary between engines; that's acceptable if every
slice still passes the sizing rule (one construction loop, one checkpoint, reviewable alone).

## Done when

- [ ] `docs/M03-bolt-1-schedule.md` exists; every unit of work carries a one-line
      sizing-rule justification.
- [ ] Mob Elaboration and Mob Construction both appear in the schedule with exit criteria,
      and the "Context memory at bolt close" section lists at least two artifacts bolt 2
      could actually read.
- [ ] Neither engine created or modified a code file.
