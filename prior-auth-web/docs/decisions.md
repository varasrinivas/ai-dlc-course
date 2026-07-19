# Decision log — prior-auth-web

Context memory for the web repo. Screen and workflow decisions live here; clinical policy
lives in `prior-auth-api/docs/decisions.md` and is never re-decided in this repo. Code
cites entries by id (`// (D-001)`).

Never delete an entry; supersede it with a new one and link back.

---

## D-001 — List surfaces carry the reference id only

**Decision:** queue and list rows show `referenceId`, procedure code, dates, and status.
Never member name, never clinical content, never criteria detail or scores.

**Why:** queue screens are long-lived, glanceable, and often visible in shared clinical
spaces — a wall monitor or an over-the-shoulder glance leaks whatever a row carries. The
reference id is enough for an authenticated user to open the detail view, which
authenticates and audits access; a list row does neither.

**Decided by:** the team, with privacy office review.

**Consequences:** `AuthRequestSummary` deliberately has no identity fields, and
`never_renders_member_identity_on_list_surfaces` asserts a smuggled field still cannot
render. Widening the summary type is a privacy decision, not a refactor.

---

## D-002 — Status labels map 1:1 from the API contract

**Decision:** the UI renames statuses for humans ("Pending", "Approved") but never invents
a state the API doesn't have, and never merges two API states *in the data model*.
Rendering two states with one label is allowed only as a logged, deliberate choice.

**Why:** the API's status enum is the system of record; screens that drift from it turn
every incident into an archaeology project. Today `PENDING` and `PENDING_NURSE_REVIEW`
share the label "Pending" — that is a known, logged gap (see below), not silent drift.

**Decided by:** the team.

---

## D-003 — The default nurse view hides nothing

**Decision:** the queue opens showing all rows. Nurse-review rows are unmissable — a
distinct "Needs nurse review" badge and a row highlight — and a "nurse review only"
filter is one click away, never the default.

**Why:** the complaint was tell-ability, not volume — nurses couldn't tell which rows
were theirs, and the marking fixes exactly that. A pre-filtered default would make
everything outside the filter invisible until someone thought to click, and invisible
work in a clinical queue is a patient-safety smell, not a UX preference.

**Decided by:** Vara (course author), during the web hello-world bolt. Not inferred.

**Consequences:** asserted by `default_view_shows_all_rows`, `nurse_review_rows_are_marked`,
and `filter_shows_only_nurse_review_rows_when_toggled`. Changing the default is a care-ops
decision that supersedes this one — it is not a styling tweak.

---

## Open — not yet decided

> An honest decision log records what has *not* been decided. These are for humans; an
> engine must stop and ask rather than fill them with a plausible default.

- (nothing right now — the default-view question became D-003 above.)
