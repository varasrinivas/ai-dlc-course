# Lab M13 — Sort the memory, then audit the steering chain

> Module: M13 — Context Memory Across the Lifecycle
> Audience: practitioner · Estimated time: 25 min
> Domain: Prior Auth Portal (steering files, decisions.md, semantic map, bolt artifacts)

## Path A — Understand It (no tooling required)

**Artifact:** five statements from the portal program.

```text
S1  "Collect all validation errors; never fail-fast."
S2  "Urgent SLA is 4 hours, including STAT imaging."
S3  "Step 6: reject at intake + write outreach log entry."
S4  "E4 = retro-terminated → ineligible (confirmed: Ortiz)."
S5  "Guardrail-or-PHI changes always run the full pipeline."
```

**Trace it:**
1. Place each statement in its layer: steering / system knowledge / per-bolt.
2. For each, name its change cadence (rarely / per decision / per bolt).
3. Identify which statement is a promotion candidate and what promotion requires.

**Check yourself:**
1. Place all five.
2. S2 started life as an M06 decision — under what condition does it graduate to
   steering?
3. Why must S3 never be in the steering file?

<details><summary>Answers</summary>

1. S1 steering (convention for every change) · S2 system knowledge, promotable ·
   S3 per-bolt (a plan step) · S4 system knowledge (semantic map) · S5 steering
   (workflow rule from M10/M11).
2. When it stops being a fact under review and becomes a rule every future change must
   honor — stable across bolts, referenced by multiple plans; promotion is a reviewed
   steering edit (fig 13.1's up-arrow).
3. Its cadence is wrong: it's true for one unit of work in one bolt. Steering entries
   with per-bolt cadence rot instantly and teach both engines stale rules.

</details>

## Path B — Build It with AI

> The unit of work: audit dual-engine memory, then index it. Whichever engine you run
> verifies the steering chain holds — one set of rules, imported, not duplicated — then
> indexes the whole memory. Both variants leave the repo in the same state. Run in the
> `prior-auth-api` folder.

### Claude Code variant

```text
# Claude Code
cd prior-auth-api
claude
> Read CLAUDE.md and AGENTS.md. Verify the steering chain:
> AGENTS.md holds the rules, CLAUDE.md imports it with
> @AGENTS.md, and no domain rule is restated in both files.
> Report any rule that is duplicated or has drifted. Then
> write docs/M13-memory-index.md: every context artifact in
> this repo (steering files, decisions, semantic map, plans,
> close-outs) with its layer (steering / knowledge / per-bolt),
> its change cadence, and whether it reaches the engine
> mechanically (imported) or contractually (an instruction
> asks for it). Change no code.
```

**Expected artifact:** `docs/M13-memory-index.md` covering all three memory layers, plus a
report confirming each rule lives in exactly one file.
**Verify:** every domain rule lives once, in `AGENTS.md`, and `CLAUDE.md` reaches it by
import; the index lists steering, knowledge, and per-bolt artifacts with cadences and
delivery mode; no code touched. Run `/context` to confirm the decision log really loaded.

### Codex CLI variant

```text
# Codex CLI
cd prior-auth-api
codex
> Read AGENTS.md and CLAUDE.md. Verify the steering chain:
> AGENTS.md holds the rules, CLAUDE.md imports it with
> @AGENTS.md, and no domain rule is restated in both files.
> Report any rule that is duplicated or has drifted. Then
> write docs/M13-memory-index.md: every context artifact in
> this repo (steering files, decisions, semantic map, plans,
> close-outs) with its layer (steering / knowledge / per-bolt),
> its change cadence, and whether it reaches the engine
> mechanically (imported) or contractually (an instruction
> asks for it). Change no code.
```

**Expected artifact:** the same `docs/M13-memory-index.md`, plus the same one-rule-one-file
report.
**Verify:** same checks — and one asymmetry to record honestly: Codex has no import
mechanism, so `docs/decisions.md` reaches it only because `AGENTS.md` asks for it.

**Parity note:** both variants produce the same index against the same steering chain. The
engines differ in one recorded respect: the decision log arrives *mechanically* for Claude
Code (via `@docs/decisions.md`) and *contractually* for Codex (via an instruction). Naming
that difference in the index is part of the deliverable.

## Done when

- [ ] Each domain rule lives in exactly one file — `AGENTS.md` — with `CLAUDE.md`
      reaching it by `@AGENTS.md` import; no rule restated in both.
- [ ] `docs/M13-memory-index.md` names every context artifact with its layer, cadence,
      and whether it arrives mechanically or contractually.
- [ ] No code changed.
