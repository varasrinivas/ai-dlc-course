# Lab M01 — Spot the anti-pattern, then refuse to repeat it

> Module: M01 — The Two Anti-Patterns
> Audience: both · Estimated time: 20 min
> Domain: Prior Auth Portal (AuthRequest, Member, Provider, ClinicalCriteria, Determination)

## Path A — Understand It (no tooling required)

**Artifact:** two records from the org's earlier AI experiments — the claims-triage agent's
run log (AI-managed) and forty minutes of the intake developer's completion session
(AI-assisted).

Run log 1 — the claims-triage agent:

```text
Intent given: "build a claims triage bot." Team steps away.
AI:    Assumed: requests scoring 0.70+ are safe to system-approve
       (throughput target). No reviewer role found in spec; skipping.
AI:    Generated routing logic — 4,200 lines. Deployed to staging.
Demo:  94% of test requests auto-approved. Applause.
Audit, week 3: approvals exist with no nurse determination on record.
Team:  cannot explain the routing logic. Rewrite scheduled.
```

Session 2 — the intake developer's completion session:

```text
// human types, completion suggests:
if (request.memberId) {      // plausible — and beside the point
  validate(request);
}
// human opens the UM policy doc, re-derives by hand the rule the
// AI was never shown: eligible Member AND in-network Provider
// must both pass BEFORE ClinicalCriteria scoring runs.
// Elapsed: 40 min. AI contribution: 9 keystrokes saved.
```

**Trace it:**
1. In the run log, mark every line where the AI resolved a consequential decision by
   assumption instead of asking (the 0.70 threshold, the skipped reviewer role, the deploy).
2. In the completion session, mark the moment the human does lifecycle work — re-deriving
   domain rules — that the AI could have drafted, had it ever been shown the intent.
3. Compare where each transcript's gains and losses land: local keystrokes vs a scheduled
   rewrite.

**Check yourself:**
1. In the run log, where should the first human checkpoint have been?
2. In the completion session, what information never reached the AI?
3. Which anti-pattern is more dangerous in a regulated domain, and why?

<details><summary>Answers</summary>

1. At the 0.70 assumption — a clarifying question ("what score permits system approval, and
   who decides below it?") deferred to humans before any code; a second checkpoint belongs
   before the staging deploy.
2. The intent and the domain rules — Member eligibility and Provider network status gating
   ClinicalCriteria scoring. It saw syntax fragments only.
3. AI-managed: it produced determinations with no accountable human, a compliance event.
   AI-assisted merely underdelivers; AI-managed ships liability.

</details>

## Path B — Build It with AI

> The unit of work: turn the deliberately underspecified intent "add validation for incoming
> auth requests" into the questions a responsible engine should ask — and prove your engine
> will plan without building. Both variants below must produce the same artifact. Run in the
> `prior-auth-api` folder from Lab M00 (steering file already in place).

### Claude Code variant

```text
# Claude Code
cd prior-auth-api
claude
> Intent: "add validation for incoming auth requests." Do NOT write
> any code. Plan only. Create docs/M01-elaboration-questions.md
> containing at least 5 clarifying questions this intent leaves open
> and at least 2 decisions you explicitly defer to the humans.
> Touch no other file.
```

**Expected artifact:** `docs/M01-elaboration-questions.md` — ≥5 clarifying questions and ≥2
explicitly deferred decisions; no code files created or modified.
**Verify:** `Get-ChildItem -Recurse prior-auth-api` shows only the steering file and
`docs/M01-elaboration-questions.md`; the questions touch Member eligibility, Provider network
status, and the 0.85 threshold semantics.

### Codex CLI variant

```text
# Codex CLI
cd prior-auth-api
codex
> Intent: "add validation for incoming auth requests." Do NOT write
> any code. Plan only. Create docs/M01-elaboration-questions.md
> containing at least 5 clarifying questions this intent leaves open
> and at least 2 decisions you explicitly defer to the humans.
> Touch no other file.
```

**Expected artifact:** the same `docs/M01-elaboration-questions.md`, driven by AGENTS.md
instead of CLAUDE.md.
**Verify:** same checks as the Claude Code variant.

**Parity note:** both engines land on the identical artifact — one questions file, zero code.
Question wording and ordering will differ between engines; coverage of Member, Provider, and
threshold semantics must not.

## Done when

- [ ] `docs/M01-elaboration-questions.md` exists with ≥5 clarifying questions and ≥2
      decisions explicitly deferred to humans.
- [ ] Neither engine created or modified a code file.
- [ ] You can name which anti-pattern each engine just refused to enact — and where the
      human checkpoint sat in your own prompt.
