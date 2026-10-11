<!--
  Paste into aidlc/spaces/default/memory/project.md (runbook step 01).
  Each block below goes under the heading of the same name that is already in that file.
  Every stage of every intent loads project.md, so this is where a hub-level rule
  "read each repo's own steering first" becomes something the engine actually sees.
-->

## Way of Working

Repo steering (multi-repo). This workspace holds three sibling repos: prior-auth-api,
prior-auth-web, prior-auth-notify. Before planning or changing code in one of them, read
that repo's AGENTS.md and docs/decisions.md. They outrank this file for that repo.
One unit of work = one repo. Cross-repo coordination goes through the contract that
prior-auth-api publishes in prior-auth-api/contracts/, never through shared source.

## Forbidden

NEVER change a rule recorded in a repo's docs/decisions.md (e.g. prior-auth-api D-001: a criteria score >= 0.85 auto-approves); raise it as a question at the gate instead (affirmed by the tech lead at workspace setup)
NEVER put clinical content, criteria detail or scores in a notification or event payload; status and referenceId only (prior-auth-api D-003) (affirmed by the tech lead at workspace setup)
NEVER import source code from one sibling repo into another (affirmed by the tech lead at workspace setup)

## Mandated

ALWAYS cite the D-id from the owning repo's docs/decisions.md in any plan step that touches a recorded rule (affirmed by the tech lead at workspace setup)
