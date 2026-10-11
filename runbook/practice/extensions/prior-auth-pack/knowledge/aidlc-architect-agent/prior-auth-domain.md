# Prior Auth Portal — domain primer (prior-auth-pack)

Healthcare utilization management. A provider requests prior authorization for a
procedure; the request is scored against published clinical criteria.

- Entities: `AuthRequest`, `Member`, `Provider`, `ClinicalCriteria`, `Determination`,
  `AuthStatus`. API resources: `auth-requests`, `members`, `determinations`.
- Rule: criteria match score >= `AUTO_APPROVE_THRESHOLD` (0.85) auto-approves; exactly
  0.85 approves (D-001). Below threshold routes to the **nurse review queue**.
- Eligibility outranks the score: an ineligible member is never auto-approved (D-002).
- Anything sent to a member or provider carries `AuthStatus` and `referenceId` only (D-003).
- List and queue screens show referenceId, procedure code, dates and status only
  (prior-auth-web D-001).
- Repos: `prior-auth-api` (TypeScript + Jest; owns rules, clocks, statuses, and the
  published contract), `prior-auth-web` (React + Vitest; displays), `prior-auth-notify`
  (TypeScript + Jest; sends notices from events).

Clinical policy values are never tuning knobs. Changing one needs a recorded decision with
medical director sign-off, so an agent raises it as a question; it never edits it.
