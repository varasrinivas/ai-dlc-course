---
name: rally-draft
description: Drafts a Rally import file and an ID map from the approved AI-DLC units of work, stories and bolt plan. Writes only under tracking/rally/. Never calls a Rally API. Use after Units Generation and Delivery Planning are approved (runbook step 07).
disable-model-invocation: true
---

# Rally draft (runbook steps 05 and 07)

AI-DLC has no Rally or Jira integration. Rally is a reporting mirror that a human updates
at gates; the AI only drafts the import file.

## Rules

- Write only under `tracking/rally/<intent-record>/`. Never edit anything under `aidlc/`.
- Never call any Rally API or network endpoint.
- Use approved artifacts only. If `inception/units-generation/` or
  `inception/delivery-planning/bolt-plan.md` is missing, stop and say which gate is not
  approved yet.

## Steps

1. Find the active intent record: read `aidlc/active-space`, then
   `aidlc/spaces/<space>/intents/intents.json`.
2. Read `inception/units-generation/unit-of-work.md`, `unit-of-work-story-map.md`,
   `inception/user-stories/stories.md`, and `inception/delivery-planning/bolt-plan.md`.
3. Write `tracking/rally/<intent-record>/rally-import.csv` with one User Story per unit of
   work. Use the headers in `tracking/rally/rally-import-template.csv` if it exists;
   otherwise use `Name,Description,Tags,Acceptance Criteria,Iteration,Schedule State`.
   Fill the columns as follows:
   - **Name:** `<unit-name>: <one-line summary>`
   - **Description:** the unit's path in the intent record
   - **Tags:** `repo:<repo>; unit:<unit>; bolt:<n>`
   - **Acceptance Criteria:** the acceptance criteria of the stories mapped to the unit
   - **Iteration:** leave blank
   - **Schedule State:** `Defined`
4. Write `tracking/rally/<intent-record>/rally-map.md`: a table with the columns
   `unit | repo | bolt | Rally ID`, leaving Rally ID blank. The human fills it in after
   importing.
5. Tell the human the two file paths and what to do next:
   - import the CSV in Rally;
   - copy each new Rally ID into `rally-map.md`;
   - put each ID in that repo's PR title, e.g. `US1234 <unit>: ...`.
