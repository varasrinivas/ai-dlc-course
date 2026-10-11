---
target: contract-design
plugin: prior-auth-pack
fragments:
  - anchor: after-step:4
    order: 100
---

## fragment: after-step:4

### Step 4b (prior-auth-pack): The contract is two artifacts

`contract-summary.md` (this stage) is the design record. The machine-readable contract
(OpenAPI plus event schemas) is **code**: the unit that owns the producing repo generates it
into `prior-auth-api/contracts/` with a version, and consumer units pin that version.
Say in the summary which unit publishes each contract element, its version, and which
units consume it. Event payloads carry status and referenceId only, never clinical
content (prior-auth-api D-003).
