# Step 02 — State the intent, pick the scope, get the brief approved

> Runbook section: [02 · Intent and scope](../../multi-repo-feature.html#s2) ·
> Phase 0 Initialization + Phase 1 Ideation · stages 0.1–1.7 · Time: 60–90 minutes

## Goal

Describe the work in one paragraph and let AI-DLC turn it into an approved **initiative
brief**. You'll see three things for the first time:

- the engine creates the intent record by itself;
- it asks questions **in a file**;
- every stage ends at a human gate, with an AI reviewer's findings already on the table.

## Who's in the room

- **Product owner:** owns scope and the final say.
- **UM director:** owns the clock and the outcome.
- **Nurse lead:** owns who is alerted.
- **Compliance lead:** owns the regulatory reading and privacy.
- **Tech lead:** owns feasibility and team.

Running solo, you play every seat. Keep
[`answers/mob-answer-sheet.md`](../answers/mob-answer-sheet.md) open, and put the role
after each answer.

## Do it

Start the engine **at the hub root** (`D:\aidlc-practice\prior-auth-workspace`), never inside a
sibling repo.

```text
# Claude Code: run `claude`, then type
/aidlc --scope enterprise Urgent prior auth requests get a 72-hour determination clock: urgent requests jump the nurse review queue, providers and members are notified when a determination exists, and an at-risk alert fires before the clock runs out. Spans prior-auth-api, prior-auth-web and a new prior-auth-notify service.
```

```text
# Codex CLI: run `codex`, then type
$aidlc --scope enterprise Urgent prior auth requests get a 72-hour determination clock: urgent requests jump the nurse review queue, providers and members are notified when a determination exists, and an at-risk alert fires before the clock runs out. Spans prior-auth-api, prior-auth-web and a new prior-auth-notify service.
```

**Name the scope.** With no `--scope`, AI-DLC v2.11 uses **classic**. Classic skips
Ideation and Operation, which are the stages this feature needs. Enterprise runs all 33
stages at comprehensive depth.

Avoid `%` in the intent text on Windows.

**Answering.** At each question file the engine offers three ways to answer:

1. **Guide me** — up to four questions at a time, in chat.
2. **I'll edit the file** — you fill in `[Answer]:` tags yourself.
3. **Chat** — talk it through and let the engine extract the decisions.

Pick **2** for this step at least once. Open the file in your editor, fill in each `[Answer]:`
with a letter and a reason, add the role in brackets, save, and reply `done`.

At each gate reply in plain words: `Approve`, or `Request Changes: <what and why>`.

## What you'll see

From the reference run. Your wording will differ.

**Initialization runs without a gate.** The engine creates
`aidlc/spaces/default/intents/261011-urgent-auth-clock/` and records all three repos in
`intents.json`:

```json
{ "slug": "urgent-auth-clock", "dirName": "261011-urgent-auth-clock",
  "scope": "enterprise",
  "repos": ["prior-auth-api", "prior-auth-notify", "prior-auth-web"],
  "status": "in-flight" }
```

You never typed `--repos`. The engine found the siblings on disk.

**The question file cites your steering.** The top of `intent-capture-questions.md` lists
its sources. The hub rules you pasted in step 01 are there:

```
- [memory:M1] aidlc/spaces/default/memory/project.md#Forbidden: "NEVER change a rule
  recorded in a repo's docs/decisions.md (e.g. prior-auth-api D-001 ...)"
```

**The engine pushes back when an answer collides with a recorded rule.** In the
reference run, the room said the at-risk alert should carry the request's urgency. The
engine stopped and asked a new question before writing anything:

> In Q12 you said the at-risk alert should carry whether the request is urgent. That
> conflicts with a recorded rule: notices and event payloads carry status and referenceId
> only (prior-auth-api D-003, decided with privacy office review). [...] recorded rules
> can't be changed in this workflow.

The room's answer distinguished notices *to members and providers*, which D-003 covers,
from an alert *to nurses*. It recorded the decision as pending privacy-office
confirmation, with a fallback. See the answer sheet.

**A summary to confirm before anything is generated.** The engine restates every answer
as a list ("Problem and trigger", "Urgency", "Clock start", ...). It asks **Looks correct /
Request changes** before writing `intent-statement.md`. Read it as carefully as the
documents; it is what they will be built from.

**An AI reviewer before the human gate.** At enterprise scope, a product-lead reviewer
agent reads the output and raises numbered findings. The reference run got six:

| ID | Severity | Finding (short) |
|---|---|---|
| R-01 | Major | "Nurses cannot see urgent work today" is stated as fact; no answer said so |
| R-02 | Major | The privacy-office dependency isn't listed as an open question, and there's no fallback |
| R-03 | Major | Standard requests and "clock not started" requests are never measured |
| R-04 | Minor | The rule is already in effect; the text says "will take effect" |
| R-05 | Minor | Jargon with no glossary |
| R-06 | Minor | Nurse lead missing from the stakeholder table |

The engine then gave its own view: it agreed with R-01 and R-02, and said R-03 and R-04
need facts only the humans have.

The room replied **Request Changes** with those facts. The engine recorded them as new
answers Q16–Q19, asked for a fresh confirmation, revised, and sent the result back to the
reviewer.

## Under the hood

- `aidlc-state.md` in the intent folder holds the current phase, stage and status. Open
  it between replies and watch it move.
- `audit/<host>-<clone>.md` gets a row for each human turn (the
  `record-human-turn` hook) and each gate decision. "Who decided" lives here, not in chat.
- `ideation/intent-capture/memory.md` holds the stage's working notes.
- On Claude Code, the status line shows phase · stage · gate. `/aidlc --status` prints the
  same at any time.

## Before you say Approve

- Is every statement in `intent-statement.md` traceable to an answer, a `[desc]`/`[memory]`
  source, or a confirmed assumption? Each line carries a source tag; spot-check three.
- Is each open decision listed with an **owner**?
- Do any of the success metrics allow gaming? For example, a clock that starts "when
  complete" can be met by never marking requests complete.
- Does anything quietly change a recorded rule (D-001, D-002, D-003)?

If you installed the helpers, type `/aidlc-coach` (Claude) or `$aidlc-coach` (Codex) at
any gate for a one-minute briefing on what to check.

## Try this

At the first summary confirmation, reply
`Request changes: the clock starts when the request is received`.
Then watch what happens:
- the engine reopens the question and updates the summary;
- later, the requirements in step 04 inherit the new start time;
- the audit trail records the change.

Change it back, or don't, and see how far the change travels.

## Then: the rest of Ideation (1.2–1.7)

Market research, feasibility, scope definition, team formation and rough mockups follow
the same rhythm: questions, a summary, documents, a review, the gate. Stage **1.7
Approval & Handoff** produces `initiative-brief.md`. That is the go/no-go.

A stage can be skipped. The reference run skipped Market Research (1.2) at the engine's
suggestion: there was nothing to buy, since the clock lives in a repo the team owns.
`ideation/market-research/` holds only `memory.md`, and the brief records "build".

**Rally:** after 1.7 is approved, a human creates the Rally **Feature** from the brief.
AI-DLC does not talk to Rally.

## Files written

All under `aidlc/spaces/default/intents/<id>/`:

- `aidlc-state.md` and `audit/`
- `ideation/intent-capture/`: `intent-statement.md`, `stakeholder-map.md`, `intent-capture-questions.md`
- the rest of `ideation/`: feasibility (with the RAID log), scope document, team, rough mockups, and `approval-handoff/initiative-brief.md`. Build-vs-buy appears only if Market Research runs.

Compare with [`reference-run/hub/aidlc/`](../reference-run/).

## Common snags

- **"Your answer didn't reach AI-DLC. Please give it once more."** A reply was dropped
  between the chat and the engine's state tool. Repeat it. If it happens twice, run
  `/aidlc --doctor`.
- **The engine adds follow-up questions (Q12, Q13, ...).** That's correct behaviour, not a
  loop: your answer opened a new question. Answer it.
- **Enterprise scope is thorough and slow.** Each stage has questions, a summary, a
  review, and a gate. Budget an hour for Ideation. For a quicker first pass, use `feature`
  scope. It runs the same 33 stages at standard depth.
