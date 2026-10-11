---
target: units-generation
plugin: prior-auth-pack
fragments:
  - anchor: after-step:2
    order: 100
---

## fragment: after-step:2

### Step 2b (prior-auth-pack): One unit of work = one repo

Propose units so that each unit's code lands in exactly one sibling repo, and record that
repo on the unit. During Construction every git operation is anchored to one repo, so a
unit that spans two repos fights the engine. Units in different repos coordinate only
through the contract (Contract Design), never through shared source.
