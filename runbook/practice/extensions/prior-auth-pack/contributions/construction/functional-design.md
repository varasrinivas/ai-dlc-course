---
target: functional-design
plugin: prior-auth-pack
fragments:
  - anchor: after-step:1
    order: 100
---

## fragment: after-step:1

### Step 1b (prior-auth-pack): Read the owning repo's steering

Identify the one sibling repo this unit's code lands in. Read that repo's `AGENTS.md` and
`docs/decisions.md` before designing. Its recorded decisions outrank anything in the hub;
cite the D-ids your design depends on.
