# Lab M18 — Read the seam, then fan out for real

> Module: M18 — Parallel Bolts with Subagents
> Audience: practitioner · Estimated time: 30 min
> Domain: Prior Auth Portal (UW-N2 channel preferences, UW-N3 undeliverable routing, NotificationTarget contract)

## Path A — Understand It (no tooling required)

**Artifact:** an orchestration log.

```text
ORCH: Contract pinned → docs/M18-contract.md:
      NotificationTarget { channel, address, memberRef }
      (memberRef, not memberId — no raw member ids in
      notification paths, per PHI rule)
ORCH: Subagent A → UW-N2 channel-preference lookup + tests.
      Subagent B → UW-N3 undeliverable routing + tests.
A:    Done. 4 tests green against pinned contract.
B:    Done. 5 tests green. Note: renamed memberRef →
      memberId for consistency with the Member entity.
ORCH: MERGE HALTED — contract deviation. B re-planned:
      restore memberRef per contract; rename is a seam
      change and defers to humans.
B:    Restored. 5 tests green.
ORCH: Union: npx jest → 11 tests green (2 new seam tests).
      One integrated diff → review.
```

**Trace it:**
1. Mark the pin (when the contract became signed context).
2. Mark the deviation and the protocol response (halt → narrow re-plan, not
   force-merge).
3. Account for the test math: 4 + 5 ≠ 11 — where did the extras come from?

**Check yourself:**
1. Why not just accept B's rename — it IS more consistent?
2. Where did the 2 extra union tests come from, and why didn't either subagent write
   them?
3. What would repeated collisions on this same seam tell the team?

<details><summary>Answers</summary>

1. The contract encoded a decided PHI rule — memberRef exists so raw member ids never
   enter notification paths; "consistency" would quietly reopen a decided question
   during a merge, the worst possible time. A subagent that wants a seam change stops
   and defers.
2. The seam itself: neither slice's tests exercise the boundary between them — the
   orchestrator adds union tests because slice-green ≠ union-green.
3. The decomposition is wrong: UW-N2 and UW-N3 aren't as disjoint as Inception
   believed — feedback for the next Mob Elaboration, not a bigger merge hammer.

</details>

## Path B — Build It with AI

> The unit of work: build UW-N2 and UW-N3 in parallel against a pinned contract. Both
> variants end with the same artifacts; the orchestration mechanism differs — note
> which. Run in the `prior-auth-api` folder.

### Claude Code variant

```text
# Claude Code
cd prior-auth-api
claude
> First write docs/M18-contract.md pinning the
> NotificationTarget interface { channel, address, memberRef }
> with the PHI note (no raw member ids in notification paths).
> STOP for my approval. Then run TWO subagents in parallel:
> A: UW-N2 channel-preference lookup (in-memory) + Jest tests,
> against the pinned contract. B: UW-N3 undeliverable → outreach
> routing + Jest tests, same contract. Neither may modify the
> contract — a needed change stops and defers to me. Then merge,
> run npx jest on the whole repo, and write
> docs/M18-parallel-log.md: assignments, any seam events, union
> test result.
```

**Expected artifact:** `docs/M18-contract.md` (approved before implementation), both
modules with tests, a green union run, `docs/M18-parallel-log.md`.
**Verify:** the contract predates the code; union `npx jest` green; the log records
the fan-out and any seam event.

### Codex CLI variant

```text
# Codex CLI — manual parallelism: two scoped sessions
cd prior-auth-api
codex
> Write docs/M18-contract.md pinning NotificationTarget
> { channel, address, memberRef } with the PHI note. Stop.

# terminal 1 (or sequential session 1):
codex
> UW-N2 only: channel-preference lookup (in-memory) + Jest
> tests, against docs/M18-contract.md. Do not modify the
> contract or any UW-N3 file.
# terminal 2 (or sequential session 2):
codex
> UW-N3 only: undeliverable → outreach routing + Jest tests,
> against docs/M18-contract.md. Same constraints.
# then integrate:
codex
> Merge check: run npx jest on the whole repo and write
> docs/M18-parallel-log.md: assignments, seam events, union
> test result.
```

**Expected artifact:** the same contract, modules, union run, and log.
**Verify:** same checks.

**Parity note:** identical artifacts and identical seam discipline. The mechanism
differs honestly: Claude Code orchestrates natively (subagents, one integrating
session); with Codex you are the foreman (scoped sessions, git-level merge). Record
which in the log — this is direct input to M22's engine-selection module.

## Done when

- [ ] The pinned contract file existed (and was approved) before either implementation.
- [ ] Both slices' tests and the union `npx jest` run are green.
- [ ] `docs/M18-parallel-log.md` records assignments, seam events, and who
      orchestrated — the engine or you.
