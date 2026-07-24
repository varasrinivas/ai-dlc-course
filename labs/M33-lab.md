# Lab M33 — Critique a migration plan, then convert a sprint story

> Module: M33 — Migrating a Sprint Team
> Audience: both · Estimated time: 30 min
> Domain: Prior Auth Portal (sprint→bolt migration; provider-visibility squad, prior-auth-web)

## Path A — Understand It (no tooling required)

**Artifact:** a migration plan for the provider-visibility squad. Find the three moves
that will stall it.

```text
MIGRATION — provider-visibility squad (prior-auth-web)
  Bolt 1  Re-architect the legacy provider-lookup module
          (brownfield, 3 subsystems) — "start with the
          hard one to prove it works."
  Cadence Keep the daily standup and the two-week sprint
          board through bolt 3, "for safety."
  Metric  Compare bolt story-point velocity to last
          sprint's; green-light rollout if it beats it.
  Decider Marta, but she stays on her old sprint team
          full-time until migration "proves out."
```

**Trace it:**
1. Rate the bolt-1 choice against M10's adaptive-rigor test.
2. Name the ceremonies being kept and what should replace them (M29).
3. Decide what breaks when the decider isn't on call.

**Check yourself:**
1. Why is that a bad first bolt?
2. Which two habits are being kept that should be starving?
3. What breaks when the decider isn't on call?

<details><summary>Answers</summary>

1. It is the highest-risk unit in the estate — brownfield, three subsystems, exactly the
   M10 profile that needs semantic context and maximum rigor. Bolt 1 should teach the
   loop on a low-risk, well-understood unit; a hard first bolt makes the team blame the
   method for the difficulty.
2. The daily standup and the sprint board as system-of-record — kept "for safety," they
   hand the team both operating systems' overhead; they should starve (M29), not be
   scheduled.
3. Everything: a decider who is not on call means bolts stall at the first deferred
   decision, re-importing the sprint's batch latency and proving the method "slow" for
   the wrong reason. Marta needs the delegation ladder (M29) and calendar protection, not
   a part-time seat.

</details>

## Path B — Build It with AI

> The unit of work: convert one real Jira story into a bolt's Inception artifact — the
> migration mechanic, done once for real. Both variants produce the same artifact. Run in
> the `prior-auth-api` folder.

### Claude Code variant

```text
# Claude Code
cd prior-auth-api
claude
> Here is a Jira story: "As a provider I want to see why an
> auth is pending so I can act on it." Treat it as a bolt intent.
> Restate it in one line, then run Inception: slice it into 2-4
> units of work, and for each write testable, traceable
> acceptance criteria that name the rule they serve. Flag any
> dependency between units (one consuming another's output) and
> say whether you would serialise or stub it. Park any unknown
> with an owner. Write docs/M33-migration-inception.md. No code.
```

**Expected artifact:** `docs/M33-migration-inception.md` — an intent restatement, 2-4
units of work, testable and traceable acceptance criteria, at least one flagged
dependency with a serialise-or-stub call. No code.
**Verify:** the story became an intent plus 2-4 units of work; every acceptance clause
names its rule; at least one dependency is flagged; no code files.

### Codex CLI variant

```text
# Codex CLI
cd prior-auth-api
codex
> Here is a Jira story: "As a provider I want to see why an
> auth is pending so I can act on it." Treat it as a bolt intent.
> Restate it in one line, then run Inception: slice it into 2-4
> units of work, and for each write testable, traceable
> acceptance criteria that name the rule they serve. Flag any
> dependency between units (one consuming another's output) and
> say whether you would serialise or stub it. Park any unknown
> with an owner. Write docs/M33-migration-inception.md. No code.
```

**Expected artifact:** the same `docs/M33-migration-inception.md`, steered by AGENTS.md.
**Verify:** same checks. The slicing will differ from Claude Code's; the artifact's
structure — intent, units of work, traceable criteria, a flagged dependency — must not.

**Parity note:** both engines convert the same sprint story into the same kind of bolt
Inception artifact. Different slicing is fine and instructive; the structure — intent,
units of work, criteria that name their rule, a flagged dependency — is the deliverable.

## Done when

- [ ] `docs/M33-migration-inception.md` holds one sprint story converted to a bolt
      Inception: intent, 2-4 units of work, testable/traceable criteria.
- [ ] At least one cross-unit dependency is flagged with a serialise-or-stub call.
- [ ] You can point at how each piece would remap the Jira board (epic→bolt,
      story→unit of work, criteria→M06 criteria).
