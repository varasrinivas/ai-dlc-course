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

From the reference run (stages 2.4 and 2.5). Stage 2.4 produced **37 stories in eight
epics**: urgency, the clock, determination, the nurse queue, the at-risk alert, events and
notices, reporting, and an end-to-end scripted run. Each story
was tagged with the unit and repo it would land in, before Units Generation had even run.

**Acceptance criteria you could paste into a test.** For example:

```
### US2.3: Urgent requests are due 72 hours after completion (Must, U1 prior-auth-api)
As Chris (compliance lead), I want an urgent request's due time to be exactly 72 elapsed
hours after completion, so that we meet CMS-0057-F's expedited window.
- AC2.3.2 Given URGENT and completeAt 2026-10-31T08:00:00-04:00 (ET, before the US
  daylight-saving change), then decisionDueAt is ... 2026-11-03T12:00:00Z: 72 elapsed
  hours, not 72 wall-clock hours.
- AC2.3.4 The clock code reads no wall time. A test with a fixed injected clock gives the
  same result whatever the host time zone.
```

**A persona nobody listed.** `personas.md` added *Ivan, Intake Coordinator (new)*: the
person who marks a request complete and so starts the clock. The room's answer that "the
person confirming the documentation" marks it complete implied a role, and the engine
named it.

**The recorded rule beat the runbook's own design.** The runbook draws an "Urgent" badge on
each queue row. prior-auth-web's D-001 says list rows carry reference id, procedure code,
dates and status, and nothing else. The engine read that strictly:

```
### US4.5: See an "Urgent" badge on rows (Could, U3 prior-auth-web, blocked on I-1)
- Note: this story may be planned only if a new recorded prior-auth-web decision, with
  privacy-office sign-off, allows it ...
- AC4.5.1 Without that decision, no row carries urgency in any form: visible text,
  screen-reader-only text, aria-*, title, data-* attributes or a class name. Urgency shows
  through queue order only.
```

The refined mockup followed: *"No badge yet: there is no 'Urgent' badge until I-1 is
settled."* Whether the engine was too strict is a fair argument for the room. Either way,
the place to settle it is a new decision in `docs/decisions.md` with privacy sign-off, not a
question file. That is the steering working as designed.

**Refined mockups are more than pictures.** Stage 2.5 wrote `mockups.md`, plus
`interaction-spec.md`, `accessibility-checklist.md` and `design-system-mapping.md`. The
queue screen's first tab stop is "Skip to queue".

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
- Do the mockups show reference ids only on queue rows (web D-001)? In the reference run,
  this check removed the urgency badge entirely.

## Try this

Ask the engine: `Which acceptance criterion would catch a queue sorted by createdAt
instead of decisionDueAt?` If none would, you've found a missing test before any code exists.

## Files written

- In `inception/user-stories/`: `stories.md`, `personas.md`
- In `inception/refined-mockups/`: the mockups
- Later, after step 07, in `tracking/rally/<intent>/`: `rally-import.csv`, `rally-map.md`

## Common snags

- **Stories reference units before units exist.** Labels like "U1 prior-auth-api" come
  from the scope decided in Ideation. Units Generation (step 06) confirms or changes them.
  Check that the two agree.
- **A design element can vanish because of a recorded rule.** If a mockup is missing
  something you expected, search the stories for "blocked on" and the open items (I-n)
  before you assume the engine forgot it.
