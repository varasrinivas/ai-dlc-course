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

<!-- RUN-QUOTES:04 -->

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

<!-- RUN-SNAGS:04 -->
