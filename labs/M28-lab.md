# Lab M28 — Check the promise, then close the program

> Module: M28 — Operations: Ship & Evolve the Portal
> Audience: practitioner · Estimated time: 35 min
> Domain: Prior Auth Portal (program rollout, promise dashboards, program close-out)

## Path A — Understand It (no tooling required)

**Artifact:** the pilot-week excerpt from the program close-out.

```text
PROMISE TABLE (pilot week 1)
  turnaround, auto-approvable   3.1h    target <24h   base 4.2d
  below-threshold skips         0 fires target 0      (alarm)
  urgent SLA (4h)               100%    one near-miss 3h40m

INCIDENT  notification retries → undeliverable address loop.
  Traced via audit walk in 40 min. Fix + new test:
  caps_delivery_retries_then_routes_outreach. Learning logged.

GUARD  claims-intake team (similar backlog, unchanged process):
  6% improvement this quarter. Portal delta stands on its own.
```

**Trace it:**
1. Match each promise-table row to the intent clause it answers.
2. Walk the incident: what made a 40-minute trace possible?
3. Identify the M04 counterfactual guard and what it defends against.

**Check yourself:**
1. Which intent clause does each row answer, and which number is the CMO's?
2. Why does the near-miss count as a learning rather than a pass?
3. What does the 6% line protect the team from?

<details><summary>Answers</summary>

1. Turnaround answers the headline clause; the skip-alarm answers the guardrail
   clause ("no determination below threshold skipping nurse review") — and
   zero-fires is the CMO's number because it's the one with a member's care behind
   it.
2. 3h40m against a 4h promise is 20 minutes of margin on a clinical SLA — the
   close-out records *why* it got close (queue depth at shift change) so bolt cycle
   2 can fix the cause, not celebrate the save.
3. M04's trap: "wouldn't this team have sped up anyway?" A 6% counterfactual against
   a 97% reduction means the delta survives a hostile CFO — the guard was designed
   in before bolt 1, which is the only time it can be.

</details>

## Path B — Build It with AI

> The unit of work: write the program close-out — the capstone chain, curated. Both
> variants produce the same artifact from the same engine-neutral chain. Run in the
> `prior-auth-api` folder.

### Claude Code variant

```text
# Claude Code
cd prior-auth-api
claude
> Write the program close-out. Read the ENTIRE docs/ chain, then
> create docs/M28-program-close.md with five sections: (1) what
> shipped — the four bolts, one line each, citing their close-out
> files; (2) the promise table — each intent clause → its measure
> → pilot placeholder → target; (3) the decision register — every
> HUMAN-DECIDED and parked-then-closed item with its artifact
> link; (4) learnings, including the notification-retry incident
> pattern; (5) next-cycle backlog: provider visibility UI
> (prior-auth-web), quarterly criteria updates as a rigor-classed
> process, and the E7 flag (F-1) with an owner. Cite at least six
> docs/ files by name. No code.
```

**Expected artifact:** `docs/M28-program-close.md` — five sections, ≥6 citations, a
decision register that traces, a next-cycle backlog with owners and rigor classes.
**Verify:** every register entry links to a real file; the promise table maps every
intent clause; no code changed.

### Codex CLI variant

```text
# Codex CLI
cd prior-auth-api
codex
> Write the program close-out. Read the ENTIRE docs/ chain, then
> create docs/M28-program-close.md with five sections: (1) what
> shipped — the four bolts, one line each, citing their close-out
> files; (2) the promise table — each intent clause → its measure
> → pilot placeholder → target; (3) the decision register — every
> HUMAN-DECIDED and parked-then-closed item with its artifact
> link; (4) learnings, including the notification-retry incident
> pattern; (5) next-cycle backlog: provider visibility UI
> (prior-auth-web), quarterly criteria updates as a rigor-classed
> process, and the E7 flag (F-1) with an owner. Cite at least six
> docs/ files by name. No code.
```

**Expected artifact:** the same close-out.
**Verify:** same checks.

**Parity note:** the close-out should read near-identically from either engine,
because it's built entirely from engine-neutral artifacts — the course's thesis,
verified one last time on its largest document.

## Done when

- [ ] `docs/M28-program-close.md` exists with all five sections and ≥6 citations by
      filename.
- [ ] The decision register traces every consequential decision to its artifact.
- [ ] The next-cycle backlog carries owners and rigor classes — the document opens
      cycle 2's Inception, onboards the next engineer, and answers the next auditor.
