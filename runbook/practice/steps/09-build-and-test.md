# Step 09 — Test across the repo boundary, not just inside each repo

> Runbook section: [09 · Build and test](../../multi-repo-feature.html#s9) ·
> Phase 3 Construction · stages 3.6 Build and Test, 3.7 CI Pipeline ·
> Time: 30–60 minutes

## Goal

Each repo's own tests passing is necessary but not enough. A multi-repo feature breaks
at the seams. This step proves three things:

1. **The provider serves the contract.**
2. **Each consumer accepts it**, including when an old client leaves fields out.
3. **One end-to-end path works**: an URGENT request goes to the top of the queue, gets a
   determination, and produces a notice that carries status and referenceId only.

## Who's in the room

- **QA lead:** owns the test results.
- **Repo leads:** each confirms their repo's suite.
- **Product owner:** acceptance, which is the trigger for Rally Accepted.

## Do it

Resume (`/aidlc` or `$aidlc`). Build and Test runs **once**, after all units. Then run the
gates yourself in each repo before approving:

```powershell
foreach ($r in 'prior-auth-api','prior-auth-notify','prior-auth-web') {
  Push-Location $r; npm test; npm run typecheck; Pop-Location
}
```

| Check | Proves | Lives in |
|---|---|---|
| Provider contract test | api serves exactly contract v1.1.0 | prior-auth-api tests |
| Consumer contract tests | web and notify accept v1.1.0, including `urgency` absent | each consumer repo |
| End-to-end path | URGENT → top of queue → determination → notice (status and referenceId only) | `construction/build-and-test/test-results.md` |

## What you'll see

<!-- RUN-QUOTES:09 -->

## Under the hood

- `build-instructions.md` records how to build and test each repo. A teammate can follow it
  without asking you.
- 3.7 CI Pipeline is conditional. It writes `construction/ci-pipeline/quality-gates.md` and
  a pipeline definition per repo. In this practice run nothing is pushed.
- The Construction **phase check** confirms every unit's checkpoint was verified, not just
  claimed.

## Before you say Approve

- Is the test output in `test-results.md` **pasted**, not summarised? "All tests pass"
  without the runner's output is a claim, not evidence.
- Does the original `auto_approves_exactly_at_threshold` test still pass in prior-auth-api?
- Is there a consumer test where `urgency` is **absent**? That proves old clients keep
  working.
- Does the end-to-end path check the notice payload has **no** clinical fields?

## Try this

In prior-auth-notify, add `score` to one notice by hand, temporarily, and run `npm test`.
Something should fail and name D-001 (D-003 in prior-auth-api). If nothing fails, the
privacy rule has no test. That's a finding worth raising at this gate. Revert your edit.

## Files written

- In `construction/build-and-test/`: `build-instructions.md`, `test-results.md`
- In `construction/ci-pipeline/`: `quality-gates.md`
- The Construction phase check, under `verification/`

## Common snags

<!-- RUN-SNAGS:09 -->
