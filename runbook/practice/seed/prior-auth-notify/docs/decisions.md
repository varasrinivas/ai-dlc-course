# Decision log — prior-auth-notify

Context memory for the notification service. Clinical policy lives in
`prior-auth-api/docs/decisions.md` and is never re-decided here. Code cites entries by id
(`// (D-001)`).

Never delete an entry; supersede it with a new one and link back.

---

## D-001 — Notices carry status and reference id only

**Decision:** a notice sent to a provider or member contains the `AuthStatus` and the
`referenceId`. Never clinical content, never criteria detail, never the score.

**Why:** notices travel over channels we do not control and cannot recall. Clinical content
in one is a PHI incident, not a bug. The reference id is enough for anyone entitled to the
detail to retrieve it through a channel that authenticates them.

**Decided by:** the team, with privacy office review. This is `prior-auth-api` D-003,
recorded again here because this repo is the one that sends the notices.

---

## Open — not yet decided

- **Channels.** Email, portal message, fax for providers who still use it? Which ones, and
  in what order of fallback, is a provider-relations decision. It is asked in Mob
  Elaboration (runbook step 04), not guessed by an engine.
