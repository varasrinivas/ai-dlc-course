# Step 05 — Write the user stories, then mirror the work into Rally

> Runbook section: [05 · Stories → Rally](../../multi-repo-feature.html#s5) ·
> Phase 2 Inception · stages 2.4 User Stories, 2.5 Refined Mockups ·
> Time: 30–45 minutes

## Goal

See a **mob of agents** at work: design, developer and quality agents draft stories
together. Then learn the boundary AI-DLC draws around tools it doesn't own. Rally (or
Jira) is a **mirror** a human updates at gates, never the source of truth.

## Who's in the room

- **Product owner:** approves the stories.
- **web lead and nurse lead:** approve the refined mockups.
- **Scrum master or PO:** imports to Rally later, in step 07.

## Do it

Resume (`/aidlc` or `$aidlc`) and work the two gates.

The Rally part happens **after step 07**, once units and the bolt plan are approved. If
you installed the helpers, type:

```text
# Claude Code
/rally-draft
```

```text
# Codex CLI
$rally-draft
```

Without the helper, paste the runbook's step-05 prompt instead. It reads the approved
artifacts and writes `tracking/rally/<intent>/rally-import.csv` and `rally-map.md`. It
never calls a Rally API. Then you import the CSV into Rally by hand, and copy the new IDs
into `rally-map.md`.

| AI-DLC gate (human) | Rally ScheduleState |
|---|---|
| 2.7 units + 2.9 bolt plan approved | Defined, with an iteration |
| 3.5 code-generation plan approved for the unit | In-Progress |
| Unit checkpoint approved | Completed |
| 3.6 Build and Test approved + PO acceptance | Accepted |

## What you'll see

<!-- RUN-QUOTES:05 -->

## Under the hood

- 2.4 runs as a **mob**: several agents draft and critique before you see anything.
  Run `/aidlc-replay` afterwards to see who did what.
- `personas.md` is built from the stakeholder map you approved in step 02. A persona you
  don't recognise came from somewhere; trace it.

## Before you say Approve

- Does each story name a persona from `personas.md`?
- Is every acceptance criterion testable? "Shows due time" is weak. "Shows 'Due in 41h' for a
  request due 41 hours from now" is testable.
- Does every story fit in one repo? A story that needs api *and* web is fine at this
  stage, but units (step 06) will have to split the work.
- Do the mockups show reference ids only on queue rows (web D-001)?

## Try this

Ask the engine: `Which acceptance criterion would catch a queue sorted by createdAt
instead of decisionDueAt?` If none would, you've found a missing test before any code exists.

## Files written

- In `inception/user-stories/`: `stories.md`, `personas.md`
- In `inception/refined-mockups/`: the mockups
- Later, after step 07, in `tracking/rally/<intent>/`: `rally-import.csv`, `rally-map.md`

## Common snags

<!-- RUN-SNAGS:05 -->
