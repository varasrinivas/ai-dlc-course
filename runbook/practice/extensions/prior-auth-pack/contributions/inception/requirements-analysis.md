---
target: requirements-analysis
plugin: prior-auth-pack
fragments:
  - anchor: after-step:1
    order: 100
---

## fragment: after-step:1

### Step 1b (prior-auth-pack): Load each sibling repo's own rules

This workspace has sibling repos (prior-auth-api, prior-auth-web, prior-auth-notify).
Before analysing the request, read each affected repo's `AGENTS.md` and
`docs/decisions.md`. Treat every recorded decision (D-ids) as settled: do not ask the
team to re-decide it, and cite it where a requirement depends on it.

Then make sure the clarifying questions settle **cross-repo ownership** now, while it is
cheap: for every new value or event, which repo computes it, which repo stores it, which
repo emits it, and which repos only display or consume it. Once Units Generation is
approved the repo set is fixed, so an ownership question that surfaces in Construction
costs a revision loop on an approved stage.
