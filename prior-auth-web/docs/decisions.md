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

## Open — not yet decided

> An honest decision log records what has *not* been decided. These are for humans; an
> engine must stop and ask rather than fill them with a plausible default.

- **The default nurse view.** When the nurse-review distinction becomes visible (the
  hello-world bolt), what does a nurse see by default: the whole queue with their rows
  highlighted, or only `PENDING_NURSE_REVIEW` with the rest a click away? One default
  buries their work in noise; the other hides context they may need. This decides what a
  nurse's morning looks like — it has care-ops weight, and it belongs to the nurse
  supervisor and the PO, not to the engine.
  *(This is the decision the web hello-world bolt asks you to make. See `README.md`.)*
