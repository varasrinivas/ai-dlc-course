# UW — surface what the nurse queue is waiting on

> One unit of work = one bolt = one session. Run during the hello-world bolt demo.

## Intent

Nurses open the queue every morning and can't tell which auth requests are actually
waiting on them.

## Acceptance criteria

1. `AuthStatus` gains `PENDING_NURSE_REVIEW`.
2. A criteria match below `AUTO_APPROVE_THRESHOLD` (0.85) routes the request to
   `PENDING_NURSE_REVIEW`, not generic `PENDING`.
3. A match at exactly 0.85 auto-approves; the boundary stays asserted by a test (D-001).
4. A below-threshold re-score on an APPROVED request leaves the determination intact and
   signals a NEW request instead. (D-004)

## Out of scope

- The nurse queue UI — that is `prior-auth-web`'s bolt, already seeded there.
- Actually creating the follow-up AuthRequest — intake's unit of work, next bolt.

## Open questions — for humans, not for the engine

- None. The one open question this unit surfaced was answered and recorded as D-004.

## Gates

- `npm test` green, output shown (7/7) · `npm run typecheck` clean
- decision recorded in `docs/decisions.md` and cited from the code
