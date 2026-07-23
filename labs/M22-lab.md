# Lab M22 — Route three jobs, then write the policy

> Module: M22 — Choosing & Combining Engines
> Audience: both · Estimated time: 25 min
> Domain: Prior Auth Portal (engine policy; threshold change, rename sweep, determinations epic)

## Path A — Understand It (no tooling required)

**Artifact:** three items in the queue.

```text
W-1  T-102 returns: AUTO_APPROVE_THRESHOLD → 0.82 for imaging
     (approved by the medical director; decision record filed).
W-2  Rename OutreachEvent → OutreachRecord across ~40 files;
     no behavior change intended.
W-3  Kick off the determinations epic — the portal's most
     consequential remaining decomposition.
```

**Trace it:**
1. Route each item: Claude Code, Codex, or both.
2. For each routing, cite the specific module evidence (drill log, asymmetry) that
   justifies it.
3. Note what must be true after W-2 regardless of engine.

**Check yourself:**
1. Route W-1 and defend it.
2. Route W-2 — and what must be true afterward regardless of engine?
3. Route W-3 and name the tax you're accepting.

<details><summary>Answers</summary>

1. To whichever engine has the threshold gate *mechanized* — per your M17 drill log
   that's the PreToolUse hook (Claude Code) unless you've scripted the Codex gate into
   CI; the decision record satisfies the gate either way. Brand answers score zero.
2. Codex full-auto in the sandbox (M19's naming; `--sandbox workspace-write` with
   `--ask-for-approval never` on the current CLI) or CC acceptEdits+hooks both fit — and afterward,
   the union gates run and a human reads the diff summary-free (M21):
   no-behavior-change claims are verified, not believed.
3. Both — the parity experiment: two independent decompositions for the mob. The tax:
   doubled Inception cost and a comparison pass; worth it exactly because this epic is
   the one you least want to slice wrong.

</details>

## Path B — Build It with AI

> The unit of work: write the team's engine policy from your own evidence. Both
> variants produce the same artifact — the policy must pass its own lock-in test. Run
> in the `prior-auth-api` folder.

### Claude Code variant

```text
# Claude Code
cd prior-auth-api
claude
> Read docs/M10-rigor-policy.md and every drill/parity log in
> docs/ (M14, M17, M19, M20, M21). Write docs/M22-engine-policy.md
> with four sections: (1) routing table — each change class to an
> engine + posture, rationale citing the logs; guardrail class
> routes to "whichever engine has the gate mechanized — currently
> [name it from the M17 log]". (2) our run-both patterns and their
> triggers. (3) the drift rule: rules in one file, imported
> rather than duplicated. (4) the lock-in test as a standing bolt-close question.
> No code.
```

**Expected artifact:** `docs/M22-engine-policy.md` — routing table, run-both patterns,
drift rule, lock-in test.
**Verify:** four sections; routing cites actual log evidence; the guardrail row names
an engine because of a drill, not a brand.

### Codex CLI variant

```text
# Codex CLI
cd prior-auth-api
codex
> Read docs/M10-rigor-policy.md and every drill/parity log in
> docs/ (M14, M17, M19, M20, M21). Write docs/M22-engine-policy.md
> with four sections: (1) routing table — each change class to an
> engine + posture, rationale citing the logs; guardrail class
> routes to "whichever engine has the gate mechanized — currently
> [name it from the M17 log]". (2) our run-both patterns and their
> triggers. (3) the drift rule: rules in one file, imported
> rather than duplicated. (4) the lock-in test as a standing bolt-close question.
> No code.
```

**Expected artifact:** the same policy document.
**Verify:** same checks.

**Parity note:** the deepest parity check in the course: the policy about choosing
engines must read identically no matter which engine wrote it. If it doesn't —
if one version quietly favors its author — that's a steering or evidence gap worth
fixing before the capstone.

## Done when

- [ ] `docs/M22-engine-policy.md` exists with all four sections.
- [ ] Every routing decision traces to a log you actually produced in earlier labs.
- [ ] The document would survive your team switching engines next bolt.
