# Step 04 — Turn the intent into requirements, one answered question at a time

> Runbook section: [04 · Requirements](../../multi-repo-feature.html#s4) ·
> Phase 2 Inception · stage 2.3 Requirements Analysis (Mob Elaboration) ·
> Time: 45–60 minutes

## Goal

This is **Mob Elaboration**, the ritual AI-DLC is best known for. The AI drafts the
questions, and the room answers them. Every answer lands in a file and in the audit trail.

The cross-repo questions get settled **here**, while changing your mind is cheap:
- which repo computes the clock;
- which repo stores it;
- which repo emits each event.

## Who's in the room

The whole mob:
- the product owner, the UM director and the nurse lead;
- compliance;
- all three repo leads.

If you're alone, read each question aloud and ask "whose call is this?" before answering.

## Do it

Resume the workflow if needed (`/aidlc` or `$aidlc`). When the questions file appears, try
**Guide Me** this time: the engine asks up to four questions at a time in chat. The file
stays the source of truth whichever mode you pick.

The decisions this step must produce, with the answers the reference run gave:

| Question | Reference answer | Seat |
|---|---|---|
| When does the clock start? | When the request is **complete**; "clock not started" before that | UM director + compliance |
| Which repo owns the clock? | **prior-auth-api** computes `decisionDueAt`; web and notify only read it | api lead |
| Queue order | URGENT first, then `decisionDueAt` ascending | Nurse lead |
| Events | `determination.issued {referenceId, status, issuedAt}`; `sla.at-risk {referenceId, urgency, decisionDueAt}` 24h before due | api lead + compliance |
| Old clients | `urgency` defaults to STANDARD; `decisionDueAt` is null until complete | api lead |

## What you'll see

From the reference run (stage 2.3). The questions file had **17 questions** in four
groups: *The clock*, *Ownership and the local run*, *Reporting*, and *Recording rules and
quality targets*. The engine had settled the easy questions earlier, so these were the
hard ones.

**Ownership questions arrived on their own.** Without being asked, the engine put the
repo-crossing decisions up front, each with a "who owns it" option:

```
### Q10. Who decides the queue order, and how does prior-auth-web get the queue in the local run?
A. prior-auth-api owns the order and serves a small local read of the queue (C-1 rows,
   already ordered), defined in contract v1.1.0. prior-auth-web shows rows in the order it
   is given and never re-sorts. The countdown is display only ...
B. prior-auth-api publishes C-1 only; prior-auth-web sorts by the recorded order rule
```

**It planned around the real code it found in step 03.** The codekb said prior-auth-api has
no HTTP server. So instead of inventing one, the options were concrete and local:

- events travel as a **JSON-lines file** from api to notify (Q7);
- the at-risk check is an api **command that takes "now"**, so a test can control the clock (Q5);
- reports come from an api **export command** (Q12).

**Precision you would not have thought to ask for.** For example:

- Q1: "7 calendar days" became exactly **168 elapsed hours**, with no time-zone dependency.
- Q2: a determination issued exactly at the due time is **on time** (inclusive), tested at
  the boundary and 1 ms either side.
- Q4: a second "mark complete" is **refused** with a typed error, and never restarts the clock.

**New decisions get recorded where they belong.** Q15 decided that the new clock rules go
into prior-auth-api's `docs/decisions.md` as **D-005 onward**, with D-001 to D-003 untouched.

**The gate, and a frozen file.** The reviewer raised 16 findings. In the audit trail, the
approval records a disposition for each one, with a fingerprint of the finding and a link
to the review record:

```
**Event**: GATE_APPROVED
**Stage**: requirements-analysis
**Review Finding Dispositions**: {"dispositions":[{"id":"R-01", ... "status":"Accepted risk",
  "decided_at_severity":"should-fix", ...
```

Just before that approval, the engine tried to edit the reviewed `requirements.md` again.
AI-DLC stopped it:

```
**Event**: REVIEW_FREEZE_BLOCKED
**Tool**: Edit
**Target**: .../inception/requirements-analysis/requirements.md
```

Once an artifact has been reviewed, the engine can't quietly change it before you decide.
A change has to go through **Request Changes** and a new review.

## Under the hood

- The questions follow a fixed shape:
  - lettered options;
  - a mandatory `X. Other (please specify)`;
  - an `[Answer]:` tag.
- **Step 1b (prior-auth-pack)** is in the stage instructions if you installed the plugin.
  Open `.claude/aidlc-common/stages/inception/requirements-analysis.md` and search for
  `prior-auth-pack`. That spliced paragraph tells the engine to read each repo's
  `docs/decisions.md` and to settle ownership questions now. It's how a team customises
  the method without forking it.
- `requirements.md` is generated only after you confirm a consolidated summary.

## Before you say Approve

- Every `[Answer]:` is filled in. An empty one is a decision you've silently handed to the
  engine.
- Each new value or event names **one** owning repo.
- No requirement contradicts a D-id. For example, "auto-approve urgent requests at 0.80"
  would contradict D-001.
- Each non-functional requirement is measurable, such as "within 72 hours of becoming
  complete", not "fast".

## Try this

Answer the clock-owner question with **B**: each consumer computes the due time itself.
Don't approve; just read the engine's follow-up. Then change it back. You've just seen
why "one clock, one owner" gets decided in Inception: three repos computing three clocks
is how deadlines drift.

## Files written

All in `aidlc/spaces/default/intents/<id>/inception/requirements-analysis/`:
- `requirements-analysis-questions.md`
- `requirements.md`

New rows also land in `audit/`.

## Common snags

- **"Accepted risk" is a real decision, not a formality.** In the reference run, the mob
  approved with all 16 findings marked *Accepted risk*, 9 of them "should-fix". The audit
  keeps each one with its fingerprint. When you approve with open findings, read them first;
  some are cheap to fix now and expensive in Construction.
- **The questions file has no `## Q` headings at the top level.** Questions are `### Q<n>`
  under group headings. Search for `### Q` when you scan it.
- **A permission prompt for an Edit you didn't expect.** That may be the review freeze at
  work (see above). Check `audit/` for `REVIEW_FREEZE_BLOCKED` before you approve anything.
