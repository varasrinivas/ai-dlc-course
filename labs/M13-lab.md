# Lab M13 — Sort the memory, then twin the steering

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

> The unit of work: make dual-engine memory physical. Whichever engine you run
> generates the *other* engine's steering twin, then indexes the whole memory. Both
> variants leave the repo in the same state. Run in the `prior-auth-api` folder.

### Claude Code variant

```text
# Claude Code
cd prior-auth-api
claude
> Read CLAUDE.md. Generate AGENTS.md with equivalent steering
> content for Codex CLI — same rules, same guardrails, adapted
> wording only where the engine name matters. Then write
> docs/M13-memory-index.md: every context artifact in this repo
> (steering files, decisions, semantic map, plans, close-outs)
> listed with its layer (steering / knowledge / per-bolt) and
> change cadence. Change no code.
```

**Expected artifact:** `AGENTS.md` (twin of CLAUDE.md) plus `docs/M13-memory-index.md`
covering all three memory layers.
**Verify:** diff the two steering files — every rule present in both; the index lists
steering, knowledge, and per-bolt artifacts with cadences; no code touched.

### Codex CLI variant

```text
# Codex CLI
cd prior-auth-api
codex
> Read AGENTS.md. Generate CLAUDE.md with equivalent steering
> content for Claude Code — same rules, same guardrails, adapted
> wording only where the engine name matters. Then write
> docs/M13-memory-index.md: every context artifact in this repo
> (steering files, decisions, semantic map, plans, close-outs)
> listed with its layer (steering / knowledge / per-bolt) and
> change cadence. Change no code.
```

**Expected artifact:** the mirrored result — `CLAUDE.md` generated from `AGENTS.md`,
plus the same memory index.
**Verify:** same checks, mirrored.

**Parity note:** this lab *is* the parity: after either variant, the repo steers both
engines identically — twin files, rule for rule. Any rule present in one and missing
from the other is the bug this lab exists to prevent.

## Done when

- [ ] Both steering twins exist and agree rule-for-rule (a diff shows only
      engine-name wording).
- [ ] `docs/M13-memory-index.md` names every context artifact with its layer and
      cadence.
- [ ] No code changed — and every remaining lab in this course now runs against a
      dual-steered repo.
