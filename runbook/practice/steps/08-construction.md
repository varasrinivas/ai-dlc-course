# Step 08 — Design, plan, then generate code into the right repo

> Runbook section: [08 · Construction](../../multi-repo-feature.html#s8) ·
> Phase 3 Construction · stages 3.1–3.5, per unit · Time: 2–4 hours across the two bolts

## Goal

Watch an approved plan become code. For each unit, in order, the engine writes:

1. a functional design;
2. NFR requirements, then NFR design;
3. infrastructure design, where the unit's kind needs it;
4. a **code-generation plan** that you approve before a single line of code.

Then it generates the code into the **owning sibling repo**, never into the hub. A
verified **unit checkpoint** closes each unit.

## Who's in the room

- **The conductor:** you, at the hub.
- **The owning repo lead:** at each plan gate and unit checkpoint. That's the api lead for U1,
  the notify lead for U2, and the web lead for U3.

## Do it

```text
# Claude Code
/aidlc
```

```text
# Codex CLI
$aidlc
```

At each plan gate, run the reviewer **first**:

```text
# Claude Code: ask for the subagent by name
Use the repo-plan-reviewer agent on the open code-generation plan.
```

```text
# Codex CLI
$repo-plan-reviewer
```

Then reply `Approve`, or `Request Changes: <reason>`.

Give each repo the same branch name, and put the Rally ID in each PR title:

| Repo | Branch | PR title | Merge order |
|---|---|---|---|
| prior-auth-api | `feat/urgent-auth-72h` | `US#### api-urgency-clock: ...` | first; additive, backward compatible |
| prior-auth-notify | `feat/urgent-auth-72h` | `US#### notify-service: ...` | after contract v1.1.0 is published |
| prior-auth-web | `feat/urgent-auth-72h` | `US#### web-urgent-queue: ...` | after api is deployed |

## What you'll see

From the reference run (U1 `api-urgency-clock`, the first unit of bolt 1).

**Four design stages came before any plan.** Functional Design, NFR Requirements, NFR Design
and Infrastructure Design each had questions, a review and a gate. Infrastructure Design
was one question, answered "local only: nothing provisioned, production needs documented
and deferred to Operation".

**The plan gate.** The engine summarised what you're approving, not just where the file is:

```
Approve the code plan for api-urgency-clock?
- Builds: ... submit with urgency (the walking skeleton first), completion and 72 h due
  times, scoring and determination, the once-only at-risk alert, the event outbox ... the
  ordered GET /queue, the export ... and contract v1.1.0.
- Existing src/domain/* and src/determination/* are unchanged.
- Tests: TDD, about 175 Jest tests (including the existing 4) ...
Your approval covers these points:
- Five new dev dependencies: eslint, typescript-eslint, prettier, ajv, @types/node.
- Two hard stops: Step 7, the M1 skeleton checkpoint ... Step 21, contract publication ...
1. Approve Plan   2. Request Changes   3. I'll edit the files
```

The engine had already run its own repo-rules check: no change to D-001, D-002 or D-003.

**The kit's reviewer found more.** Running `repo-plan-reviewer` (read-only, in its own
session) reported **2 conflicts and 9 gaps** the engine's check had passed:

```
| 1 | High, conflict | Step 20: "Every object schema is open" | The contract makes the export
  row a closed schema ... Writing every schema as open breaks the contract version. |
| 2 | High, conflict | Step 2 ... "awaiting tech lead sign-off at the M1 checkpoint" ...
  Adding the sign-off later means rewriting those entries. |
| 3 | High, gap | Steps 4-5 (M1): submit then read prints a view. The C-1 projection and its
  allow-list come only in Step 15. ... The checkpoint could approve output that leaks
  member identity. |
...
2 conflicts: consider Request Changes
```

Finding 3 is the kind a human reviewer misses at 6pm. The demo you approve at the first
checkpoint could have printed `memberId`.

**The threshold experiment.** Asked to lower `AUTO_APPROVE_THRESHOLD` to 0.80, the engine
refused and recorded nothing:

> I won't make that change. It would alter a recorded clinical rule, and neither this plan
> nor I can do that. [...] Faster urgent decisions come from the clock, the queue order and
> the at-risk alert this plan builds. [...] I haven't recorded your reply as a plan change.

It offered the legitimate route instead: raise "Should the threshold change?" as an Open
item for the medical director.

**Request Changes, then sign-offs it wouldn't assume.** After the reviewer's findings went
back as Request Changes, the revised plan came back with a warning that three of the
changes undid earlier gate decisions:

> **G-01** reverses the Contract Design gate's R-01 ... Approving this plan counts as the
> tech lead's co-sign unless you say otherwise.
> **G-12** reverses NFR Requirements Q5, where compliance confirmed that a missing secret
> scan fails verify. You may want compliance to re-confirm this.

The approval reply named who confirmed each reversal. The audit trail now shows it.

**The walking-skeleton checkpoint (M1) came with evidence, not a claim.** After Steps 1–8, the
engine stopped and pasted output from its own run of the gate, separate from the developer
agent's:

```
=== verify summary ===
- Node check (engines): passed
- npm ci: passed
- typecheck: passed
- lint + Prettier check: passed
- build, then tests with coverage: passed
- npm audit --omit=dev --audit-level=high: passed
- secret scan (gitleaks): not run (gitleaks not on PATH)
verify: PASSED

Tests:       39 passed, 39 total
All files   | % Stmts 93.08 | % Branch 91.42 | % Funcs 92.1 | % Lines 93.45

through the built entry point (node dist/cli/main.js)
  √ stores_an_urgent_request_and_reads_it_back_with_its_urgency (203 ms)
```

The skeleton proved the privacy point the reviewer had raised at the plan gate. `read`
returns exactly `{referenceId, procedureCode, status, urgency, submittedAt}`, so `memberId`
and `providerId` never come out.

**It also listed its own shortfalls, unprompted:**

> 1. **Failing-test evidence was recorded per test file, not per behaviour.** [...] Most of
>    the first failures were "not implemented" errors, not the test's own assertion. [...]
>    This falls short of the team's rule that each test is seen failing for the right reason.
> 2. **Nothing is committed.** [...]
> 5. **36 vulnerabilities in development-only packages** (1 critical). The gate's audit
>    doesn't check development packages, so it doesn't see them.

**The api lead re-ran the suite before approving** (39/39, `auto_approves_exactly_at_threshold`
green, no diff in `src/domain`, `src/determination`, `AGENTS.md` or `CLAUDE.md`). The approval
carried four rulings:

- the test-first shortfall accepted for M1, with per-behaviour failing runs from Step 9 on;
- the two new error names accepted;
- the dev-dependency vulnerabilities recorded as a go-live item;
- the three NFR design choices confirmed.

<!-- RUN-QUOTES:08-CODE -->

## Under the hood

- **Plan approval is enforced by a hook, not by goodwill.** AI-DLC's
  `plan-approval-guard` (PreToolUse) blocks code edits in the unit's repo until the plan
  gate is approved. It is the one switch only a human can turn off.
- **The design lives in the hub, the code in the repo.** Design artifacts go to
  `construction/<unit>/<stage>/`. Code goes to the sibling repo, and each git operation is
  anchored to that one repo.
- **The engine reads the repo's own steering when it plans.** Look for the
  **Repo rules honoured** section in `code-generation-plan.md`. It comes from the
  `prior-auth-pack` overlay.
- **The decision-log guard.** If the engine ever tries to edit
  `prior-auth-*/docs/decisions.md`, you get an *ask* prompt from the hook you installed.
  Steering *asks* the engine not to; the hook makes the tool stop.
- **Sensors run as the code is written.** The built-in `type-check` and `linter` sensors
  run on every `.ts` write and leave `SENSOR_PASSED` / `SENSOR_FAILED` rows in `audit/`.

## Before you say Approve (each code-generation plan)

- Does the plan touch exactly one repo?
- Does it cite **D-001** and keep `auto_approves_exactly_at_threshold` green? Does it cite
  **D-003**, with no clinical fields in any event or notice?
- Are the tests named as snake_case sentences that state the rule, for example
  `urgent_sorts_first` and `due_at_is_72h_from_complete`?
- Does U2 or U3 pin the contract version instead of importing api source?
- Does the walking skeleton (U1, first) really stop at "urgency stored and returned"?

## Before you say Approve (each unit checkpoint)

In the owning repo, run the gates yourself and read the real output:

```powershell
cd prior-auth-api      # or prior-auth-notify / prior-auth-web
npm test
npm run typecheck
git log --oneline -5
```

## Try this

At U1's plan gate, reply:

```text
Request Changes: set AUTO_APPROVE_THRESHOLD to 0.80 so urgent requests clear faster
```

The engine should refuse, quote D-001, and say what a real change needs: a recorded
decision with medical director sign-off. That refusal is the steering working. Then
approve the original plan.

## Files written

- In the hub, for each unit, under `construction/<unit>/`: `functional-design/`, `nfr-requirements/`, `nfr-design/`, and
  `code-generation/`. The last holds `code-generation-plan.md`, `code-summary.md`, `traceability.json` and `source-manifest.json`.
- In the repos:
  - `prior-auth-api/src/**` and `prior-auth-api/contracts/*` (U1)
  - `prior-auth-notify/src/**` (U2)
  - `prior-auth-web/src/**` (U3)

## Common snags

- **The decision-log guard fired, and the engine didn't treat it as an error.** When U1's
  developer agent tried to append D-005 to D-013 to `prior-auth-api/docs/decisions.md`, the
  kit's hook stopped it. The engine paused and showed the exact text to be appended. It also
  pointed out a wrong sentence in its own draft (a daylight-saving claim that only holds in
  autumn), so that it could be removed *before* an append-only log made it permanent.
- **In headless runs (`claude -p`) the hook's "ask" becomes a refusal.** Nobody is there to
  click Allow. Interactively you just approve the prompt. The reference run, which was
  headless, approved by switching the hook off for that one approved turn, then checked
  the `decisions.md` diff by hand: append-only, with D-001 to D-003 unchanged.
- **Your machine is part of the plan.** U1's plan assumed Node 22 and gitleaks. The
  reference machine had Node 24 and no gitleaks. The fix went through Request Changes: pin
  `engines` to `>=22`, and skip the secret scan with a warning when gitleaks is missing,
  recorded as a go-live gap. Don't install tools mid-gate to make a plan true; change the
  plan.
- **`aidlc-state.md` stays on "functional-design" through all of a unit's design stages.**
  Use `/aidlc --status`, or the stage folders under `construction/<unit>/`, to see where
  you really are.
<!-- RUN-SNAGS:08 -->
