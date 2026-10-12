# Walkthrough 05

Stages 2.4 User Stories and 2.5 Refined Mockups, as they ran in the reference workspace. Pair this
page with [step card 05](../steps/05-stories-and-rally.md).

## Background

With requirements approved, the engine turns them into the stories a team will build and test
against, and then pins down the one screen this feature changes: the nurse queue.

**2.4 User Stories runs as a mob of agents.** The engine first decides whether stories are worth
writing at all, and records why in `user-stories-assessment.md`. Then it asks a few planning
questions, drafts personas and stories, and hands the draft to three agents who review it
independently: a designer, a developer and a quality engineer. Their objections come back to you
as a second round of questions, and a senior product reviewer gives the final verdict before the
gate. You see the mob's work only after the agents have argued about it.

**Stories carry acceptance criteria you can paste into a test.** Each one is "As a ..., I want ...,
so that ...", with numbered Given/When/Then criteria. In the reference run the room asked for one
story per clock rule, with every boundary (72 h, 168 h, the inclusive deadline, ±1 ms) as its own
criterion. Each criterion maps to one deterministic test.

**Personas come from the approved stakeholder map, plus what your answers imply.** If you answer
"the person confirming the documentation marks the request complete", the engine asks who that is
and names the role. A persona you don't recognise came from somewhere; trace it.

**Stories are labelled with units before units exist.** Labels like "U1 prior-auth-api" come from
the scope decided in Ideation. Units Generation (step 06) confirms or changes them. One story,
one owning repo, matches "one unit = one repo".

**2.5 Refined Mockups turns rough wireframes into specifications.** The output is more than
pictures: `mockups.md`, `interaction-spec.md`, `accessibility-checklist.md` and
`design-system-mapping.md`. In the reference run this stage was also a hard gate for U3: the
exact Due-cell text had to be settled here before prior-auth-web's plan could start.

**Recorded rules beat the design.** prior-auth-web D-001 says list rows carry reference, procedure,
dates and status. The rough wireframes drew an "Urgent" badge on rows. No web decision with
privacy-office sign-off was recorded, so the badge became Won't for v1 and urgency shows through
queue order only. The place to change that is a new entry in `docs/decisions.md`, not a question
file.

**Approved documents are locked, so a ledger carries gate decisions.** Answers given at a gate,
in reply to reviewer findings, can't be written into a frozen artifact. The engine keeps them in
`inception/gate-decisions.md`, and every later stage reads it alongside the approved documents.
Where they differ, the ledger wins.

**Rally is a mirror, not a source of truth.** AI-DLC does not connect to Rally or Jira. After
step 07 (units and bolt plan approved), a helper drafts an import CSV and a map file, a human
imports it, and the Rally IDs come back into `rally-map.md`. Rally IDs never get hand-edited into
approved artifacts.

| AI-DLC gate (human) | Rally ScheduleState |
|---|---|
| 2.7 units + 2.9 bolt plan approved | Defined, with an iteration |
| 3.5 code-generation plan approved for the unit | In-Progress |
| Unit checkpoint approved | Completed |
| 3.6 Build and Test approved + PO acceptance | Accepted |

## In the reference workspace

### The workspace before this step

After the Requirements Analysis gate (turn 047-mob), trimmed:

```text
D:\aidlc-practice\prior-auth-workspace\
  tracking\rally\rally-import-template.csv
  aidlc\spaces\default\
    codekb\  prior-auth-api\  prior-auth-notify\  prior-auth-web\
    memory\  org.md  project.md  team.md
    intents\261011-urgent-auth-clock\
      ideation\
        intent-capture\   stakeholder-map.md  [...]
        rough-mockups\    wireframes.md  user-flow.md  [...]
        [...]
      inception\
        reverse-engineering\  [...]
        practices-discovery\  [...]
        requirements-analysis\
          requirements-analysis-questions.md
          requirements.md
          reviews\  review-01.md  review-02.md
        user-stories\memory.md
        refined-mockups\memory.md
```

### The commands, as typed

Approving requirements moved the engine straight into User Stories. The four planning answers
(turn 048-mob):

```text
# Claude Code
Q1: A. In UM operations, a non-clinical intake coordinator confirms the documents have arrived. That keeps completeness separate from clinical review, and v1 still makes no judgement about the documents (UM director, confirmed by nurse lead).
Q2: A. Group by capability with one owning repo per story, so it matches one unit = one repo. The cross-repo journey goes in the end-to-end group traced to the scripted run that the QA lead owns (tech lead).
Q3: A. One story per rule, with every boundary as its own acceptance criterion: 72h, 7 calendar days, the inclusive deadline, ±1 ms, "clock not started", second completion, second determination and a decision before completion. Each criterion then maps one to one to a deterministic api test (QA lead + api lead).
Q4: A. Write each one from the person who benefits: the nurse and supervisor for the at-risk alert, the provider and member for notices, the UM director and compliance for the export. The command goes in the criteria. [...]

Done. Please draft the stories.
```

The answers to the mob's nine follow-up questions (turn 050-mob, trimmed):

```text
# Claude Code
Q5: A. prior-auth-web D-001 already allows dates on list rows. The web lead records a new web decision that adds `decisionDueAt` and `determinedAt` as date fields before U3's plan, and D-001 stays as written. The privacy office reviews it if the web lead asks (web lead)
[...]
Q8: A. Only an absent field counts as missing, which keeps old clients working. Urgency values are case-sensitive and must be exactly URGENT or STANDARD. `null`, `""` and anything else is rejected with a typed error and is never quietly turned into a default (api lead)
Q9: A. Use one event file per event type. The duplicate-check key is event type plus referenceId. This adds no payload field, so prior-auth-api D-003 is not touched (notify lead + compliance)
[...]
Q13: X. Consumers should ignore unknown fields, not reject them. The contract only grows by adding fields, and the deploy order is api → notify → web, so a later minor version must not break consumers that pin v1.1.0. [...]

Done. All nine answers are filled in.
```

The User Stories gate, approving with the two should-fix items answered (turn 053-mob, trimmed):

```text
# Claude Code
1. Approve. The verdict is READY and only should-fix items and notes are open. Carry these forward:

R-01: Drop `determinedAt` from the web row model (AC4.2.2 and the Q5 precondition). No story uses it, and widening `AuthRequestSummary` would need a recorded web decision under prior-auth-web D-001. If a later story needs it, it comes back as a new web decision with privacy-office review. (web lead)

R-02: The api lead owns the omit-versus-STANDARD choice, with the notify lead consulted, because prior-auth-api computes and emits `sla.at-risk`. [...]

Notes R-03 to R-10 are accepted as-is to carry forward. R-03 is a hard gate: U3's plan does not start until the Due-text literals are written into US4.3 at Refined Mockups. [...] (PO)
```

Refined Mockups answers (turn 054-mob, trimmed):

```text
# Claude Code
Q1: A. Views A and B show the same rows in v1, so the web Open question stays open in prior-auth-web's decision log until a nurse-review status exists; no web decision is recorded now (web lead + nurse lead)
Q2: A. No prior-auth-web decision with privacy-office sign-off exists, so the badge is Won't for v1 and urgency shows through queue order only. I-1 stays open with the web lead and the privacy office. If a later decision approves it, the badge text is "Urgent" (web lead, confirmed by compliance)
Q3: A. Rounding down is never early and never claims more time than is left. "Due now (at risk)" at exactly decisionDueAt matches FR3.4's inclusive deadline. [...]
Q4: A. Two different deadlines must never read the same. EDT/EST only inside the repeated hour, "ET" everywhere else, and a test covers 2026-11-01T05:30Z and 06:30Z (web lead)
[...]
Q10: A. Rows have no action in v1, so the tab stops are "Skip to queue", "Show decided requests", and "Try again" in the Error state. Rows are read through table navigation (web lead)

Done. All 10 answered; Q3–Q5 settle the Due text for U3's plan.
```

The Refined Mockups gate (turn 057-mob, trimmed):

```text
# Claude Code
1. Approve. We accept all of the review's findings. Please fold R-01 to R-05 in as written: correct the impossible sample dates on Screen 1 (R-01); add the repeated-hour (fall-back) edge instants to the Due-text table (R-02); [...] R-06: darken the Approved badge to at least 4.5:1 against its background. U3's plan names the exact shade, and A5 checks it as a test. We are not keeping 3.7:1 (web lead). [...] The badge stays Won't for v1, and I-1 and OQ-5 stay open as recorded (PO).
```

The other replies at this step were `1. Looks correct ...` at each summary (turns 049, 051, 055)
and a bare `1` at each learnings prompt (turns 052, 056).

<!-- not captured: /rally-draft output. It runs after step 07; in the reference hub, tracking\rally\ holds only rally-import-template.csv -->

### What the engine showed

The stage opened by deciding that stories were worth writing, and why (turn 047-mob):

```text
I've decided to write user stories for this work, because it has several kinds of user, complex clock rules and three repos. The reasons are in `inception/user-stories/user-stories-assessment.md`. That file also carries your five gate decisions (R-12 to R-16), so they go forward into the stories.
[...]
- **No new scope:** stories add nothing, change no recorded rule and decide none of the open items.
```

One full planning question, with its options (`user-stories-questions.md`):

```text
### Q1. Who marks a request complete, as a persona?

Context: FR2.2 says "the person who confirms the documentation" marks a request complete, and v1 does not judge documents. The stakeholder map does not name this role, and the stories need an actor.

A. An intake coordinator in utilization management: a new persona, a non-clinical role that confirms the documents have arrived
B. The nurse reviewer, who also confirms completeness
C. Not named in v1: the stories say "the person confirming documentation", and Domain Design names the role
X. Other (please specify)

[Answer]: A. In UM operations, a non-clinical intake coordinator confirms the documents have arrived. That keeps completeness separate from clinical review, and v1 still makes no judgement about the documents (UM director, confirmed by nurse lead).
```

The mob's draft and what the three agents found (turn 049-mob, trimmed):

```text
I've drafted 7 personas and 32 stories in 8 groups, owned by repo (U1 api, U2 notify, U3 web, plus the end-to-end run). The designer, developer and quality engineer each reviewed the draft independently. Their contributions are in `inception/user-stories/contributions/`.

**What I'll fix myself** when I fold in their reviews:
- **DST examples:** they currently pass with plain UTC maths. I'll write them with ET offsets. One result to flag for compliance's OQ-1 decision: a standard request completed 1 Nov 00:30 ET is due 7 Nov 23:30 ET under the 168-hour reading, not 8 Nov 00:30.
[...]
**9 questions for you (Q5–Q13)**, at the end of `user-stories-questions.md`. Q5 and Q10 touch recorded rules:
- **Q5:** the Due column needs `decisionDueAt` added to web's row model. The project rule requires a recorded web decision for that, even though prior-auth-web D-001 allows dates.
```

Answering follow-up questions after the summary was confirmed tripped a check, and the engine asked
for a fresh confirmation (turn 050-mob):

```text
The stories are fully revised with your nine answers and the three reviewers' points. Before the senior product reviewer could start, the system refused the review: the follow-up questions came *after* the summary you had already confirmed. So I need a fresh confirmation of a summary that covers all thirteen answers.
```

The senior product reviewer's verdict (turn 051-mob, trimmed):

```text
The senior product reviewer marked the stories **ready**: nothing blocking, 2 should-fix items and 8 notes. The full review is in `inception/user-stories/reviews/review-01.md`.
[...]
**The two should-fix items need your call at the gate:**
- **R-01, `determinedAt` on the web row model:** your Q5 answer adds it, but nothing on screen uses it. The api already orders the decided rows, and their Due cell shows "-". prior-auth-web D-001 treats widening the row model as a privacy decision.
```

The same finding in the review file (`user-stories\reviews\review-01.md`):

```text
| R-01 | should-fix | inception/user-stories/stories.md > US4.2 AC4.2.2 and Refinements table row Q5 | The web row model gains determinedAt, justified in Q5 as being for ordering decided rows. But AC4.2.1 says the screen never re-sorts, the visible columns do not use it (AC4.2.3), and a decided row's Due text is "-" (AC4.3.6). The field has no consumer. prior-auth-web D-001 says widening the summary type is a privacy decision, yet Q5 makes privacy-office review optional. | Ask the web lead to drop determinedAt from AC4.2.2 and the Q5 precondition, or to name the story that uses it. Confirm whether privacy-office review of the widening is required given D-001's Consequences. | New |
```

The User Stories gate prompt (turn 052-mob, trimmed):

```text
📚 **User Stories is complete and ready for your approval.**
[...]
**The two items that need you:**
- **R-01:** keep or drop `determinedAt` on the web row model. Nothing on screen uses it.
- **R-02:** who decides whether an alert for a request with no urgency leaves urgency out or writes STANDARD.

How would you like to proceed?

1. **Approve**: continue to Refined Mockups. If you answer R-01 and R-02 in your reply, I'll carry them forward the same way as last time.
2. **Request Changes**: I fix R-01, R-02 and any of the notes you want, the reviewer checks again, and you see the gate again
```

Refined Mockups opened by explaining the ledger and the hard gate (turn 053-mob, trimmed):

```text
I approved User Stories with your R-01 to R-10 decisions. Those decisions, and the earlier R-12 to R-16, are now in one ledger: `inception/gate-decisions.md`. That's needed because approved documents are locked; every later stage reads the ledger alongside them, and the ledger wins where they differ.

**Refined Mockups has 10 questions** in `inception/refined-mockups/refined-mockups-questions.md`. Q3–Q5 are the hard gate before U3's plan can start.
[...]
- **Q2, I-1:** no web decision was recorded before this stage. So I propose the badge is out of v1, and urgency shows through queue order only.
```

That question in full (`refined-mockups-questions.md`):

```text
### Q2. Where does I-1 (the "Urgent" badge) stand?

Context: US4.5 (Could) needed a recorded prior-auth-web decision with privacy-office sign-off **before Refined Mockups**. Without it, no row carries urgency in any form (AC4.5.1), and the end of the urgent group is neither shown nor announced (AC4.4.5).

A. No decision has been recorded, so the badge is out of v1 (Won't for v1). Urgency shows through order only, and I-1 stays open with the web lead and the privacy office for a later version.
B. A decision has been recorded (please give its D-id), so the badge is designed here
X. Other (please specify)
```

The mockup reviewer caught sample data a test writer might copy (turn 055-mob, trimmed):

```text
**Findings, none blocking:**
- **R-01, should-fix: the Screen 1 sample rows are impossible.** For example, PA-1039 was submitted 9 Oct but is due 11 Oct 08:00 ET. As an urgent request, that would mean it was completed before it was submitted. Test writers might copy this data, so the sample dates should be fixed.
- **R-02, should-fix:** the repeated-hour examples are missing the exact edges: 05:00:00.000Z, 05:59:59.999Z, 06:00:00.000Z and 06:59:59.999Z.
[...]
- **R-06, note:** the Approved badge colour has 3.7:1 contrast, which is below AA. The web lead should either darken it (for example to #0f766e) or keep it with a recorded reason.

**Also open for the web lead (RM-OQ-1):** what an invalid row shows when even its referenceId can't be read. I didn't make up an answer.
```

The Refined Mockups gate prompt (turn 056-mob, trimmed):

```text
🎨 **Refined Mockups is ready for your approval.**
[...]
No recorded rule changes. The badge is Won't for v1, and I-1 and OQ-5 stay open.
[...]
How would you like to proceed?

1. **Approve**: continue to Domain Design. You can answer R-06 and RM-OQ-1 in your reply, and I'll add them to the ledger.
2. **Request Changes**: I fix the items you name, the reviewer checks again, and you see the gate again.
```

### The workspace after this step

```text
intents\261011-urgent-auth-clock\inception\
  gate-decisions.md                       the carry-forward ledger (grows at every later gate)
  user-stories\
    user-stories-assessment.md            why stories, plus R-12 to R-16
    user-stories-questions.md             Q1-Q13 and the confirmed summary
    personas.md                           7 personas, 120 lines
    stories.md                            37 stories in 8 groups, 573 lines
    traceability.json                     every FR and NFR mapped
    contributions\  aidlc-design-agent.md  aidlc-developer-agent.md  aidlc-quality-agent.md
    reviews\review-01.md                  READY, R-01 to R-10
  refined-mockups\
    refined-mockups-questions.md
    mockups.md                            229 lines, incl. the literal Due-text table
    interaction-spec.md
    accessibility-checklist.md            19 WCAG 2.1 AA checks
    design-system-mapping.md
    reviews\review-01.md                  READY, R-01 to R-06
```

A story with criteria a test can copy (`stories.md`):

```text
### US2.3: Urgent requests are due 72 hours after completion (Must, U1 prior-auth-api)

As **Chris (compliance lead)**, I want an urgent request's due time to be exactly 72 elapsed hours after completion, so that we meet CMS-0057-F's expedited window.

- **AC2.3.1** Given URGENT and completeAt 2026-10-11T12:00:00.000Z, then decisionDueAt is 2026-10-14T12:00:00.000Z.
- **AC2.3.2** Given URGENT and completeAt 2026-10-31T08:00:00-04:00 (ET, before the US daylight-saving change), then decisionDueAt is the instant 2026-11-03T07:00:00-05:00, which is 2026-11-03T12:00:00Z: 72 elapsed hours, not 72 wall-clock hours.
- **AC2.3.3** Given URGENT and completeAt 2026-10-11T12:00:00.001Z, then decisionDueAt is 2026-10-14T12:00:00.001Z. Milliseconds carry through.
- **AC2.3.4** The clock code reads no wall time. A test with a fixed injected clock gives the same result whatever the host time zone.

*Traces:* FR3.1, FR3.3, FR3.5, NFR3, NFR4. *Flagged:* decisionDueAt is a new C-1 field.
```

The persona nobody listed, named from the Q1 answer (`personas.md`):

```text
## Ivan, Intake Coordinator (new)

- **Role:** a non-clinical coordinator in UM operations who confirms the documents for a request have arrived [Q1].
- **Goals:**
  - mark a request complete once, correctly, so the clock starts at the right moment;
  - be told plainly if a request was already complete.
```

The refined queue screen and the start of the Due-text table (`mockups.md`, trimmed). These are
the sample rows the reviewer flagged in R-01; the corrected rows live in `gate-decisions.md`:

```text
- **No urgency on rows in any form** (visible, hidden, `aria-*`, `title`, `data-*` or class). The "Urgent" badge is Won't for v1, and I-1 stays open [Q2].
[...]
| [Skip to queue]                          <- first tab stop                      |
|                                                                                 |
| Authorization requests                                               (h1)       |
|                                                                                 |
| Caption: Authorization requests waiting for a decision: 7                       |
| +-----------+-----------+-----------+-------------------------------+---------+ |
| | Reference | Procedure | Submitted | Due                           | Status  | |
| +-----------+-----------+-----------+-------------------------------+---------+ |
| | PA-1039   | 29881     | 9 Oct     | Overdue 3h · 11 Oct 08:00 ET  | Pending | |
| | PA-1045   | 64483     | 10 Oct    | Due in 45m (at risk) · 11 Oct 11:45 ET  | Pending | |
[...]
## The Due cell: literal text (hard gate for U3, R-03)
[...]
| 2026-10-12T07:59:59.999Z (r = 24 h + 1 ms) | Due in 24h · 13 Oct 04:00 ET |
| 2026-10-12T08:00:00.000Z (r = 24 h) | Due in 24h (at risk) · 13 Oct 04:00 ET |
[...]
| 2026-10-13T08:00:00.000Z (r = 0) | Due now (at risk) · 13 Oct 04:00 ET |
| 2026-10-13T08:00:00.001Z (e = 1 ms) | Overdue <1m · 13 Oct 04:00 ET |
```
