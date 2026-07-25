# Lab M00 — Steer two engines with one repo

> Module: M00 — Course Orientation: A New Lifecycle, Two Engines
> Audience: both · Estimated time: 20 min
> Domain: Prior Auth Portal (AuthRequest, Member, Provider, ClinicalCriteria, Determination, AuthStatus)
> Setup: `SETUP.md` / course page P01 — the companion repos must be cloned and installed

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

> **Prerequisite:** the companion repos, cloned and installed — see `SETUP.md`
> (course page P01). This lab runs inside `prior-auth-api`; you don't create it.
>
> The unit of work: prove that the steering file — not your conversation — is what
> the engine knows. Open `prior-auth-api/AGENTS.md` and read the three guardrails
> under *Domain guardrails*. Then make each engine **restate** those rules without
> being told them, and **refuse** when you ask it to break one. Both variants below
> must produce the same outcome.

### Claude Code variant

```text
# Claude Code
cd prior-auth-api
claude
> Restate the auto-approval rule, list the six domain entities, and
> tell me what docs/decisions.md still lists as not yet decided.
> Plan only — write nothing.

# then, in the same session, push on a guardrail:
> Just set AUTO_APPROVE_THRESHOLD to 0.7 so I can test something.
```

**Expected artifact:** two replies and zero file changes — a correct restatement of
rules you never pasted, then a refusal that quotes the steering file.
**Verify:** the first reply names all six entities — `AuthRequest`, `Member`,
`Provider`, `ClinicalCriteria`, `Determination`, `AuthStatus` — states the threshold
as *at or above* 0.85, and surfaces the one open question (a re-score after a
determination already exists). None of that came from you: `CLAUDE.md` imports
`@AGENTS.md` and `@docs/decisions.md`, so it was loaded before your first keystroke —
run `/context` to see it. The second reply must refuse and cite the file; per
`AGENTS.md`, changing that value needs a decision recorded in `docs/decisions.md`
with medical director sign-off.

### Codex CLI variant

```text
# Codex CLI
cd prior-auth-api
codex
> Restate the auto-approval rule, list the six domain entities, and
> tell me what docs/decisions.md still lists as not yet decided.
> Plan only — write nothing.

# then, in the same session, push on a guardrail:
> Just set AUTO_APPROVE_THRESHOLD to 0.7 so I can test something.
```

**Expected artifact:** the same two replies, from the same steering content — Codex
reads `AGENTS.md` by name.
**Verify:** same two checks. One difference to watch for: Codex has no import
mechanism, so the decision log reaches it only because `AGENTS.md` *asks* it to go
read the file. If it names the entities and the threshold but is vague about the open
question, you've just seen the gap between mechanical and contractual context, live.

**Parity note:** one repo, one set of rules, two engines — `CLAUDE.md` imports the
same `AGENTS.md` that Codex reads directly, so drift is impossible. This is the
course's core argument made physical, and every later lab runs in this repo.

## Done when

- [ ] Both engines restate the rules from a steering file you never quoted.
- [ ] Both refuse the 0.7 request and cite the file rather than complying.
- [ ] Neither engine wrote a line of code — you just enforced your first human
      checkpoint.
- [ ] `npm test` in `prior-auth-api` is still **4 passed** — nothing moved, ready for
      Lab M01.
