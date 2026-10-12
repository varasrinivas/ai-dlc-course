# Walkthrough 04

Stage 2.3 Requirements Analysis, as it ran in the reference workspace. Pair this page with
[step card 04](../steps/04-requirements.md).

## Background

Requirements Analysis is where **Mob Elaboration** happens, the ritual AI-DLC is best known for.
The engine drafts the questions, the room answers them, and every answer lands in a file and in
the audit trail. The stage always runs, whatever the scope.

**The question file is the source of truth.** Questions go into
`requirements-analysis-questions.md` in a fixed shape: lettered options, a mandatory
`X. Other (please specify)`, and an `[Answer]:` tag. You can answer in one of three modes: Guide
Me (the engine asks up to four at a time in chat), edit the file yourself, or chat it through.
Whichever you pick, the file holds the answers. The reference run edited the file and pasted the
answers back in one message, each tagged with the seat that decided it.

**By now the easy questions are gone.** Ideation already settled the 72-hour and 7-day windows,
who sets urgency, the alert recipients and the queue order. So the engine asks only what is still
open, and those are the hard ones: clock edge cases, how events travel, who owns which value.

**Settle ownership between repos here.** For every new value and event, someone must decide which
repo *computes* it, which *stores* it, which *emits* it, and which only *displays* it. Once Units
Generation is approved (step 06), the repo set and unit boundaries are fixed, and a question that
surfaces later costs a revision loop on an approved stage. The prior-auth-pack plugin adds a step
to this stage's instructions that tells the engine to read each repo's `docs/decisions.md` and put
ownership questions up front.

What the reference run decided, in one table:

| Value or event | Owning repo | The others |
|---|---|---|
| `decisionDueAt` | prior-auth-api computes and stores it | web and notify display it, never derive it |
| Queue order | prior-auth-api serves an ordered queue read | web shows rows in that order, never re-sorts |
| `determination.issued`, `sla.at-risk` | prior-auth-api emits them | notify consumes them from a JSON-lines file |

**Requirements are planned against the real code.** Step 03's codekb said prior-auth-api has no
HTTP server. So the options the engine offered were concrete and local: a JSON-lines event file
from api to notify, an at-risk check that takes "now" as an argument so a test can control the
clock, and an export command for reporting.

**The sequence inside the stage** is the same as every v2 stage:

1. questions file written; the room answers;
2. a consolidated summary to confirm ("Looks correct" or "Request changes");
3. `requirements.md` generated, then reviewed by a senior product reviewer agent;
4. a learnings prompt;
5. the gate: **Approve** or **Request Changes**.

**Reviewed artifacts are frozen.** Once the reviewer has read `requirements.md`, the engine cannot
quietly edit it again before you decide. A change has to go through Request Changes and a fresh
review. When you approve with findings still open, the audit records a disposition for each one
("Accepted risk"), with a fingerprint of the finding. Accepting a risk is a decision with your
name on it, not a formality.

## In the reference workspace

### The workspace before this step

After the Practices Discovery gate (turn 042-mob), trimmed to what this stage reads:

```text
D:\aidlc-practice\prior-auth-workspace\aidlc\spaces\default\
  codekb\
    prior-auth-api\  prior-auth-notify\  prior-auth-web\     9 files each
  memory\
    org.md  project.md  team.md                             practices promoted in step 03
  intents\261011-urgent-auth-clock\
    ideation\
      approval-handoff\  decision-log.md  initiative-brief.md  [...]
      feasibility\       raid-log.md  constraint-register.md  [...]
      rough-mockups\     wireframes.md  user-flow.md  [...]
      scope-definition\  scope-document.md  intent-backlog.md  [...]
    inception\
      reverse-engineering\  developer-scan-*.md
      practices-discovery\  team-practices.md  discovered-rules.md  evidence.md  [...]
      requirements-analysis\memory.md
```

### The commands, as typed

No command starts the stage: approving Practices Discovery moved the engine straight into it. The
reference run answered by editing the questions file, then sent all 17 answers in one message,
each with its deciding seat (turn 043-mob, trimmed):

```text
# Claude Code
Q1: A. Completion + exactly 168 elapsed hours, the same arithmetic as urgent and with no time-zone dependency; display in ET only. Compliance confirms this as the regulatory reading before U1's plan (UM director, confirmed by compliance)
Q2: A. On time when issuedAt ≤ decisionDueAt (inclusive), tested at the boundary and 1 ms either side (UM director + compliance)
Q3: A. An explicit "mark complete" action in prior-auth-api records completeAt; the person confirming the documentation performs it, and v1 does not judge documents (UM director)
Q4: A. The first completion fixes the clock for good; a second mark-complete is refused with a typed error and recorded; no restart or pause in v1 (UM director, confirmed by compliance)
Q5: A. prior-auth-api has a "check at-risk" command that takes "now"; it emits once and records alertRaisedAt in the same step; the local run calls it every minute and the scripted run uses the controlled clock (api lead)
[...]
Q7: A. A JSON-lines event file from api; notify validates against its pinned v1.1.0 copy, writes to its own outbox, and is idempotent per event; no source imports (tech lead + notify lead)
[...]
Q10: A. prior-auth-api owns the order and serves an ordered local queue read defined in contract v1.1.0; web shows rows in the order it is given and never re-sorts; the countdown is display only; rows carry the reference id only (prior-auth-web D-001) (api lead + web lead)
Q11: A. api always sends urgency in v1.1.0 and reads pre-existing requests as STANDARD; consumers treat an absent urgency as STANDARD and never fail on it; a contract test pins this in web and notify (api lead)
[...]
Q15: A. U1 adds new entries to prior-auth-api docs/decisions.md numbered from D-005, each naming who decided (compliance for the clock readings); existing entries D-001 to D-003 are untouched, and the web lead fixes the stale I-6 note separately (api lead + tech lead)
Q16: A. Alert in the outbox within 2 minutes of its 24-hour mark and notice within 2 minutes of the determination, proven in the scripted run with the controllable clock (nurse lead + QA lead)
Q17: A. No sign-in in the local run (synthetic data only); authentication, authorization and access audit are written down now as go-live requirements (tech lead + compliance)

Done, all 17 answered.
```

Confirming the summary, with two notes carried into the requirements (turn 044-mob):

```text
# Claude Code
1. Looks correct. Please also carry two notes into the requirements. First, the new C-1 timestamps and the ordered queue read are contract fields only: prior-auth-web list rows still show just the reference id plus the urgency badge and countdown (prior-auth-web D-001), and that should be flagged in U3's plan as well as U1's (web lead). Second, the 168-hour standard reading stays an open item for compliance until they confirm it before U1's plan (compliance lead).
```

The engine caught "the urgency badge" in that note (see below). The room's answer at the learnings
prompt (turn 045-mob):

```text
# Claude Code
1. On the badge: no, the web lead did not mean it is approved. Keep it as open item I-1, a Could, until the web lead records a new web decision with privacy-office sign-off. That decision must not change prior-auth-web D-001. Until then urgency shows through queue order only, as FR5.7 and FR5.8 already say (web lead). We'll ask for the reviewer's seven should-fix items at the approval gate (PO).
```

At the first gate the room chose **Request Changes** and gave the facts for each finding
(turn 046-mob, trimmed):

```text
# Claude Code
Request Changes: fix R-01 to R-07 with these facts, and also address all four notes.
- R-01: Decided rows go in one final group after both the URGENT and STANDARD groups, behind "Show decided requests", newest determination first. prior-auth-api's queue read returns them as that separate final group, after the pending rows. In FR5.6 their Due text is "-". (web lead + nurse lead)
- R-02: A refused second "mark complete" goes in a log entry identified by referenceId only. Add no new stored field and no event. Reword NFR17 so it no longer says the refusal can be rebuilt from the event file or the export. (api lead + compliance)
[...]
- R-08: Remove the made-up 1,000-request figure from NFR16. Make it an open question owned by the UM director, since volume is unknown (raid R-5/A-1). (PO)
[...]
```

At the second gate the room approved and answered the new findings so they carry forward
(turn 047-mob, trimmed):

```text
# Claude Code
1 — Approve. We accept the reviewer's READY verdict. Carry these decisions forward into User Stories and Domain Design:
- R-12: (a). The role goes outside the payload, in the outbox file or folder name, so every notice stays exactly {referenceId, status} under prior-auth-api D-003. We don't add a `role` key. (notify lead, confirmed by compliance)
- R-13: Accepted. The scripted run records the controlled-clock time of each notify call, and the notice gets no time field. (QA lead)
[...]
- R-16: Accepted. A request decided before it becomes complete has no due time, so it counts as neither on time nor late, and the weekly "clock not started" report shows it separately. (UM director, confirmed by compliance)
```

### What the engine showed

The stage opened with 17 questions in groups, leaving out what was already decided (turn 042-mob):

```text
The Requirements Analysis questions are ready for you. There are 17, in `aidlc/spaces/default/intents/261011-urgent-auth-clock/inception/requirements-analysis/requirements-analysis-questions.md`.

I left out everything already decided: the 72-hour and 7-day windows, who sets urgency, the alert recipients, the contract parts, ET display, queue order and the definition of done. The three questions parked for Refined Mockups stay there too: urgency on rows (I-1), the default nurse view and the countdown refresh.
[...]
**Rules and quality, Q15–Q17**
- Where the new clock rules are written down. I suggest numbering them from D-005, because web's stale note (I-6) already refers to a "D-004" in api.
```

One full ownership question from the file, with its options (`requirements-analysis-questions.md`):

```text
### Q10. Who decides the queue order, and how does prior-auth-web get the queue in the local run?

Context: the order is decided (urgent first, then due date, then "clock not started", ties by referenceId; decided rows newest determination first). prior-auth-api has no HTTP server today, and prior-auth-web reads data the way the web codekb describes.

A. prior-auth-api owns the order and serves a small local read of the queue (C-1 rows, already ordered), defined in contract v1.1.0. prior-auth-web shows rows in the order it is given and never re-sorts. The countdown is display only: decisionDueAt minus the screen's current time.
B. prior-auth-api publishes C-1 only; prior-auth-web sorts by the recorded order rule
C. prior-auth-web reads a contract-shaped JSON file of synthetic requests (no live link in v1), in the order api produced
X. Other (please specify)

[Answer]: A. prior-auth-api owns the order and serves an ordered local queue read defined in contract v1.1.0; web shows rows in the order it is given and never re-sorts; the countdown is display only; rows carry the reference id only (prior-auth-web D-001) (api lead + web lead)
```

Before writing anything, the engine played the answers back and flagged where they grow the
contract (turn 043-mob, trimmed):

```text
**Which repo owns what**
- **Events:** prior-auth-api writes them to a JSON-lines event file. prior-auth-notify checks each one against its pinned v1.1.0 copy and writes it to its outbox once.
- **Recipients:** prior-auth-notify addresses by role (nurse and supervisor for alerts; provider and member for notices). No payload gets a recipient field (prior-auth-api D-003).
[...]
Two of your answers grow contract v1.1.0 beyond C-1 to C-3:
- the ordered queue read (Q10) is a new part of the contract;
- C-1 gets four new timestamp fields (Q12, Q13).

The team rules say every new contract field must be flagged in U1's plan, so I'll call them out there.

Does this all look correct before I generate the requirements artifact?
```

It refused to treat a passing phrase as a decision against a recorded rule (turn 044-mob):

```text
**1. Your web note mentioned "the urgency badge" on rows.** The badge isn't allowed yet. prior-auth-web D-001 lists what a row may show: reference, procedure, dates and status. Urgency isn't on that list. So the badge is still I-1: a Could that needs a recorded web decision, with privacy-office sign-off, before Refined Mockups.
[...]
If the web lead meant the badge is now approved, that needs the recorded decision first.
```

The reviewer's findings, as the engine relayed them (turn 044-mob, trimmed). Note R-08: the engine
flagged its own made-up number:

```text
**2. The reviewer's findings.** Nothing blocking, but seven should-fix items:
- **Decided rows (FR5.3):** I placed them inside each urgency group. The wireframes put them in a final group after all pending rows, newest first, with "-" in the Due cell. That's my error and a clear fix.
- **Export columns (FR9.2):** it says "six times", but the answers list five. Also a clear fix.
[...]
There are also four notes:
- The 1,000-request capacity figure (NFR16) is my placeholder, not a human decision.
- A second determination of an already-decided request isn't covered.
```

The same finding in the reviewer's own file (`reviews\review-01.md`):

```text
**Verdict:** READY
**Reviewer:** aidlc-product-lead-agent
[...]
| R-08 | note | requirements.md > NFR16 and Assumptions | The figure of 1,000 open requests was not decided by any human. It is labelled [assumption], and its source is raid R-5/A-1, which say volume is unknown. It is testable, but it adds a requirement the answers do not contain. | Keep it only if the gate approves it. Otherwise reword it as an open question for the UM director. | New |
```

The first gate prompt (turn 045-mob):

```text
**Review:** marked ready, with 7 should-fix items (R-01 to R-07) and 4 notes (R-08 to R-11), as listed above. You said you'd ask for the seven should-fix items here. To do that, choose Request Changes. Say whether you also want any of the notes addressed, especially R-08, the 1,000-request figure I made up.

How would you like to proceed?

1. **Approve**: continue to User Stories with the findings accepted as they are
2. **Request Changes**: I fix the listed items, the reviewer checks again, and you see the gate again
```

After the fixes, the re-review found two new should-fix items that only a human could settle
(turn 046-mob, trimmed):

```text
**The reviewer found 2 new should-fix items.** Both come from closing the notice to exactly {referenceId, status}, and both need your decision rather than mine:
- **R-12, where the role lives.** FR8.1 and FR8.2 address each outbox entry to a role (provider, member, assigned nurse, supervisor). The closed notice has no field to hold that role. The options are:
  - (a) carry the role outside the payload, for example in the outbox file or folder name, so the notice stays exactly {referenceId, status};
  - (b) make `role` the one flagged metadata key, for compliance review under prior-auth-api D-003.
[...]
How would you like to proceed?

1. **Approve**: continue to User Stories, with R-12 to R-16 left open as they are
2. **Request Changes**: tell me your choice for R-12 (a or b), and I'll fix R-12 to R-16 and send it back for review
```

The audit trail shows the review freeze stopping a late edit six seconds before the approval, then
the approval with a disposition for each of the 16 findings (9 should-fix, 7 notes, all
"Accepted risk") (`audit\varalaptop-d3e03ad83f38.md`, trimmed):

```text
## Review Freeze Blocked
**Timestamp**: 2026-10-11T11:33:20Z
**Event**: REVIEW_FREEZE_BLOCKED
**Tool**: Edit
**Target**: <project-dir>\aidlc\spaces\default\intents\261011-urgent-auth-clock\inception\requirements-analysis\requirements.md
**Stage**: requirements-analysis

---

## Gate Approved
**Timestamp**: 2026-10-11T11:33:26Z
**Event**: GATE_APPROVED
**Stage**: requirements-analysis
**User Input**: Approve
**Review Finding Dispositions**: {"version":1,"dispositions":[{"artifact":"aidlc/spaces/default/intents/261011-urgent-auth-clock/inception/requirements-analysis/requirements.md","id":"R-01","fingerprint":"sha256:115729b5e435b700f7005965804f342c6946611d4237aed9c9de28dab7ec3121","status":"Accepted risk","decided_at_severity":"should-fix","reviewed_record":{"path":".aidlc-engine/reviews/requirements-analysis/stage/f42c3e1204f4f508/1.json", [...]
```

### The workspace after this step

```text
intents\261011-urgent-auth-clock\inception\
  requirements-analysis\
    requirements-analysis-questions.md   243 lines: Q1-Q17, answers, confirmed summary
    requirements.md                      228 lines: FR1-FR10, NFR1-NFR17, open questions
    reviews\
      review-01.md                       R-01 to R-11
      review-02.md                       re-check of R-01 to R-11, new R-12 to R-16
  gate-decisions.md                      created at the User Stories gate; holds the R-12 to R-16 answers
intents\261011-urgent-auth-clock\audit\varalaptop-d3e03ad83f38.md   new rows
```

The R-12 to R-16 answers given at this gate can't go into the frozen `requirements.md`. They first travelled in
`user-stories\user-stories-assessment.md`; at the User Stories gate the engine moved them into
`inception\gate-decisions.md`, a ledger every later stage reads alongside the approved documents:

```text
| R-12 | The recipient role goes outside the payload, in the outbox file or folder name. Every notice stays exactly {referenceId, status}. No `role` key. | Notify lead, confirmed by compliance |
| R-13 | The scripted run records the controlled-clock time of each notify call as the outbox entry time for NFR1 and NFR2. The notice gets no time field. | QA lead |
```

An excerpt of `requirements.md`. Every row names one owning repo, a testable criterion, and its
source answer or finding:

```text
Ownership key: **Computes** means it decides the value. **Stores** means it is the system of record. **Emits** means it publishes the value. **Displays/consumes** means it only reads the value.
[...]
### FR3: The determination clock

| ID | Requirement | Owner | Acceptance criterion | Source |
|----|-------------|-------|----------------------|--------|
| FR3.1 | For an URGENT request, decisionDueAt = completeAt + exactly 72 elapsed hours. | prior-auth-api computes and stores | Given completeAt = 2026-10-11T12:00:00Z, then decisionDueAt = 2026-10-14T12:00:00Z. This holds across a daylight-saving change. | [intent] [Q1] |
| FR3.2 | For a STANDARD request, decisionDueAt = completeAt + exactly 168 elapsed hours (7 × 24), with no time-zone arithmetic. Compliance must confirm this reading before U1's plan (see Open Questions, OQ-1). | prior-auth-api computes and stores | Given completeAt = 2026-11-01T04:30:00Z, a day on which US daylight saving ends, then decisionDueAt = 2026-11-08T04:30:00Z. | [Q1] [confirm-note] |
| FR3.3 | decisionDueAt is computed only in prior-auth-api. prior-auth-notify and prior-auth-web display the value they receive and never derive it. | prior-auth-api computes; others display | No consumer code computes a due time from completeAt. The plans for U2 and U3 name the field as display-only. | [repo] (prior-auth-notify AGENTS.md) [practices] |
| FR3.4 | A determination is on time when determinedAt ≤ decisionDueAt (inclusive), and late otherwise. | prior-auth-api | Tests cover determinedAt = decisionDueAt (on time), decisionDueAt − 1 ms (on time) and decisionDueAt + 1 ms (late), for both urgencies. | [Q2] [practices] |
| FR3.5 | Clock code never reads wall time. "Now" is passed in through an injected clock. | prior-auth-api | Domain services contain no direct wall-time reads. Every clock test supplies fixed instants with an explicit offset. | [practices] |
```

<!-- not captured: the Guide Me mode; the reference run answered by editing the file -->
