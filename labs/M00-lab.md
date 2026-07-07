# Lab M00 — Set up two engines, steer them with one domain

> Module: M00 — Course Orientation: A New Lifecycle, Two Engines
> Audience: both · Estimated time: 20 min
> Domain: Prior Auth Portal (AuthRequest, Member, ClinicalCriteria, Determination, AUTO_APPROVE_THRESHOLD)

## Path A — Understand It (no tooling required)

**Artifact:** a compressed Mob Elaboration exchange from the Prior Auth team's first
Inception session.

```text
AI:    Intent received: "reduce prior-auth turnaround from days to hours."
       Clarifying question 1: do determinations for score < 0.85 require
       a nurse decision, or can a second model review them?
Team:  Nurse decision. Regulatory requirement — non-negotiable.
AI:    Noted as a constraint. Proposed units of work:
       UW-1 intake API · UW-2 criteria scoring · UW-3 review queue · UW-4 determinations
Team:  Approved, but UW-2 must log every score for audit. Add it.
AI:    Updated. UW-2 acceptance criteria now include an immutable score log.
```

**Trace it:**
1. Mark who is deciding and who is executing in each exchange.
2. Find every point where the AI deferred instead of assuming.
3. Note which lines become durable artifacts for future sessions.

**Check yourself:**
1. Which statement is a human checkpoint?
2. Which AI behavior distinguishes this from the AI-managed anti-pattern?
3. Where did context memory just get created?

<details><summary>Answers</summary>

1. "Nurse decision. Regulatory requirement" and "Approved, but…" — humans making the
   consequential calls.
2. The AI asked a clarifying question and deferred, instead of assuming.
3. The constraint and the updated acceptance criteria become artifacts the next
   bolt's session will read.

</details>

## Path B — Build It with AI

> The unit of work: create an empty `prior-auth-api` folder, write the steering file
> for each engine, and verify each engine can restate the domain rules back to you.
> Both variants below must produce the same outcome.

### Claude Code variant

```text
# Claude Code
mkdir prior-auth-api; cd prior-auth-api
# create CLAUDE.md with the domain rules, then launch:
claude
> Read CLAUDE.md. Restate the auto-approval rule and list the four
> entities. Plan only — do not create any files yet.
```

**Expected artifact:** a `CLAUDE.md` steering file carrying the domain rules; the
engine's reply restating them — and no other files.
**Verify:** the reply names `AuthRequest`, `Member`, `ClinicalCriteria`,
`Determination` and states the 0.85 threshold — and creates nothing.

### Codex CLI variant

```text
# Codex CLI
mkdir prior-auth-api; cd prior-auth-api
# create AGENTS.md with the same domain rules, then launch:
codex
> Read AGENTS.md. Restate the auto-approval rule and list the four
> entities. Plan only — do not create any files yet.
```

**Expected artifact:** an `AGENTS.md` steering file with the same rules; the same
restatement.
**Verify:** same check. The steering content is identical; only the filename changed.

**Parity note:** both engines restate the same rules from the same steering content —
one pattern, two filenames. This is the course's core argument made physical, and
every later lab builds on this folder.

## Done when

- [ ] Both engines restate the rules correctly from their steering file.
- [ ] Neither engine wrote a line of code — you just enforced your first human
      checkpoint.
- [ ] The `prior-auth-api` folder exists with its steering file(s), ready for Lab M01.
