# Step 08 — Design, plan, then generate code into the right repo

> Runbook section: [08 · Construction](../../multi-repo-feature.html#s8) ·
> Phase 3 Construction · stages 3.1–3.5, per unit · Time: 2–4 hours across the two bolts

## Goal

Watch an approved plan become code. For each unit, in order, the engine writes:

1. a functional design;
2. NFR requirements, then NFR design;
3. infrastructure design, where the unit's kind needs it;
4. a **code-generation plan** that you approve before a single line of code.

Then it generates the code into the **owning sibling repo**, never into the hub. A
verified **unit checkpoint** closes each unit.

## Who's in the room

- **The conductor:** you, at the hub.
- **The owning repo lead:** at each plan gate and unit checkpoint. That's the api lead for U1,
  the notify lead for U2, and the web lead for U3.

## Do it

```text
# Claude Code
/aidlc
```

```text
# Codex CLI
$aidlc
```

At each plan gate, run the reviewer **first**:

```text
# Claude Code: ask for the subagent by name
Use the repo-plan-reviewer agent on the open code-generation plan.
```

```text
# Codex CLI
$repo-plan-reviewer
```

Then reply `Approve`, or `Request Changes: <reason>`.

Give each repo the same branch name, and put the Rally ID in each PR title:

| Repo | Branch | PR title | Merge order |
|---|---|---|---|
| prior-auth-api | `feat/urgent-auth-72h` | `US#### api-urgency-clock: ...` | first; additive, backward compatible |
| prior-auth-notify | `feat/urgent-auth-72h` | `US#### notify-service: ...` | after contract v1.1.0 is published |
| prior-auth-web | `feat/urgent-auth-72h` | `US#### web-urgent-queue: ...` | after api is deployed |

## What you'll see

<!-- RUN-QUOTES:08 -->

## Under the hood

- **Plan approval is enforced by a hook, not by goodwill.** AI-DLC's
  `plan-approval-guard` (PreToolUse) blocks code edits in the unit's repo until the plan
  gate is approved. It is the one switch only a human can turn off.
- **The design lives in the hub, the code in the repo.** Design artifacts go to
  `construction/<unit>/<stage>/`. Code goes to the sibling repo, and each git operation is
  anchored to that one repo.
- **The engine reads the repo's own steering when it plans.** Look for the
  **Repo rules honoured** section in `code-generation-plan.md`. It comes from the
  `prior-auth-pack` overlay.
- **The decision-log guard.** If the engine ever tries to edit
  `prior-auth-*/docs/decisions.md`, you get an *ask* prompt from the hook you installed.
  Steering *asks* the engine not to; the hook makes the tool stop.
- **Sensors run as the code is written.** The built-in `type-check` and `linter` sensors
  run on every `.ts` write and leave `SENSOR_PASSED` / `SENSOR_FAILED` rows in `audit/`.

## Before you say Approve (each code-generation plan)

- Does the plan touch exactly one repo?
- Does it cite **D-001** and keep `auto_approves_exactly_at_threshold` green? Does it cite
  **D-003**, with no clinical fields in any event or notice?
- Are the tests named as snake_case sentences that state the rule, for example
  `urgent_sorts_first` and `due_at_is_72h_from_complete`?
- Does U2 or U3 pin the contract version instead of importing api source?
- Does the walking skeleton (U1, first) really stop at "urgency stored and returned"?

## Before you say Approve (each unit checkpoint)

In the owning repo, run the gates yourself and read the real output:

```powershell
cd prior-auth-api      # or prior-auth-notify / prior-auth-web
npm test
npm run typecheck
git log --oneline -5
```

## Try this

At U1's plan gate, reply:

```text
Request Changes: set AUTO_APPROVE_THRESHOLD to 0.80 so urgent requests clear faster
```

The engine should refuse, quote D-001, and say what a real change needs: a recorded
decision with medical director sign-off. That refusal is the steering working. Then
approve the original plan.

## Files written

- In the hub, for each unit, under `construction/<unit>/`: `functional-design/`, `nfr-requirements/`, `nfr-design/`, and
  `code-generation/`. The last holds `code-generation-plan.md`, `code-summary.md`, `traceability.json` and `source-manifest.json`.
- In the repos:
  - `prior-auth-api/src/**` and `prior-auth-api/contracts/*` (U1)
  - `prior-auth-notify/src/**` (U2)
  - `prior-auth-web/src/**` (U3)

## Common snags

<!-- RUN-SNAGS:08 -->
