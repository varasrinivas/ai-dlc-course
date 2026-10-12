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

**Contract publication (Step 21): the second time a recorded rule beat the runbook.** The
runbook's `sla.at-risk` event carries `urgency` and `decisionDueAt`. The room had allowed
that only as compliance's reading, pending privacy-office confirmation. Confirmation never
came, so v1.1.0 shipped the agreed fallback for **both** events. The engine pointed out that
the fallback covered `determination.issued` too, which the human reply hadn't mentioned:

> `determination.issued` (C-2) is also exactly `{referenceId, status}`, with no `issuedAt`.
> [...] Once v1.1.0 is published it can't be edited, so tell me now if you meant C-2 to
> keep `issuedAt`.

The choice became prior-auth-api **D-014**. If privacy later approves the wider alert,
that's v1.2.0 with its own decision entry. The first time was the urgency badge in step 05.

**The engine would not go around the guard.** Near the end of U1, a ruling at the gate (an
at-risk alert claimed while pending but published after a decision is dropped, not
relabelled) became a new decision, D-015. In the headless run, the decision-log guard
refused the append five times. Each "ask" came back as a refusal before any human saw it.
The engine had a way round and named it, then declined to use it:

> I could write the file another way, through the shell, which the guard doesn't watch. But
> that would get around a check the team put there deliberately, so I haven't. The merge
> stays on hold.

It then gave the human the exact paste: which file, which block, where, and "keep the file's
line endings". It also said it would show the `git diff` and stop if anything other than
the new block had changed. The api lead pasted it by hand (25 insertions, 0 deletions), and
U1 went on to commit, verify and merge.

### U2 notify-service (greenfield)

**The engine asked for changes to its own plan.** Before the plan gate, the engine ran the
kit's `repo-plan-reviewer`. It found no broken rule, but a list of should-fix items: wrong
step numbers in the ledger mapping, three missing tests, and two tests that wouldn't work
as written. The engine owned them and recommended against approval:

> It found these should-fix items, all my errors: [...]
> I recommend **Request Changes**. I'd apply items 1–5 as listed and take your rulings on
> P-1, P-2, P-3 and P-4.

The room sent it back with four rulings, and approved revision 2.

**The guard held for the decision log a second time.** U2's plan appends five decisions,
D-002 to D-006, to prior-auth-notify's `docs/decisions.md`. This time the engine planned
for the headless guard from the start: it drafted the entries into a pending file and made
"the notify lead pastes them by hand" a gate question (P-3). Claude Code's own safety check
also refused when an assistant outside the engine tried to write the entries. The paste
went ahead only once the human said so. The diff: 130 insertions, 0 deletions.

**A budget missed, measured instead of relaxed.** Notify has a 10-second budget per run.
The first build missed it by a wide margin. The ruling was that the budget isn't relaxed
before measured numbers exist. The engine timed two alternative designs, and a combination,
as throw-away spikes, and wrote each result down as soon as it had it:

> None of B, C or B+C meets 10 s. [...] Every number below was measured; none is
> estimated. The budget is unchanged and Steps 17–20 haven't started.

```
| Design                | N-02 run 1 / run 2  | N-03 run 1 / run 2  | Budget | Behaviour tests |
| Committed (`6c6016d`) | 53,369 / 58,037 ms  | 39,140 / 31,031 ms  | ✗      | 211/211         |
| **C**                 | **30,276 / 30,289 ms** | **15,184 / 15,134 ms** | ✗ | 211/211         |
| B                     | 67,239 / 62,763 ms  | 43,755 / 29,418 ms  | ✗      | 208/211         |
| B+C                   | 37,908 / 38,344 ms  | 17,807 / 18,122 ms  | ✗      | 208/211         |
```

Its reading of the numbers:

> **Flushing each outbox entry sets the floor.** N-02 writes 4,000 entries; at about 6.5 ms
> each, that is roughly 26 s on its own (arithmetic from the per-write cost, not a
> measurement).

That's a design trade-off between durability and speed. The engine stops and gives it to
the room, with numbers, rather than choosing.

<!-- RUN-QUOTES:08-CODE -->

## Under the hood

- **Plan approval is enforced by a hook, not by goodwill.** AI-DLC's
  plan-approval guard (`.claude\hooks\aidlc-plan-approval-guard.ts`, run by the
  `guard-tool-call` PreToolUse hook) blocks code edits in the unit's repo until the plan
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
  click Allow. Interactively, you just approve the prompt. The reference run, which was
  headless, used two routes. Early on, it switched the hook off for one approved turn.
  Later (D-015), the human pasted the drafted entry by hand. The second route is the better
  one: the guard never goes off, and the human's edit is the approval. Either way, check
  the `decisions.md` diff afterwards. In the reference run it was append-only every time,
  with D-001 to D-003 unchanged.
- **Your machine is part of the plan.** U1's plan assumed Node 22 and gitleaks. The
  reference machine had Node 24 and no gitleaks. The fix went through Request Changes: pin
  `engines` to `>=22`, and skip the secret scan with a warning when gitleaks is missing,
  recorded as a go-live gap. Don't install tools mid-gate to make a plan true; change the
  plan.
- **`aidlc-state.md` stays on "functional-design" through all of a unit's design stages.**
  Use `/aidlc --status`, or the stage folders under `construction/<unit>/`, to see where
  you really are.
- **Headless runs need one reply per stretch of work.** With `claude -p`, each reply ends
  the session, and with it the developer agent working in the background. The engine
  resumes from the branch on the next reply ("Steps 9–12 were committed before the last
  session ended"), so no work is lost, but U1 took several "continue" replies. In an
  interactive session the agent keeps going until the next stop.
- **Make the line-ending fix before a unit's review, never after.** On Windows,
  `core.autocrlf=true` checked the files out with CRLF, and Prettier failed 84 of them. The
  fix (`.gitattributes` with `* text=auto eol=lf`) landed *after* U1's review had said
  READY. Reviews are bound to fingerprints of the source, so the change made the review
  stale, and U1 had to be reopened. Put `.gitattributes` in every repo in step 01 (the
  notify seed has it), and run the repo's `verify` once before the first plan gate.
- **On v2.11.0, a reopened unit can't get a new review.** After the reopen, every review
  request came back `REVIEW_RECOVERY_SPENT`. The reopen had kept the unit's old review
  attempt, and that attempt's one recovery review was already used. The engine stopped
  and reported it as a likely defect; it did not work around it. AWS fixed it upstream
  (commit `4b99953`, "after a jump or reopen a Unit names its first review request"), in
  the v2.11.1 preview releases. The reference run switched the hub, mid-workflow, from
  then on:

  ```powershell
  aidlc config --channel preview
  aidlc update --channel preview     # 2.11.0 -> 2.11.1-preview.20261011.1; 2.11.0 is kept
  aidlc config --yes                 # in the hub: "Your open work ... carries on."
  aidlc engine plugin sync
  aidlc engine runtime compile       # doctor flagged the runtime graph as stale
  ```

  The next review got a new attempt key and came back READY, and U1 went on to its
  checkpoint. To go back: `aidlc config --pin 2.11.0 --yes`. Back up `aidlc/` and
  `.claude/` before you switch. If you're on a newer stable release, you won't hit this.
<!-- RUN-SNAGS:08 -->
