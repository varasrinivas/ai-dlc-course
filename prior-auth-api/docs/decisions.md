# Decision log

Context memory. Every rule in this codebase that a human decided lives here, with the
reasoning and the person who decided it. The code cites these by id (`// (D-001)`).

**Why the reasoning and not just the rule:** a rule without its reasoning gets "fixed" by
the next engineer — or by an AI reading raw source — in about six months. A recorded
rationale can argue back. This file is what makes bolt 10 faster than bolt 1, and it is the
first thing an engine should read before proposing a change to any rule below.

**Format:** one entry per decision. Never delete an entry; supersede it with a new one and
link back.

---

## D-001 — A criteria match of exactly 0.85 auto-approves

**Decision:** `AUTO_APPROVE_THRESHOLD = 0.85`, and the comparison is `>=`. A score of
exactly 0.85 auto-approves.

**Why:** the published clinical criteria are calibrated so that 0.85 *is* the "meets
criteria" line, not the first score above it. Making the boundary exclusive would silently
deny a band of requests the criteria say qualify, and the denial would be invisible — it
would look like a scoring outcome rather than a policy change.

**Decided by:** clinical policy working group, with the medical director. Not inferred, not
a default.

**Consequences:** asserted directly by `auto_approves_exactly_at_threshold`. Changing this
value is a clinical policy change requiring medical director sign-off — it is not a tuning
knob, and it is not a thing to adjust from a prompt to make a test pass.

---

## D-002 — Eligibility outranks the criteria score

**Decision:** an ineligible member is never auto-approved, whatever the score.

**Why:** the criteria engine answers "is this procedure clinically warranted?". It does not
answer "is this person covered?". A 0.99 match on an ineligible member is a clinically
sound request we still cannot authorize. Letting the score win would auto-approve care the
plan will not pay for, which harms the member more than a denial does — they would proceed
believing they were covered.

**Decided by:** the team, with benefits operations.

**Consequences:** the eligibility check precedes the threshold check in
`DeterminationService.decide`, and is asserted by
`denies_when_member_ineligible_whatever_the_score`.

---

## D-003 — Notifications carry status and reference id only

**Decision:** notification text sent to a member or provider contains the `AuthStatus` and
the `referenceId`. Never clinical content, never criteria detail, never the score.

**Why:** notifications travel over channels we do not control and cannot recall. Clinical
content in one is a PHI incident with regulatory consequences, not a bug we patch next
sprint. The reference id is enough for anyone entitled to the detail to retrieve it through
a channel that authenticates them.

**Decided by:** the team, with privacy office review.

---

## Open — not yet decided

> An honest decision log records what has *not* been decided. These are the gaps an engine
> must stop and ask about rather than fill with a plausible default.

- **Re-score after determination.** A request auto-approves at 0.91. New clinical notes
  arrive and it re-scores at 0.62. Does the existing determination stand, or does the
  request reopen for nurse review? Nobody has decided. The rules above tell an engine what
  to do with a *score* — nothing tells it what to do with a score that **moves after a
  determination already exists**. This one has a member's care attached, so it is not the
  engine's to guess.
  *(This is the decision the hello-world bolt asks you to make. See `README.md`.)*
