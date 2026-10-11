---
target: code-generation
plugin: prior-auth-pack
fragments:
  - anchor: after-step:1
    order: 100
---

## fragment: after-step:1

### Step 1b (prior-auth-pack): Repo rules come before the plan

Read the owning sibling repo's `AGENTS.md` and `docs/decisions.md` now. In
`code-generation-plan.md`, add a short section **Repo rules honoured** that lists each D-id
the plan touches and the plan step that keeps it true (for prior-auth-api: D-001 the
`>=` 0.85 auto-approve boundary and its test `auto_approves_exactly_at_threshold`; D-002
eligibility outranks score; D-003 notifications carry status and referenceId only).
If a step would change a recorded rule, do not plan it: raise it as a question for the
human at the plan gate. Follow the repo's own conventions: test names are snake_case
sentences, and code cites decisions as `// (D-00n)`.
