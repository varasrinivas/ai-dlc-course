# Lab M39 — Build the walking skeleton through a verified checkpoint

> Module: M39 — Construction on the Engine
> Audience: practitioner · Estimated time: 35 min reading · most of a day with the engine
> Domain: Prior Auth Portal (`AuthRequest`, `ClinicalCriteria`, `AuthStatus`,
> `AUTO_APPROVE_THRESHOLD`; repos `prior-auth-api` and `prior-auth-web`)
> Verified against aidlc v2.11.0 (Claude Code 2.1.301) on 2026-10-17. Every excerpt is from one
> real run in the reference hub (`D:\aidlc-track8\prior-auth-workspace`, mid-run record commit
> `fc263ae`), resuming the intent M38 parked. Every answer, approval and hand edit was typed by the
> course author acting as the portal team. The run was captured headless, so the author allowed
> exactly three command patterns in `prior-auth-api` that an interactive session asks about one by
> one. Codex wasn't run for this edition; it reads the same stage files.

## Path A — Understand It (no tooling required)

**Artifact:** three excerpts from the reference run.

The approved code plan for U1, as the engine presented it:

```text
Approve the code plan for u1-api-skeleton?

- Builds: the API walking skeleton, tests first [...]
- Touches: new folders under prior-auth-api/src/ (storage, catalog, register, ledger, intake,
  scorer, rescore, detail, config, http, architecture, test-support) [...]
  src/determination/ and src/domain/clinical-criteria.ts are not touched.
- Tests: about 79 Jest tests in 15 spec files, each written and shown failing before its code [...]
  All 4 existing tests stay unchanged.

1. Approve Plan
2. Request Changes
3. I'll edit the files
```

The skeleton receipt, from `bolt checkpoint --action verify` (trimmed):

```text
"kind":"skeleton","unit":"u1-api-skeleton",
"stages":["functional-design","nfr-requirements","code-generation"],
"verified":true,"approved":false,"human_required":true, [...]
"exit_code":0, [...]
PASS src/determination/determination.service.spec.ts
PASS src/skeleton.integration.spec.ts (11.014 s)
Tests:       92 passed, 92 total
 ✓ src/components/AuthQueue.test.tsx (5 tests) 88ms
```

The offer and the team's answer, with the audit events they wrote:

```text
How should I continue building the remaining work?
1. Continue automatically. [...]
2. Review each checkpoint. [...]
> Review each checkpoint. Don't start U2's Functional Design yet; wait for us before going further.

{"timestamp": "2026-10-17T12:33:40Z", "event": "GATE_APPROVED", "fields": {"Unit": "u1-api-skeleton",
 "Stages": "functional-design, nfr-requirements, code-generation", "Gate Scope": "unit-end",
 "Checkpoint": "walking-skeleton", [...]}}
{"timestamp": "2026-10-17T12:35:30Z", "event": "AUTONOMY_MODE_SET", "fields": {"Mode": "gated"}}
{"timestamp": "2026-10-17T12:35:45Z", "event": "WORKFLOW_PARKED", "fields": {"Stage": "functional-design"}}
```

**Trace it:**
1. In the plan, find the line that names the threshold path as untouched.
2. In the receipt, find the guardrail test file and the integrated skeleton test.
3. Read `"approved":false,"human_required":true`: what the engine did, and what it left for a person.
4. Read the offer. List what "Continue automatically" would waive and what it wouldn't (the module's
   section 4 quotes the protocol's list).

**Check yourself:**
1. The receipt is green. What does it prove about `decide`, and what can't it prove about U1's new
   code?
2. Why couldn't U1's checkpoint be approved automatically, even under an autonomous grant?
3. The team wants U2 and U3 built in parallel. What has to change first?
4. Under "Continue automatically", which stops in the rest of this intent would disappear, and which
   would remain?

<details><summary>Answers</summary>

1. That `decide` and its guardrail tests are unchanged against `4226cc48f963`, the 0.85 line is
   present, and every test passes, including the new ones. It can't prove the new code does the right
   thing; that came from two code reviews and the team's Request Changes.
2. It's the skeleton: "A skeleton always needs a real human approval." A grant covers only ordinary
   units after it.
3. Iteration to stage-major and Execution to swarm, both recorded by the team, and only after the
   skeleton checkpoint is approved, which it now is. Unit-major "never invokes swarm".
4. The ordinary completion checkpoints for U2 to U5 would go. Each unit's Plan Approval, each
   pre-generation summary, the verification command choice and any failure would still stop for a
   person.

</details>

## Path B — Build It with AI

> The unit of work: **U1, the walking skeleton, built with Plan Approval on, its checkpoint verified
> and approved by the team, the autonomy offer answered "Review each checkpoint", parked before U2,
> committed.** Start from your M38 hub, parked at `functional-design`. Open the engine interactively
> at the hub root (`claude` or `codex`), because the plan and the checkpoint need a person. When the
> build asks to run `npm --prefix prior-auth-api`, `npx @redocly/cli` or `git -C prior-auth-api`,
> allow those and nothing wider. No code is written until the team approves the plan in step 3.
>
> The reference run took most of a working day, with three review rounds in Functional Design and two
> in Code Generation.

### Claude Code variant (steps 1–5)

```text
# Claude Code
# 1. clear M38's blockers as the team: the product owner adds the missing requirements
#    and stories, and the scope sign-off is recorded. Then resume
/aidlc --resume
# 2. at 3.1 and 3.2: fill every [Answer]: together, then
> done
> Looks correct
> <Approve, or Request Changes with what to fix>
# 3. at 3.5: read the plan file before approving. Approve only if it leaves
#    src/determination/, AUTO_APPROVE_THRESHOLD and the guardrail tests alone
> Approve Plan
# 4. at the code review and the checkpoint: rule on each finding, read the receipt
> Approve
# 5. the autonomy offer
> Review each checkpoint. Then park.
```

Expected, from the reference run (excerpts):

```text
# 1. the hand edits, raised by the agent
Q0. Does OQ7 still block Construction? The requirements and stories still say Construction
doesn't start until the roles (OQ7) are recorded, and they aren't yet. [...]

# 3. if anyone edits an approved plan file mid-build
Code generation cannot modify workspace paths for unit u1-api-skeleton because the plan,
unit-test instructions, and current Testing Contract do not have a current matching approval.
Reason: the plan, test instructions, or Testing Contract changed since the person approved them

# 4. the checkpoint
Walking-skeleton checkpoint for u1-api-skeleton. This covers Functional Design, NFR
Requirements and Code Generation. [...]
Approve this completed u1-api-skeleton?
1. Approve
2. Request Changes

# 5.
The workflow is paused, and nothing more will be built until you resume it with
`/aidlc --resume`. I recorded "Review each checkpoint", so every unit's completion will
wait for your approval, as U1's did.
```

What else happened in the reference run, in order:
- **No change notice.** The engine didn't flag the hand-edited approved files, even under Guard
  Policy strict. The agent found them with `git diff` and asked about them as Q0 and Q1.
- **Tests first.** The first plan was test-after, the organisation's default; `prior-auth-api/AGENTS.md`
  says tests first. The team sent it back, then approved the rewrite.
- **The plan is bound to the files.** The agent edited the approved `unit-test-instructions.md`, every
  code write stopped, and it restored the file.
- **Two code reviews.** The first was READY with one major finding (a malformed URL slipping past the
  test-only guard). The team sent it back, which reopened Plan Approval with four new steps.
- **The receipt.** Exit 0: 92 of 92 API tests, `decide` unchanged against `4226cc48f963`, the threshold
  line present, web 5 of 5. Stored in `.aidlc-construction-checkpoints/u1-api-skeleton/skeleton.json`
  (git-ignored); the audit keeps `CHECKPOINT_VERIFICATION_RECORDED`.
- **Learnings.** The team kept two of twelve, saved as project rules (`RULE_LEARNED`).

**Expected artifact:** under `construction/u1-api-skeleton/`, the questions files and documents for
`functional-design/`, `nfr-requirements/` and `code-generation/` (plan, test instructions,
`code-summary.md`, `source-manifest.json`, `reviews/`); U1's code in the hub's `prior-auth-api`
clone; `aidlc-state.md` at `Construction Autonomy Mode: gated`, parked at `functional-design`.
**Verify:** step 6, then the checks under "Done when".

### Codex CLI variant (steps 1–5)

```text
# Codex CLI
# 1. clear M38's blockers as the team: the product owner adds the missing requirements
#    and stories, and the scope sign-off is recorded. Then resume
$aidlc --resume
# 2. at 3.1 and 3.2: fill every [Answer]: together, then
> done
> Looks correct
> <Approve, or Request Changes with what to fix>
# 3. at 3.5: read the plan file before approving. Approve only if it leaves
#    src/determination/, AUTO_APPROVE_THRESHOLD and the guardrail tests alone
> Approve Plan
# 4. at the code review and the checkpoint: rule on each finding, read the receipt
> Approve
# 5. the autonomy offer
> Review each checkpoint. Then park.
```

Codex wasn't run for this edition, so there's no expected output to compare against. Questions,
findings and test counts will differ from run to run. What must match is the shape: a plan you
approve before any code, a receipt from your own command, a skeleton checkpoint only a person can
approve, and an offer you answer.

**Expected artifact:** the same as the Claude Code variant.
**Verify:** step 6, then the checks under "Done when".

### Step 6 (both engines): commit

The engine leaves U1's code uncommitted in the clone, so put it on the bolt branch yourself:

```powershell
git add aidlc; git commit -m "intent: U1 skeleton approved, gated, parked before U2"
git -C prior-auth-api switch -c b1-api-skeleton
git -C prior-auth-api add -A; git -C prior-auth-api commit -m "B1: U1 API walking skeleton"
```

In the reference run, before that step, `git -C prior-auth-api log --oneline` showed only the seed
commit, `4226cc4 seed: prior-auth-api from the course kit`, and `git -C prior-auth-api status --short`
showed the new work:

```text
 M docs/decisions.md
 M jest.config.js
 M package-lock.json
 M package.json
?? .nvmrc
?? docs/openapi.yaml
?? docs/units/UW-01-api-skeleton.md
?? src/architecture/
[...]
```

**Parity note:** the stages, plan approval, checkpoint commands and artifact paths come from the
engine's stage files and protocols, not from either harness, so both variants land on the same files
under `aidlc/spaces/default/` and the same receipt. The code the build writes, the questions and the
review findings vary from run to run and from engine to engine. The plan approval, the checkpoint
approval and the autonomy answer are the team's either way.

## Done when

Checks, from the hub root (PowerShell):

```powershell
$i = "aidlc\spaces\default\intents\261012-criteria-rescore"
(Select-String -Path "$i\audit\*.md" -Pattern '^\*\*Checkpoint\*\*: plan-approval').Count   # 3 in the reference run: one Request Changes, two approvals
(Select-String -Path "$i\audit\*.md" -Pattern 'CHECKPOINT_VERIFICATION_RECORDED').Count  # 1
(Select-String -Path "$i\audit\*.md" -Pattern 'GATE_APPROVED').Count                     # 12: M36 + M38's ten + U1's checkpoint
Select-String -Path "$i\aidlc-state.md" -Pattern 'Construction Autonomy Mode'             # ... gated
git -C prior-auth-api branch --show-current                                               # b1-api-skeleton, after step 6
```

- [ ] The audit holds the team's Plan Approval for U1, in its own words.
- [ ] The audit shows `CHECKPOINT_VERIFICATION_RECORDED` and a `GATE_APPROVED` for U1's checkpoint.
- [ ] `aidlc-state.md` reads `Construction Autonomy Mode: gated`, parked at `functional-design`.
- [ ] Both commits exist: the hub record, and U1's code on `b1-api-skeleton` in the clone.
- [ ] The other four units are an optional extension; M40 picks up the hub for multi-repo work.
