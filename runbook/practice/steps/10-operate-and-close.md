# Step 10 — Deploy in contract order, watch the clock, copy decisions back

> Runbook section: [10 · Operate and close](../../multi-repo-feature.html#s10) ·
> Phase 4 Operation · stages 4.1–4.7, then close-out · Time: 45–60 minutes

## Goal

Operation is where the record proves its value. You will:

1. **Deploy in contract order**: api, then notify, then web.
2. **Define the SLO and the alarm** that guard the 72-hour clock.
3. **Close out**: copy each decision that constrains a repo into that repo's own
   `docs/decisions.md`, so it outlives the feature.

**This practice run has no cloud.** "Deploy" means:

- build and test each repo in order;
- run the local smoke path;
- record it in `deployment-log.md` as a local run.

The engine will ask about environments and infrastructure. The answer is "local only:
document what production would need, provision nothing".

## Who's in the room

- **Release owner:** approves each deploy.
- **On-call:** owns the incident runbook.
- **UM director:** owns the SLO.
- **Tech lead and PO:** close-out.

## Do it

Resume (`/aidlc` or `$aidlc`) and work the Operation gates. Then do the close-out by
hand, or ask the engine to do it at the hub:

```text
# Claude Code or Codex CLI, at the hub
Copy each ADR from the intent's inception/domain-design/decisions.md that constrains a
repo into that repo's docs/decisions.md as a new numbered entry, linking back to the
intent path. Append only; never edit an existing entry.
```

With the decision-log guard installed, Claude Code asks you to confirm each edit to a
`decisions.md`. That's the hook doing its job. Approve the appends; refuse anything that
rewrites an existing entry.

Finally:

```powershell
git add -A; git commit -m "close-out: urgent-auth-clock"     # in the hub
# and in each repo that received a decision
```

In Rally, the Feature moves to **Accepted**.

## What you'll see

<!-- RUN-QUOTES:10 -->

## Under the hood

- Operation's seven stages are conditional. Enterprise scope runs all of them, each in
  its own folder:
  - `operation/deployment-pipeline/`
  - `operation/deployment-execution/`
  - `operation/observability-setup/`
  - `operation/incident-response/`
  - and the rest.
- `/aidlc-session-cost` and `/aidlc-outcomes-pack` summarise the whole run. The second one
  writes `OUTCOMES.md`, a shareable record of what was built and decided.
- The intent stays in the hub, and `intents.json` marks it complete. The next feature that
  touches prior-auth-api reuses `codekb/prior-auth-api/` if the code hasn't moved past it.

## Before you say Approve

- Deploy order: api first. Its change is additive, so the old web and notify keep working.
- The SLO is measured from "request complete", the same start as the requirement. A
  different start would make the SLO measure something else.
- Does `runbooks.md` say what on-call does when `sla.at-risk` fires: who looks, what they
  check, when they escalate?
- Close-out: is each copied decision **new** (D-005 and up in api), with a link back to the
  intent path?

## Try this

Run `/aidlc-outcomes-pack` (Claude) or `$aidlc-outcomes-pack` (Codex) and read
`OUTCOMES.md` as if you were the medical director. Can you tell, without opening any code,
that D-001 never moved? If not, that's feedback for the method file.

## Files written

- In `operation/`:
  - `deployment-pipeline/rollback-runbook.md`
  - `deployment-execution/deployment-log.md`
  - `observability-setup/slo-config.md`
  - `incident-response/runbooks.md`
- In the repos: new entries in `prior-auth-api/docs/decisions.md` and `prior-auth-notify/docs/decisions.md`

## Common snags

<!-- RUN-SNAGS:10 -->
