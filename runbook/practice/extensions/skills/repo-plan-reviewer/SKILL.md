---
name: repo-plan-reviewer
description: Before a human approves a unit's code-generation-plan.md, explains the plan against the owning sibling repo's AGENTS.md, docs/decisions.md and the approved contract. Read-only. Use when asked to review or explain a code generation plan, or before replying to a Construction plan gate.
---

# Repo plan reviewer (learning helper, read-only)

Help the human reviewer at the Construction plan gate. Explain; never approve.

## Hard rules

- Read-only. Never edit the plan, the repo, or any AI-DLC record. Never reply to the gate.

## What to do

1. Find the plan: the active intent's
   `construction/<unit>/code-generation/code-generation-plan.md`. To find the active
   intent, read `aidlc/active-space`, then `aidlc/spaces/<space>/intents/intents.json`,
   then that intent's `aidlc-state.md`. If several units have plans, use the one whose
   plan gate is open, or ask which unit.
2. Identify the one sibling repo the unit's code lands in: prior-auth-api, prior-auth-web
   or prior-auth-notify. Read that repo's `AGENTS.md` and `docs/decisions.md`, and the
   intent's `inception/contract-design/contract-summary.md`.
3. Report three short lists:
   - **Honours:** each D-id the plan touches, and the plan step that keeps it true. For
     prior-auth-api always check D-001 (the `>=` 0.85 boundary, and the test
     `auto_approves_exactly_at_threshold` stays), D-002 and D-003.
   - **Conflicts or gaps:** any step that would change a recorded rule, compute something
     another repo owns, put clinical content in an event or notice, import code across
     repos, or drift from the contract version. Quote the plan line.
   - **Ask before approving:** questions for the human, phrased so they can be pasted
     into a Request Changes reply.
4. Finish with one line: "No conflicts found" or "N conflicts: consider Request Changes".
   The decision stays with the human.
