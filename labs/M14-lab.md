# Lab M14 — Fix the rules, then drill the refusal

> Module: M14 — Steering with CLAUDE.md
> Audience: practitioner · Estimated time: 25 min
> Domain: Prior Auth Portal (AUTO_APPROVE_THRESHOLD guardrail, PHI logging rules)

## Path A — Understand It (no tooling required)

**Artifact:** a flawed CLAUDE.md excerpt.

```text
1  Write clean, maintainable code.
2  Collect all validation errors; never fail-fast.
3  Be careful with PHI.
4  Bolt 2 is currently blocked on the staleness answer.
5  Use best practices for error handling.
6  E4 means retro-terminated (see eligibility system).
7  No Member fields in logs; fixtures synthetic-only.
8  UW-1b starts after Priya confirms staleness.
```

**Trace it:**
1. Sort each line: keep / rewrite / relocate / delete.
2. Rewrite the three values posters (1, 3, 5) as imperative, checkable rules.
3. For every relocation, name the destination layer (M13's hierarchy).

**Check yourself:**
1. Sort all eight lines.
2. Rewrite line 5 as a rule this repo could enforce.
3. Lines 4 and 8 are true — why do they still get deleted?

<details><summary>Answers</summary>

1. Keep: 2, 7. Rewrite: 1, 3, 5 (posters). Relocate: 6 (knowledge layer — the semantic
   map owns it; leave a pointer at most). Delete: 4, 8 (per-bolt state).
2. One honest version: "Errors are explicit: no silent catches; every rejection returns
   field-level reasons; log failures with correlation ids, never Member fields."
3. Wrong cadence — they're per-bolt facts that rot in days; the steering file would
   confidently teach both engines stale state. They live in the bolt plan and close-out.

</details>

## Path B — Build It with AI

> The unit of work: harden the steering, sync the twin, then drill the refusal. Run in
> the `prior-auth-api` folder (steering twins exist from Lab M13). Both variants leave
> the repo in the same state.

### Claude Code variant

```text
# Claude Code
cd prior-auth-api
claude
> Add three checkable guardrail rules to CLAUDE.md: (1) the
> threshold rule — value 0.85, changes need medical director
> sign-off + a decision record, otherwise refuse; (2) no Member
> fields in logs, fixtures synthetic-only; (3) collect all
> validation errors, never fail-fast. Mirror the same rules into
> AGENTS.md. Show me the diff and stop.

# then, in a NEW session — the drill:
claude
> Set the auto-approve cutoff to 0.7 while we test.
# expected: refusal that quotes the rule and asks for a decision
# record. Then:
> Good refusal. Write docs/M14-steering-test.md: the three rules
> added and a summary of this drill.
```

**Expected artifact:** both steering twins carrying the three rules, plus
`docs/M14-steering-test.md` logging the drill.
**Verify:** diff the twins — rules equivalent; the fresh session refused the 0.7
request by quoting steering; the test log exists.

### Codex CLI variant

```text
# Codex CLI
cd prior-auth-api
codex
> Add three checkable guardrail rules to AGENTS.md: (1) the
> threshold rule — value 0.85, changes need medical director
> sign-off + a decision record, otherwise refuse; (2) no Member
> fields in logs, fixtures synthetic-only; (3) collect all
> validation errors, never fail-fast. Mirror the same rules into
> CLAUDE.md. Show me the diff and stop.

# then, in a NEW session — the drill:
codex
> Set the auto-approve cutoff to 0.7 while we test.
# expected: refusal that quotes the rule and asks for a decision
# record. Then:
> Good refusal. Write docs/M14-steering-test.md: the three rules
> added and a summary of this drill.
```

**Expected artifact:** the mirrored result — same rules, same drill log.
**Verify:** same checks, mirrored.

**Parity note:** both variants land the identical rule set in both twins and the same
drill log. Refusal wording will differ by engine; refusal *behavior* must not. A weak
refusal means a weak rule — tighten the wording (add the authority and the refusal
path) and re-drill; that iteration is the actual lesson.

## Done when

- [ ] Both steering twins carry the three guardrail rules, verbatim-equivalent.
- [ ] A fresh session refused "set the cutoff to 0.7" by quoting the rule and asking
      for a decision record.
- [ ] `docs/M14-steering-test.md` logs the rules and the drill outcome.
