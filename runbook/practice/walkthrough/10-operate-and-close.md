# Walkthrough 10

> Phase 4 Operation, stages 4.1 to 4.7, then the close-out.

## Background

Operation is where the record proves its value. The code is built and tested; this phase
gets it running, decides how anyone will know it's healthy, says what on-call does when
it isn't, and makes sure the feature's decisions outlive the feature.

**This practice run has no cloud.** "Deploy" means building and testing each repo in
order, running the local smoke path, and recording that in `deployment-log.md` as a local
run. The engine will ask about environments and infrastructure. The answer, the same one
given at every Infrastructure Design stage in step 08, is "local only: document what
production would need, provision nothing". The documents still matter: they are what the
release owner takes to a real go-live, with HIPAA-covered hosting and privacy-office and
compliance sign-off.

Operation's seven stages are conditional. Enterprise scope runs all of them, each in its
own folder under `operation/`. The four you will read most closely:

| Folder | What it holds | Owner |
|---|---|---|
| `deployment-pipeline/` | The deploy order and `rollback-runbook.md` | Release owner |
| `deployment-execution/` | `deployment-log.md`: what was actually deployed, when, and the evidence | Release owner |
| `observability-setup/` | `slo-config.md`: the SLO and its alarm | UM director |
| `incident-response/` | `runbooks.md`: what on-call does when the alarm fires | On-call |

**Deploy in contract order: api, then notify, then web.** prior-auth-api goes first
because its change is additive and backward compatible: old web and notify keep working
against it. Then prior-auth-notify, which starts consuming the two events. Then
prior-auth-web, which shows the countdown once the API returns `decisionDueAt`. Each step
is approved by the release owner. Rolling back reverts a repo's squash commit; it never
removes a published contract version.

**The SLO measures the requirement, not a proxy.** Here it is the share of URGENT requests
determined within 72 hours of becoming **complete**, with the `sla.at-risk` event as the
early warning 24 hours before the deadline. The start point matters: measure from
submission instead and the SLO tracks something the regulation doesn't ask about.
`runbooks.md` has to say who looks when `sla.at-risk` fires, what they check, and when
they escalate.

**Close-out: copy the decisions back.** The intent's record stays in the hub, but each repo
needs the decisions it must keep honouring after the intent is closed. The intent's ADR
log (`inception/domain-design/decisions.md`) holds the architecture choices; every ADR that
constrains a repo is copied into that repo's `docs/decisions.md` as a new numbered entry
that links back to the intent path. Append only: an existing entry is never edited. Any new
cross-repo practice goes into the hub's `memory/project.md`.

In the reference run, many repo-level decisions were already written during Construction:
prior-auth-api D-005 to D-015 and prior-auth-notify D-002 to D-006 were appended at plan
gates and checkpoints. The close-out checks what is still missing rather than duplicating
those. With the decision-log guard installed, every edit to a `decisions.md` stops for a
human. In an interactive session you approve the prompt; in a headless run, paste the
drafted entry by hand, as the reference run did for D-015. Either way, check the diff:
added lines only, and D-001 to D-003 untouched.

**The outcomes pack.** `/aidlc-outcomes-pack` (Claude Code) or `$aidlc-outcomes-pack`
(Codex CLI) writes `OUTCOMES.md`, a shareable record of what was built and decided. Read it
as the medical director would: without opening any code, can you tell that D-001 never
moved? The intent then stays in the hub, marked complete.

Who's in the room: the release owner approves each deploy, on-call owns the incident
runbook, the UM director owns the SLO, and the tech lead and product owner close out. In
Rally, the feature moves to Accepted.

## In the reference workspace

<!-- RUN-WALKTHROUGH:10 -->
