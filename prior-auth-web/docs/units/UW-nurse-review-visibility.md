# UW — make nurse-review work visible in the queue

> One unit of work = one bolt = one session. Run during the web hello-world bolt demo.

## Intent

Nurses say the queue still doesn't show which requests are waiting on them, even though
the API now sends PENDING_NURSE_REVIEW.

## Acceptance criteria

1. `PENDING_NURSE_REVIEW` renders visibly distinct: its own label and color. Two API
   states never share a look again (D-002 honored).
2. The default view shows all rows; nurse-review rows are marked. (D-003)
3. A "nurse review only" filter is one click away, with pressed state exposed to
   assistive tech (`aria-pressed`).
4. List surfaces still carry reference ids only — the smuggled-field test stays green. (D-001)

## Out of scope

- Wiring the queue to GET /auth-requests — a separate unit, needs the API running.
- Role-based defaults (provider vs nurse views) — not decided; would be a new open entry.

## Open questions — for humans, not for the engine

- None. The default-view question was answered and recorded as D-003.

## Gates

- `npm test` green, output shown (8/8) · `npm run typecheck` clean
- decision recorded in `docs/decisions.md` and cited from the code
