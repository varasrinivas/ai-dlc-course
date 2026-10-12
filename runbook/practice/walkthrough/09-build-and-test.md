# Walkthrough 09

> Phase 3 Construction, stages 3.6 Build and Test and 3.7 CI Pipeline, run once after all
> units.

## Background

By the end of step 08 every unit has passed its own checkpoint: its repo's `verify` gate
ran, its tests passed, and its lead and the tech lead approved it. That is necessary, and
it is not enough. A multi-repo feature rarely breaks inside one repo. It breaks at the
seams: a provider that serves a field slightly differently from the contract, a consumer
that chokes when an old client leaves a field out, a privacy rule that holds in one repo
and leaks in the next.

**Build and Test (3.6) runs once, after all units**, and its job is to test across the
repo boundary. It proves three things:

| Check | Proves | Lives in |
|---|---|---|
| Provider contract test | prior-auth-api serves exactly contract v1.1.0 | prior-auth-api's tests |
| Consumer contract tests | prior-auth-notify and prior-auth-web accept v1.1.0, including when `urgency` is absent (an old client) | each consumer repo, against its pinned copy |
| End-to-end path | An URGENT request goes to the top of the nurse review queue, gets a determination, and produces a notice that carries status and referenceId only | recorded in `construction/build-and-test/test-results.md` |

The first two checks only work because of decisions made earlier. The contract was
published once, as a frozen folder, and each consumer committed a copy of it rather than
importing api source (step 06). So each side can test against the same bytes without
reaching into another repo.

**The end-to-end path is not a unit.** In the reference run, the room decided at Units
Generation that the scripted run (stories US8.1 to US8.4) is the end-of-intent check,
owned by the QA lead and approved by the tech lead. It runs from the hub and drives each
repo only through its public surface: prior-auth-api's CLI commands and `GET /queue`, the
event files, `notify run` and its outbox. It never imports source. Because every command
takes an explicit `--now`, the script controls the clock and can step a request through
completion, the 24-hour at-risk mark and the 72-hour deadline in seconds.

**Evidence, not claims.** `test-results.md` holds pasted runner output. "All tests pass"
without the runner's text is a claim, and the gate should reject it. Three things in that
output deserve a line-by-line read:

- the original `auto_approves_exactly_at_threshold` test in prior-auth-api still passes,
  so D-001 (a criteria match of exactly 0.85 auto-approves) survived the whole feature;
- a consumer test exists where `urgency` is **absent**, which proves old clients keep
  working;
- the end-to-end notice payload is checked to carry **no** clinical fields, member
  identity or score, per prior-auth-api D-003 and prior-auth-notify D-001.

`build-instructions.md` records how to build and test each repo so a teammate can repeat
it without asking.

**CI Pipeline (3.7) is conditional.** It writes `construction/ci-pipeline/quality-gates.md`
and a pipeline definition per repo. In this practice run nothing is pushed, so the
pipeline is the local `verify` gate in each repo, run together by the hub's
`node scripts/verify-all.mjs`. The rule agreed at U1's checkpoint applies here: a repo
counts as verified only when it shows `passed`. "Skipped" is not verified, and a secret
scan that could not run is "not run", never passed.

**The Construction phase check** closes the phase, as the Inception check did. It confirms
that every unit's checkpoint was verified, not just claimed, and that every story is
covered by code and tests or carries a named deferral.

Who's in the room: the QA lead owns the results, each repo lead confirms their own suite,
and the product owner's acceptance is what moves the Rally feature to Accepted.

## In the reference workspace

<!-- RUN-WALKTHROUGH:09 -->
