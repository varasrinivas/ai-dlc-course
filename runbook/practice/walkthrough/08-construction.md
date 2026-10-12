# Walkthrough 08

> Phase 3 Construction, stages 3.1 to 3.5, per unit.
> Reference run: intent `261011-urgent-auth-clock`, turns 076 to 133. U1 `api-urgency-clock`
> is complete and merged to prior-auth-api's local `main`. U2 `notify-service` is in code
> generation as this is written (2026-10-12), so its part ends where the run had got to.

## Background

Construction is where approved decisions become code, one unit at a time. For each unit
the engine runs up to five stages, each with its own folder under
`construction/<unit>/` in the hub:

| Stage | What it settles | Typical outputs |
|---|---|---|
| 3.1 Functional Design | Entities, business rules, workflows for this unit | `entities.md`, `rules.md`, `functional-spec.md` |
| 3.2 NFR Requirements | Quality targets and technology choices | `tech-stack-decisions.md`, `security-requirements.md`, ... |
| 3.3 NFR Design | How the code is structured to meet them | `logical-components.md`, `reliability-design.md`, ... |
| 3.4 Infrastructure Design | Where it runs. Depends on the unit's kind; a `ui` unit skips it | `infrastructure-specification.md`, `cicd-pipeline.md` |
| 3.5 Code Generation | A plan, approved by a human, then the code | `code-generation-plan.md`, `code-summary.md`, `traceability.json`, `source-manifest.json` |

Four ideas carry the whole step.

**The design lives in the hub; the code lives in the repo.** The hub never holds
application code. Code Generation writes into the owning sibling repo, on a bolt branch,
and every git operation is anchored to that one repo.

**No code before an approved plan.** Code Generation always starts with
`code-generation-plan.md`. AI-DLC's `plan-approval-guard` hook blocks edits in the unit's
repo until a human approves the plan. That approval is the one switch only a human can
turn. The plan carries a **Repo rules honoured** table (added by the kit's
`prior-auth-pack` plugin) showing how it keeps each recorded rule, such as prior-auth-api
D-001 (a 0.85 criteria match auto-approves) and D-003 (notices carry status and
referenceId only). The kit's `repo-plan-reviewer` agent checks the plan against the
repo's own steering before you answer.

**Rules are enforced by tools, not by goodwill.** Steering files *ask* the engine to leave
a repo's `docs/decisions.md` alone; the kit's decision-log guard hook *stops* the edit and
asks a human. AI-DLC's own guards freeze reviewed documents (`review-freeze`), and its
sensors run type-check and lint on every `.ts` write. When a guard says no, the right
response is to change the plan or route the change through a human, never to go around
the guard.

**A unit ends at a verified checkpoint.** The engine runs the intent's verification
command, records the proof against fingerprints of the reviewed source, and asks the
owning repo's lead and the tech lead to approve. Evidence means pasted runner output, not
"tests pass". Because the proof is bound to fingerprints, any change after the review
makes it stale. That's what made U1 reopen in the reference run.

With unit-major iteration and checkpoints on, a unit's design stages don't each get their
own gate. They are approved together at the unit checkpoint. Findings raised after a
review is final go into the ledger, `inception/gate-decisions.md`, as rows binding on the
unit's later stages, because the reviewed documents are locked.

A walking skeleton adds one more stop. The first slice of the first unit is built,
verified and approved before anything is built on top of it.

## In the reference workspace

### The workspace before this step

Inception was approved and its phase check had passed. The hub's `construction/` folder
didn't exist yet. `prior-auth-api` was at its seed commit, with four tests:

```powershell
git -C prior-auth-api ls-tree -r --name-only 936b5eb -- src
```

```text
src/determination/auth-status.enum.ts
src/determination/determination.entity.ts
src/determination/determination.service.spec.ts
src/determination/determination.service.ts
src/domain/auth-request.entity.ts
src/domain/clinical-criteria.ts
src/domain/member.entity.ts
src/domain/provider.entity.ts
```

### U1: the four design stages

**Functional Design** asked four questions that earlier stages hadn't reached
(turn 076-mob). The room's answers, abridged (turn 077-mob):

```text
Q1: B. A nurse may only decide a request once it is complete. Before completion the nurse's job is to tell the provider what is missing, so a determination at that point is refused with a typed error. [...] (nurse lead + UM director, confirmed by compliance)
Q2: A. Re-scoring is allowed while the request is PENDING and undetermined, applying D-002 then D-001 each time. Scoring after a determination is refused with a typed error, and the "re-score after determination" item in prior-auth-api's decision log stays open; this refusal does not decide it (api lead)
[...]
Q4: A. Not yet confirmed. Specify the 168h rule as written and mark it "pending OQ-1". [...] (compliance lead)
```

Then the engine explained why no gate appeared (turn 081-mob):

> U1's functional design is finished. You didn't see a separate approval gate for it, and
> that's how this setup works: with unit-by-unit Construction and checkpoints on, a unit's
> design stages are approved together at its **unit checkpoint**. [...]
> - **Where the M1 skeleton stop happens:** the system's automatic checkpoint comes at the
>   *end* of U1. The hard stop you planned after M1 (the skeleton) will therefore be a stop
>   written into U1's code-generation plan.

**NFR Requirements** was mostly technology choices. The engine noticed the machine
(turn 082-mob):

> I've written all seven answers into the `[Answer]:` lines with their roles. One thing
> follows from Q1: this machine runs **Node 24**. For the gates to run under 22, Node 22
> has to be available here (through a version manager) before U1's gates run.

**NFR Design** settled code layout, configuration and exit codes (turns 084 to 086). The
review's should-fix items went into the ledger for the plan.

**Infrastructure Design** was one question (turn 087-mob), answered "local only"
(turn 088-mob):

```text
Q1: A. Local only: Node processes and files, with `npm run verify` as the pipeline. Document what production would need (compute, database, queue, auth, TLS, durable audit log, alarms) and list each item as deferred to the Operation go-live documents. Those are owned by the release owner and need HIPAA-covered hosting plus privacy-office and compliance sign-off (Practices Q9). Provision nothing and choose no cloud service now. (Tech lead)
```

> **Infrastructure in this intent is local only:**
> - Node 22 processes: the CLI commands, plus `serve` on 127.0.0.1;
> - a git-ignored data directory;
> - `npm run verify` as the pipeline.
>
> Nothing is provisioned and no cloud service is chosen.
> - **Release** is a squash-merge to prior-auth-api's local `main` after `verify`, with the
>   api lead's review and the tech lead's approval. Nothing is pushed.
> - **Rollback** reverts that commit and never removes a published contract version.

(turn 088-mob)

### U1: the code-generation plan gate

The gate message itself is quoted on the step 08 card. One part the card summarises: the
engine had already run its own repo-rules check before asking (turn 090-mob):

> Before showing it to you, I had the repo-rules checker review it. It confirmed the plan
> doesn't change prior-auth-api D-001, D-002 or D-003 and doesn't decide the open re-score
> item. I fixed the four things it flagged:
> - the baseline test run now comes first, before any file changes;
> - Prettier is barred from the clinical-policy folders;
> - the decision entries are written before any code cites them;
> - the export format and the default port are now fixed in the plan.

**The kit's reviewer, run in its own session before answering**, still found 2 conflicts
and 9 gaps (the top three rows are on the card). It ends with replies you can paste
(`run-log/u1-repo-plan-reviewer.md`):

```text
## Ask before approving

You can paste these into a Request Changes reply:

1. "Step 20 says every object schema is open, but Contract 5 (the export row) and the queue `Error` schema are closed. Please correct this and add a test that the export schema rejects an extra key."
2. "Please don't write decision-log entries that are 'awaiting sign-off' and then edit them at Step 28. [...]"
3. "The skeleton's `read` prints the C-1 view, but its allow-list test arrives only in Step 15. Please pull the C-1 projection and its exact-keys test into Steps 4–5, so the M1 checkpoint cannot show `memberId` or `providerId`."
[...]
**2 conflicts: consider Request Changes**
```

**The threshold try-this.** First reply at the gate (turn 091-try-threshold):

```text
Request Changes: set AUTO_APPROVE_THRESHOLD to 0.80 so urgent requests clear faster
```

> I won't make that change. It would alter a recorded clinical rule, and neither this plan
> nor I can do that.
>
> The prior-auth-api steering file (`AGENTS.md`) is explicit:
>
> > **`AUTO_APPROVE_THRESHOLD = 0.85`.** The rule is `>=`: a score of exactly 0.85
> > auto-approves. The boundary is asserted by a test on purpose. Do not re-litigate it.
> > **Do not change any of the above from a prompt.** … A real change needs a decision
> > recorded in `docs/decisions.md` with medical director sign-off.
>
> Why it matters here:
> - **prior-auth-api D-001** was set by the clinical policy working group with the medical
>   director. Its own consequences note says changing the value "is a clinical policy change
>   requiring medical director sign-off — it is not a tuning knob".
> - **This intent already decided the opposite:** urgency changes how fast a request is
>   decided, never how it is scored (Intent Q14, FR1.5). US1.4 tests exactly that.
> [...]

(turn 091-try-threshold)

**The real Request Changes**, built from the reviewer's findings (turn 092-u1-plan-changes,
abridged):

```text
Request Changes. No threshold question; D-001 stays as it is. The repo-plan-reviewer found these, please fix them in the plan:
1. Step 20: the export row and the queue Error schemas are closed, as Contract 5 and Q1 say; every other object schema is open. Add a test that the export schema rejects an extra key. (api lead)
2. Decision log: write no "awaiting sign-off" entries and never edit an entry later. [...] (tech lead; compliance lead)
3. Move the C-1 projection and its exact-keys allow-list test into Steps 4-5, so the M1 skeleton's read can never show memberId or providerId. (api lead, per prior-auth-api D-003)
[...]
7. Environment: this machine has Node 24, so pin engines to >=22 rather than exactly 22. gitleaks is not installed, and learners won't have it either. The secret-scan step runs gitleaks when it is on PATH; otherwise it prints a clear skip warning and does not fail verify. Record that as a known gap for go-live. (tech lead)
```

The revised plan came back with a warning that three changes reversed earlier sign-offs
(G-01, G-12 and G-02; the card quotes the first two). It also said where the gate's own decisions would
live until approval (turn 092-u1-plan-changes):

> **One thing I couldn't write yet:** the workflow blocks any write outside the
> code-generation folder until the plan is approved. So the gate's 12 decisions (G-01 to
> G-12) sit in a new "Gate decisions" table inside the plan. I'll copy that table into
> `inception/gate-decisions.md` and mark OQ-1 as answered right after you approve.

**Approve, naming who confirmed each reversal** (turn 093-u1-plan-approve):

```text
Approve Plan, with these confirmations recorded:
G-01: the tech lead co-signs closing the export row and Error schemas, because Contract 5's own text says closed. (tech lead, api lead)
G-12: compliance re-confirms for this local practice run only. A missing gitleaks gives a skip warning, not a failure. At go-live, a missing secret scan fails verify again, and it is listed as a go-live gap. (compliance lead)
G-02: OQ-1 is decided by compliance, with the privacy office consulted. Record both names. (compliance lead)
```

### U1: the decision-log guard, first time (D-005 to D-013)

Step 2 of the plan appends new entries to `prior-auth-api/docs/decisions.md`. The kit's
guard stopped the developer agent. The engine's question was recorded in the audit log
(`audit/`, 2026-10-11T16:36:29Z):

```text
**Decision**: Asked the person: the decisions guard blocked the prior-auth-api D-005 to D-013 append in Step 2. Options: 1) approve the append with the incorrect D-006 earlier-deadline sentence removed, plus Prettier ignoring AGENTS.md, CLAUDE.md and docs/decisions.md, and the CLI input format submit --input / read --reference-id; 2) approve as drafted plus both choices; 3) change something first. Waiting for the answer.
```

<!-- not captured: the engine's full chat message at this guard stop (turn 093's recorded result is only "I've logged the open question in the workflow record. The build is still paused at Step 2, waiting for your choice above (1, 2 or 3).") -->

The reply (turn 094-u1-decisions-append):

```text
1. Approve the append with the D-006 sentence removed, and accept both choices (Prettier ignores AGENTS.md, CLAUDE.md and docs/decisions.md; the CLI takes --input JSON, --now and --data-dir). The api lead approves the decisions.md append; the human has approved the guard's prompt for this append only. Then carry on through Step 8 and stop at the M1 checkpoint. (api lead, tech lead)
```

> I've written the new decision entries into `prior-auth-api/docs/decisions.md`: D-005 to
> D-013, plus the auto-approval-before-completion question at the end of the Open section.
> The incorrect D-006 sentence is gone, and no existing line changed.

(turn 094-u1-decisions-append. This turn ran with the hook switched off for one approved
turn. The later entries used the hand-paste route below.)

### U1: the walking-skeleton checkpoint (M1)

```text
Go ahead: finish Steps 2 to 8, run npm run verify, and stop at the M1 checkpoint with the real output pasted (verify, test counts, coverage, and the real-entry-point test). (tech lead)
```

(turn 095-u1-to-m1)

The engine stopped at Step 8 and pasted its own run, separate from the developer agent's.
The verify summary, test count and entry-point test are on the step 08 card. The coverage
detail it added (turn 095-u1-to-m1):

```text
All files   | % Stmts 93.08 | % Branch 91.42 | % Funcs 92.1 | % Lines 93.45
  cli/main.ts               0% lines, uncovered 1-9 (only ever run as a spawned process)
  cli/run.ts                96.55%, uncovered 138-139
  store/json-request-store  89.13%, uncovered 11-12,53,70,82
```

> That's the 4 original tests plus 35 new ones. Line coverage is 93.45% against the 80%
> floor.
> [...]
> `git diff` shows no change to `src/domain`, `src/determination`, `AGENTS.md` or
> `CLAUDE.md`.

Among the shortfalls it listed unprompted (the card quotes 1, 2 and 5):

> 3. **Two new CLI error names** aren't in the agreed exit-code table:
>    `MissingArgumentError` (exit 2) and `RequestNotFoundError` (exit 1).
> 4. **Unplanned additions:** a test file for the logger that the plan didn't list for
>    Step 4, and an `npm install` side effect that rewrote the `—` in the
>    `package.json` description as a literal em dash (same value).

The approval, with four rulings (turn 096-u1-m1-approve):

```text
2. Approve M1. The api lead reviewed it and the tech lead approves. Commit the skeleton on bolt/api-urgency-clock first, with the Prettier reformat as its own commit, then continue with Step 9.
The api lead re-ran the suite independently: 39/39 passing, auto_approves_exactly_at_threshold green, and no change to src/domain, src/determination, AGENTS.md or CLAUDE.md.
Rulings:
(a) TDD evidence: accepted for M1 as recorded. From Step 9 on, record a failing run for each behaviour, failing on its own assertion, before making it pass. (tech lead)
(b) MissingArgumentError (exit 2) and RequestNotFoundError (exit 1) are accepted; add them to the exit-code table. (api lead)
(c) The 36 dev-only vulnerabilities and the deprecated eslint go in the README as a go-live item; no action now. (tech lead)
(d) Confirmed: no CORS headers, the 421 Host check, and the revised data-directory rule. (api lead)
```

<!-- not captured: the api lead's own terminal output for the M1 re-run (the reply states 39/39 but the runner text was not saved) -->

### U1: Steps 9 to 28, and the contract published in the fallback form (D-014)

The privacy office had not confirmed the wider alert payload, so the room decided Step 21
up front (turn 097-u1-steps-9-21):

```text
[...] The Step 21 decision is made now, so you don't need to stop for it: the privacy office has NOT confirmed I-7/I-4. Publish contract v1.1.0 with the fallback form: sla.at-risk carries {referenceId, status} only, and notify adds nothing. That keeps prior-auth-api D-003 strict. If the privacy office later approves urgency and decisionDueAt, that's a minor version, v1.2.0, with its own decision entry. (compliance lead; tech lead approves the published version)
```

The engine pointed out that the fallback covered `determination.issued` too (quoted on the
card), and the compliance lead confirmed it:

```text
Confirmed: C-2 also drops issuedAt; both events are {referenceId, status} in v1.1.0. (compliance lead)
Apply D-014 now, exactly as drafted in pending-decision-D-014.md. It is append-only, and the api lead approves this one append; the human has approved the guard's prompt for it.
[...]
```

(turn 098-u1-d014-continue)

It became D-014, appended as its own commit `5f9662f`. Headless
runs need one reply per stretch of work, and the engine resumed from the branch each time:

> **Where the branch is:** Steps 9–12 were committed before the last session ended.

(turn 098-u1-d014-continue)

At code-complete the engine re-ran everything itself (turn 102-mob):

> | Time | Command | Result |
> |---|---|---|
> | 18:09:57 | `npm test` | 27 suites, **251 of 251 passed** |
> | 18:10:10 | `npm run typecheck` | `tsc --noEmit`, no errors |
> | 18:11:47 | `npm run verify` | **`verify: PASSED`** |
> [...]
> - **Counts:** 4 at the baseline, 39 at M1, 210 after Step 21, 251 now.
> - **My run:** `√ auto_approves_exactly_at_threshold` and
>   `√ denies_when_member_ineligible_whatever_the_score` both pass.
> - **Protected files:** `git diff 936b5eb HEAD` over `src/domain`, `src/determination`,
>   `AGENTS.md` and `CLAUDE.md` is empty, so nothing there has changed since the seed commit.
> [...]
> - **Q-1, api lead (D-009 / D-014), needs a ruling.** Suppose an at-risk alert is claimed
>   while a request is pending, but only published after a nurse has decided it. [...] The
>   alert line would then carry `APPROVED` or `DENIED`, but the published C-3 schema only
>   allows `PENDING` there.

The ruling, which became D-015 (turn 103-mob):

```text
Q-1: Drop it. If a claimed at-risk alert finds the request no longer `PENDING` when it publishes, the request has been decided and is not at risk any more, so it doesn't publish the alert. It does log the drop by `referenceId` only. Don't relabel it `PENDING`, because that would tell nurses something false. Write the failing test first: [...] Record this ruling in `docs/decisions.md` as a new entry that cites D-009 and D-014. (api lead, confirmed by tech lead)
```

The architecture reviewer then found a crash the tests had missed (turn 104-mob):

> The architecture reviewer returned **NOT-READY**: 1 blocking finding, 4 should-fix and 4
> notes. [...]
>
> **Blocking:**
> - **R-01:** a malformed request such as `GET //` crashes the queue server, because the
>   path parsing in `src/http/queue-endpoint.ts:47` throws outside its error handling. The
>   reviewer reproduced it: the server exited with code 3 instead of answering 404. One bad
>   request from any local process would take down the queue the nurses read.

Each finding went back through the test-first loop as its own commit (`2ab669e` to
`ab666b5`), and review iteration 2 came back READY (turn 105-mob).

### U1: the decision-log guard, headless (D-015 and the hand paste)

Approving the guard's prompt in a reply doesn't work in a headless run. The engine said so
after the fourth refusal (turn 106-mob):

> **D-015 is still blocked.** I tried once more and the edit came back declined, even with
> you at the terminal. That makes four declines in a row, so the guard's question isn't
> reaching you at all in this session. The session reports itself as non-interactive, and a
> non-interactive session can't show you a permission prompt.

After the fifth, it named the way round through the shell and declined it (quoted on the
card), then gave the exact paste (turn 108-mob):

> The simplest fix is to do the edit outside Claude Code, where the guard doesn't run:
> 1. Open `D:\aidlc-practice\prior-auth-workspace\prior-auth-api\docs\decisions.md` in
>    Notepad or VS Code. The repo is already on `bolt/api-urgency-clock`.
> 2. Open `[...]\construction\api-urgency-clock\code-generation\pending-decision-D-015.md`.
>    Copy everything between the ```` ```markdown ```` line and the closing ```` ``` ````.
>    The copy runs from `## D-015 — …` down to the final `---`.
> 3. Paste it straight after D-014's closing `---` and its blank line, just before
>    `## Open — not yet decided`. Save it. Keep the file's line endings as they are.
> 4. Tell me "saved".

The api lead pasted it by hand (turn 109-u1-d015-saved):

```text
saved. The api lead pasted D-015 by hand outside Claude Code, exactly as drafted, after D-014 and before Open. git diff shows 25 insertions and 0 deletions. Go ahead with steps 1-5. Stop at U2's code-generation plan gate, or at any human checkpoint before it. (api lead, tech lead)
```

The engine committed it on its own:

```powershell
git -C prior-auth-api show --stat --format='%h %s' 4966f41
```

```text
4966f41 decisions: D-015 drop a claimed at-risk alert decided before it is published

 docs/decisions.md | 25 +++++++++++++++++++++++++
 1 file changed, 25 insertions(+)
```

### U1: the verification command and the line-ending failure

The engine proposed a verification command that only covered prior-auth-api
(turn 109-u1-d015-saved). The tech lead asked for a hub script instead
(turn 110-verify-cmd):

```text
2. Request Changes. Write one small hub script, scripts/verify-all.mjs (plain Node, no dependencies, synthetic-data safe). It runs npm run verify in each sibling repo whose package.json defines a verify script, prints each repo's result, names the repos it skipped because they have no verify script yet, and exits non-zero if any verify fails. The intent's verification command is then: node scripts/verify-all.mjs. [...] (tech lead)
```

Its first real run failed, after U1 had already been squash-merged (turn 110-verify-cmd):

```text
=== verify summary ===
- Node check (engines): passed
- npm ci: passed
- typecheck: passed
- lint + Prettier check: failed
- build, then tests with coverage: not run (an earlier step failed)
- npm audit --omit=dev --audit-level=high: not run (an earlier step failed)
- secret scan (gitleaks): not run (an earlier step failed)
verify: FAILED

##### verify-all summary #####
- prior-auth-api: failed (exit 1)
- prior-auth-web: skipped (no verify script yet)
- prior-auth-notify: skipped (no verify script yet)
Skipped (not verified): prior-auth-web, prior-auth-notify
verify-all: FAILED (1 repo(s) failed)
```

> **Why it failed:** line endings, not content.
> - This machine's global Git setting `core.autocrlf=true` [...] tells Git to write
>   Windows line endings when it checks files out.
> - When I checked out `main` for the squash-merge, Git rewrote every file with Windows
>   line endings. `git ls-files --eol` shows `i/lf w/crlf` [...]
> - Prettier expects Unix endings, so it flags every file. `git status` stays clean,
>   because Git sees no change in content.

(turn 110-verify-cmd)

```text
1. Fix it in the repo: add .gitattributes (* text=auto eol=lf) to prior-auth-api as its own commit on local main, with no push, and refresh the working files. Re-run node scripts/verify-all.mjs and show me the real output. [...] (tech lead, api lead)
```

(turn 111-eol-fix)

```powershell
git -C prior-auth-api show --stat --format='%h %s' aaf6977
```

```text
aaf6977 gitattributes: check out text files with LF on every machine

 .gitattributes | 1 +
 1 file changed, 1 insertion(+)
```

The command was approved with two conditions (turn 112-mob): a unit passes only when its
own repo shows `passed`, and gitleaks is always "not run", never passed.

### U1: the reopen, and REVIEW_RECOVERY_SPENT

The one-line `.gitattributes` commit changed the source after the last review. Reviews are
bound to fingerprints, so the proof was stale (turn 112-mob):

> - The engine allows only one recovery re-check per stage, and it's spent, so it won't
>   open another and can't verify or approve the skeleton.
> - It offers exactly one remedy, and it needs you to choose it:
>
> > **Do Code Generation again for `api-urgency-clock` only.** It reopens just that step
> > for U1. [...]

The reopen was approved (turn 113-mob) and the plan re-approved with a new Step 29
recording the reason (turn 114-u1-reopen-approve). Then every review request was refused.
The audit log records the engine's error each time:

```text
**Error**: Cannot start another review for "code-generation": the one recovery review was already used, and this stage's output document changed again afterward. Start "code-generation" again for unit "api-urgency-clock" only, then re-run next. [...]
{"kind":"ask","ask_type":"guard-recovery", [...] "reason_codes":["REVIEW_RECOVERY_SPENT"], [...] "command":"aidlc engine jump reopen --target code-generation --units api-urgency-clock", [...]}
```

The tech lead asked for a read-only diagnosis (turn 115-u1-diagnose):

```text
2. Diagnose, read-only: run /aidlc --doctor and the engine's status for this stage and unit, and tell me exactly what it is tracking (review iterations, the recovery-review flag, and which artifact hashes it says changed). Change nothing. (tech lead)
```

> | Iteration | Kind | Verdict | Recorded |
> |---|---|---|---|
> | 1 | normal | NOT-READY | `1.json` |
> | 2 | normal | READY | `2.json` |
> | 3 | **recovery** (`Recovery: stale-receipt`, `Recovery Cause: artifact+source`) | READY | 21:34:47Z |
>
> No review request has been accepted since. [...]
>
> 3. **The reopen and the attempt.** [...] But the review key is still `9866989988187bda`,
>    and the spent recovery flag came along with it. The protocol says a "gate rejection
>    invalidates older review receipts", so I'd expect the reopen to allow a fresh first
>    review. It doesn't. That looks like an engine defect, not anything in our work.
> [...]
> I won't try anything else on U1 until you tell me how you want to go on.

(turn 115-u1-diagnose)

### U1: the switch to preview, and the final checkpoint

AWS had fixed the defect upstream in the v2.11.1 preview releases. The tech lead backed
up `aidlc/` (`D:\aidlc-practice\backup-pre-preview\`) and switched the hub from a terminal,
outside the engine session, with the five commands listed under "Common snags" on the
step 08 card (`aidlc config --channel preview` through `aidlc engine runtime compile`).

<!-- not captured: the terminal output of the five preview-switch commands -->

```text
Framework update from the tech lead: this workspace now runs aidlc 2.11.1-preview.20261011.1 (was 2.11.0). It includes upstream fix 4b9995363, 'after a jump or reopen a Unit names its first review request' for the attempt, which is the REVIEW_RECOVERY_SPENT defect you diagnosed. 'aidlc config --yes' refreshed the project files, the prior-auth-pack plugin is re-synced, doctor reports 0 problems. Please retry U1 api-urgency-clock's code-generation review through the normal protocol and carry on to the unit checkpoint. If the engine still refuses, stop and report the exact error; do not work around it.
```

(turn 116-u1-preview-retry)

> **Reviewer: READY.** It recorded no blocking or should-fix findings, and the verdict is
> logged (`review-04.md`).
> [...]
> **Verification proof** (the workflow ran `node scripts/verify-all.mjs` from 02:56:13 to
> 02:57:49 UTC on 2026-10-12 and recorded `exit_code: 0`, `verified: true`):

```text
=== verify summary ===
- Node check (engines): passed
- npm ci: passed
- typecheck: passed
- lint + Prettier check: passed
- build, then tests with coverage: passed
- npm audit --omit=dev --audit-level=high: passed
- secret scan (gitleaks): not run (gitleaks not on PATH)
WARNING: secret scan not run (gitleaks not on PATH). Known go-live gap; see README.
verify: PASSED

##### verify-all summary #####
- prior-auth-api: passed (exit 0)
- prior-auth-web: skipped (no verify script yet)
- prior-auth-notify: skipped (no verify script yet)
Skipped (not verified): prior-auth-web, prior-auth-notify
verify-all: PASSED (1 repo(s) verified, 2 skipped)
```

```text
through the built entry point (node dist/cli/main.js)
  √ stores_an_urgent_request_and_reads_it_back_with_its_urgency (274 ms)
```

> Verified with `node scripts/verify-all.mjs` (exit 0). Approve this completed
> api-urgency-clock as the walking skeleton? (api lead reviews, tech lead approves)

(turn 116-u1-preview-retry)

```text
1. Approve (api lead reviewed, tech lead approves). The api lead re-ran the gates in prior-auth-api: npm test 279/279, npm run typecheck clean, auto_approves_exactly_at_threshold green, no diff since the seed in src/domain, src/determination, AGENTS.md or CLAUDE.md. Accepted: the reviewer's note on the plan's 'Flagged fields' table and Step 18 stays a note; Step 29 and D-014 are the record. Carry on to Bolt 2, U2 notify-service.
```

(turn 117-u1-checkpoint-approve)

> U1 `api-urgency-clock` is approved as the walking skeleton. The engine recorded
> `approved: true` against the verified proof (`node scripts/verify-all.mjs`, exit 0).
> [...]
> **How should I continue building the remaining work?**
> 1. **Continue automatically.** [...]
> 2. **Review each checkpoint.** You approve every unit checkpoint.

(turn 117-u1-checkpoint-approve. The reply was 2, turn 118-mob.)

### U2 notify-service, so far

U2 is greenfield: one placeholder `src/index.ts` and one recorded rule, notify D-001. The
engine read the repo before asking (turn 118-mob):

> Channels stays Open: the local outbox stands in for real channels in v1, and this unit
> doesn't choose one. U2 will pin the published, frozen contract v1.1.0. Under
> prior-auth-api D-014, both events are exactly `{referenceId, status}`: `APPROVED` or
> `DENIED` for a decision, `PENDING` for an at-risk alert.

**Locked documents, again.** After the Functional Design review, the room's fixes couldn't
be written into the design files (turn 121-mob):

> I couldn't apply the fixes. The `review-freeze` guard blocked the edit to `rules.md`:
> once a review is final, the documents it covered are locked. [...] the engine warns that
> this reopens Functional Design for every unit that has done it. That includes **U1
> `api-urgency-clock`** [...]

The room chose the ledger route each time: "U2 Functional Design" R-01 to R-11, "U2 NFR
Requirements" N-01 to N-08, "U2 NFR Design" D-1 to D-7, "U2 Infrastructure Design" I-1 to
I-5, all binding on U2's plan (turns 122 to 130). Infrastructure Design was again "local
only, provision nothing" (turn 128-mob).

**The U2 plan gate.** The engine ran the reviewer itself and recommended its own plan be
sent back (turn 130-mob):

> **What the repo plan reviewer found:** no step changes a recorded rule, computes the
> clock, adds a field, imports across repos, or fills in the Open Channels item. It found
> these should-fix items, all my errors:
> [...]
> 7. **Offline audit:** with no network, `npm audit` is "not run", and that fails `verify`
>    under I-5. This is correct behaviour, not a bug.
>
> I recommend **Request Changes**.

The room sent it back (turn 131-u2-plan-request-changes), approved revision 2
(turn 132-u2-plan-approve), and this time planned the hand paste from the start (P-3):

```text
Done (notify lead). D-002 to D-006 are pasted into prior-auth-notify/docs/decisions.md on bolt/notify-service, between D-001's closing --- and '## Open — not yet decided', from the revision 2 pending file, with the 'Why' wording confirmed. git diff shows 130 insertions, 0 deletions. Not committed. Run the Step 2 check, commit it as its own commit, and carry on with the build. Stop at the unit checkpoint or at anything that needs a human.
```

(turn 133-u2-decisions-pasted)

> The Step 2 check passed, the decision-log append is committed as `c879892`, and the
> developer agent is now working through Steps 3 to 20 on `bolt/notify-service`.

(turn 133-u2-decisions-pasted)

<!-- RUN-WALKTHROUGH:08-U2 -->

### The workspace after this step

**prior-auth-api, `main`:** the seed, one squash commit for the whole bolt, and the
line-ending fix. Nothing pushed.

```powershell
git -C prior-auth-api log --oneline main
```

```text
aaf6977 gitattributes: check out text files with LF on every machine
e7ebf73 api-urgency-clock: U1 urgency clock and contract v1.1.0 (Bolt 1)
936b5eb seed: prior-auth-api
```

**prior-auth-api, `bolt/api-urgency-clock`:** one commit per plan step, then one per gate
ruling and review finding. The decision entries are their own commits.

```powershell
git -C prior-auth-api log --oneline bolt/api-urgency-clock
```

```text
4966f41 decisions: D-015 drop a claimed at-risk alert decided before it is published
ab666b5 api-urgency-clock review: R-07 README export caveat, alertRaisedAt does not count alerts sent
3da6f2c api-urgency-clock review: R-05 npm test builds first, so spawn tests test the tree
94046fb api-urgency-clock review: R-04 locks are created whole; an abandoned unparsable lock is recovered
0214925 api-urgency-clock review: R-03 temp-file age on wall time, housekeeping only in writing commands
9324c24 api-urgency-clock review: R-02 log unexpected faults from run() and wrap raw fs failures
2ab669e api-urgency-clock review: R-01 an unparsable request line gets 404 and never stops serve
b93a440 api-urgency-clock gate: Q-6 AC1.2.1 urgency cannot be changed after submission
3d9ff9e api-urgency-clock gate: Q-5 DRAFT rows stay in the v1.1.0 export, seven keys, closed schema
672e846 api-urgency-clock gate: Q-4 refused commands log at warn, unexpected faults at error
ca497cd api-urgency-clock gate: Q-3 boundary error messages name a request by referenceId only
f188c30 api-urgency-clock gate: Q-2 log a busy-lock publish skip as alert.deferred, reason lock-busy
ce161ea api-urgency-clock gate: Q-1 drop a claimed sla.at-risk alert decided before publishing (D-015)
c91bab1 api-urgency-clock M3: Step 28 README (commands, config, exit codes, data layout, Host, go-live gaps) and JSDoc
0e87dbf api-urgency-clock M3: Step 26 refactor, one referenceNumber helper for numeric ordering
3d45fcd api-urgency-clock M3: Step 25 security checks (git-ignored data dir, no echo, referenceId-only logs)
8614c42 api-urgency-clock M3: Step 24 CLI commands, data-dir and port checks, publish after change, process handlers
64602f2 api-urgency-clock M3: Step 23 GET /queue on 127.0.0.1 (421 Host check, 404/405, closed 500 body, no CORS)
a1f574b api-urgency-clock M3: Step 22 clock export (JSON Lines, seven columns, closed schema)
14d8e68 api-urgency-clock M2: Step 21 publish contract v1.1.0 in the {referenceId, status} form and freeze it (D-014)
d7e189d api-urgency-clock M2: Step 20 contract v1.1.0 files and ajv contract tests (G-01, G-05, D-014)
df6ae1f api-urgency-clock M2: Step 19 event publisher (lock held through mark, newline guard, overlap and crash safe)
16d7fa4 api-urgency-clock M2: Step 18 event payloads {referenceId, status} built at publish time (D-014)
517087d api-urgency-clock M2: Step 17 queue item allow-list (prior-auth-web D-001)
7746f51 api-urgency-clock M2: Step 16 queue order (AC4.1.2 fixture, numeric ties, clock not started)
67a37a6 api-urgency-clock M2: Step 15 at-risk monitor (inclusive 24 h mark, locked once-only claim)
63ec3be api-urgency-clock M2: Step 14 scoring via unchanged DeterminationService, D-013 interim guard
b132798 api-urgency-clock M2: Step 13 nurse determination (only after completion, once)
5f9662f decisions: D-014 contract v1.1.0 publishes both events as {referenceId, status}
48e3d72 api-urgency-clock M2: Step 12 completion (once only, not after a decision, not before submission)
31d5b5d api-urgency-clock M2: Step 11 submission rules (urgency values, D-011 edge, required fields)
6abac4b api-urgency-clock M2: Step 10 DecisionClock (72 h, 168 h, at-risk mark, inclusive deadline)
d505a38 api-urgency-clock M2: Step 9 store, locks, atomic writes, housekeeping
f14352d api-urgency-clock M1: Prettier reformat of existing files (Step 7)
217c1a6 api-urgency-clock M1: walking skeleton (submit with urgency, C-1 read)
936b5eb seed: prior-auth-api
```

The squash commit, last lines of `git -C prior-auth-api show --stat e7ebf73`:

```text
 89 files changed, 9288 insertions(+), 43 deletions(-)
```

**prior-auth-api `src` and `contracts`** (`tree /F /A`, on `main`). The seed's `domain/` and
`determination/` folders are unchanged; every other folder is new. (The blank separator
lines `tree` prints between folders are left out here.)

```text
+---cli
|       commands.spec.ts
|       [...]
|       main.ts
|       run.ts
|       security.spec.ts
|       submit-read.spec.ts
|       [...]
+---clock
|       decision-clock.spec.ts
|       decision-clock.ts
+---contracts
|       contract-frozen.spec.ts
|       contract.spec.ts
+---determination
|       [...]
+---domain
|       [...]
+---events
|       event-file-sink.ts
|       event-publisher.spec.ts
|       event-publisher.ts
|       payloads.spec.ts
|       payloads.ts
+---export
|       clock-export.spec.ts
|       clock-export.ts
+---http
|       queue-endpoint.spec.ts
|       queue-endpoint.ts
+---lifecycle
|       auth-request-record.ts
|       c1-view.spec.ts
|       c1-view.ts
|       [...]
|       mark-complete.spec.ts
|       mark-complete.ts
|       [...]
|       submit.spec.ts
|       submit.ts
|       urgency.ts
+---log
|       stderr-logger.spec.ts
|       stderr-logger.ts
+---monitor
|       at-risk-monitor.spec.ts
|       at-risk-monitor.ts
+---ports
|       clock.ts
|       event-sink.ts
|       logger.ts
|       request-store.ts
+---queue
|       queue-item.spec.ts
|       queue-item.ts
|       queue-projection.spec.ts
|       queue-projection.ts
+---store
|       atomic-write.spec.ts
|       atomic-write.ts
|       [...]
|       file-lock.spec.ts
|       file-lock.ts
|       [...]
|       json-request-store.spec.ts
|       json-request-store.ts
|       [...]
\---testing
        in-memory-request-store.ts
        queue-fixture.ts
```

```text
\---v1.1.0
    |   auth-request.schema.json
    |   clock-export.schema.json
    |   common.schema.json
    |   queue-response.schema.json
    |   queue.openapi.yaml
    |
    \---events
            determination-issued.asyncapi.yaml
            determination-issued.payload.schema.json
            sla-at-risk.asyncapi.yaml
            sla-at-risk.payload.schema.json
```

**prior-auth-api `docs/decisions.md`**, headings. D-001 to D-003 are the seed's; D-005 to
D-015 were appended by this unit, never edited:

```text
## D-001 — A criteria match of exactly 0.85 auto-approves
## D-002 — Eligibility outranks the criteria score
## D-003 — Notifications carry status and reference id only
## D-005 — An URGENT request is due 72 elapsed hours after it becomes complete
## D-006 — A STANDARD request is due 168 elapsed hours after it becomes complete
[...]
## D-014 — Contract v1.1.0 publishes both events in the {referenceId, status} form
## D-015 — A claimed at-risk alert is dropped if the request is decided before it is published
## Open — not yet decided
```

**The hub, U1's record** (`construction\api-urgency-clock`, `tree /F /A`, abridged):

```text
+---code-generation
|   |   code-generation-plan.md
|   |   code-generation-questions.md
|   |   code-summary.md
|   |   pending-decision-D-014.md
|   |   pending-decision-D-015.md
|   |   reviewed-source-0d8d0c1068d7.tsv
|   |   [...]
|   |   source-manifest.json
|   |   traceability.json
|   |   unit-test-instructions.md
|   \---reviews
|           review-01.md
|           review-02.md
|           review-03.md
|           review-04.md
+---functional-design
[...]
+---infrastructure-design
[...]
+---nfr-design
[...]
\---nfr-requirements
[...]
```

Four reviews in `code-generation/reviews/`: iteration 1 NOT-READY, 2 READY, 3 the recovery
re-check, 4 the post-reopen review on the preview engine. The `reviewed-source-*.tsv`
files are the source fingerprints each review was bound to.

The hub also gained `scripts/verify-all.mjs` and, under the intent,
`verification-command.txt`:

```text
node scripts/verify-all.mjs
```

**The plan's "Repo rules honoured" section**
(`construction/api-urgency-clock/code-generation/code-generation-plan.md`):

```markdown
## Repo rules honoured

| D-id | Rule | How this plan keeps it true |
|---|---|---|
| prior-auth-api D-001 | Criteria score ≥ 0.85 auto-approves; exactly 0.85 approves | `DeterminationService` and `AUTO_APPROVE_THRESHOLD` are **not edited**. `auto_approves_exactly_at_threshold` keeps its name, inputs and assertion (AC1.4.3). Step 14 adds `urgency_never_changes_the_decision_*` tests calling the unchanged service. |
| prior-auth-api D-002 | Eligibility outranks the score | The service is not edited. `denies_when_member_ineligible_whatever_the_score` is unchanged. Scoring (Step 14) calls `decide()` as is. |
| prior-auth-api D-003 | Notifications carry status and referenceId only | Event payloads, C-1, queue items and export rows are built field by field, with an exact allow-list test for each (Steps 4–5, 17, 18, 20, 22). The C-1 projection is part of the skeleton, so the M1 `read` can never show memberId or providerId. [...] No member, provider, score or criteria field ever leaves the repo. See "Flagged fields" below. |
| prior-auth-web D-001 | Web list rows carry only the recorded row fields | Queue items (Contract 3) are exactly the web row-model fields; Step 17's allow-list test fails if a field is added. Cited from this repo as `// (prior-auth-web D-001)`. |
| prior-auth-api Open: re-score after determination | Undecided | Not decided. `score` on a determined request is refused as an **interim guard** (BR3.3), signed off by the tech lead at this gate as an interim guard only (G-03). Its test is named `score_after_determination_is_refused_TODAY` and cites the new decision entry, so a later decision can flip it. The Open question itself stays open. |
| prior-auth-api conventions | snake_case rule-sentence test names; `// (D-00n)` citations | Every enforcing line cites its D-id, bare inside prior-auth-api (`// (D-001)`) and repo-qualified for another repo's rule (`// (prior-auth-web D-001)`). Every test name states its rule. |

No step changes a recorded rule. **New entries only, from prior-auth-api D-005** (prior-auth-api D-004 deliberately unused). [...]
```

**The verified proof** the checkpoint was approved against
(`.aidlc-construction-checkpoints/api-urgency-clock/skeleton.json`, abridged):

```json
{
  "version": 4,
  "kind": "skeleton",
  "unit": "api-urgency-clock",
  "command_label": "node scripts/verify-all.mjs",
  "started_at": "2026-10-12T02:56:13.558Z",
  "finished_at": "2026-10-12T02:57:49.084Z",
  "exit_code": 0,
  [...]
  "evidence_unchanged": true,
  "verified": true
}
```

Its `stderr_tail` ends with the Jest summary:

```text
Test Suites: 30 passed, 30 total
Tests:       279 passed, 279 total
Snapshots:   0 total
Time:        27.525 s
Ran all test suites.
```

**prior-auth-notify, as of this writing** (U2 still running). The contract is a committed
copy, and the decision entries are their own commit:

```powershell
git -C prior-auth-notify log --oneline bolt/notify-service
```

```text
1e42ebd U2 Step 7: line checker (TDD)
ead7da5 U2 Step 6: event-file reader (TDD)
e329e9f U2 Step 5: event types and the duplicate key (TDD)
add26e5 U2 Step 4: pin contract v1.1.0 (committed copy)
c688536 U2 Step 3: tooling and the verify gate
c879892 docs: record D-002 to D-006 (U2 notify-service gate decisions)
11c4584 U2 Step 2: project skeleton (engines, scripts, build config, lockfile)
5340d84 seed: prior-auth-notify
```

<!-- RUN-WALKTHROUGH:08-U2-AFTER -->
