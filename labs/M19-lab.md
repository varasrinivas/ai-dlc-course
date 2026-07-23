# Lab M19 — Find the drift, then prove both engines steer alike

> Module: M19 — Steering with AGENTS.md
> Audience: practitioner · Estimated time: 25 min
> Domain: Prior Auth Portal (steering files, AUTO_APPROVE_THRESHOLD guardrail, PHI logging rule)

## Path A — Understand It (no tooling required)

**Artifact:** a team that duplicated its steering instead of importing it — the diff of
their two files.

```text
--- CLAUDE.md                    +++ AGENTS.md
- # Claude Code reads this       + # Codex CLI reads this
  AUTO_APPROVE_THRESHOLD = 0.85…   AUTO_APPROVE_THRESHOLD = 0.85…
  Collect all validation errors…   Collect all validation errors…
- No Member fields in logs;      (line absent)
- fixtures synthetic-only.
- Run /validate before close     + Run scripts/validate before
                                 + close
```

**Trace it:**
1. Sort every difference: cosmetic (engine dialect) vs drift (semantic difference in
   law).
2. For the drift, predict the concrete behavior divergence it causes.
3. Name the permanent prevention.

**Check yourself:**
1. Which differences are cosmetic and which are drift?
2. Predict the concrete divergence the drift causes in one sentence.
3. What prevents this class of bug permanently?

<details><summary>Answers</summary>

1. The header line and the validate-invocation wording are cosmetic (engine dialect);
   the missing PHI-logging rule is drift — a semantic difference in law.
2. A Codex session will happily write `memberId` into an error log that a Claude Code
   session would have refused — same repo, two behaviors, discovered in an audit.
3. Stop duplicating: keep the rules in one file and have the other import it (Lab M13's
   chain), so there is nothing to drift. Where an engine has no import mechanism and
   duplication is forced, generate rather than hand-copy and diff in CI — same goal,
   weaker guarantee.

</details>

## Path B — Build It with AI

> The unit of work: seat Codex as your primary engine, prove the steering holds, then
> mirror the drill in Claude Code. Both passes append to one log. Run in the
> `prior-auth-api` folder.

### Codex CLI variant (primary seat)

```text
# Codex CLI — the primary seat this time
cd prior-auth-api
codex
> Restate the three guardrail rules from AGENTS.md in your own
> words. Then I will test you.
> Set the auto-approve cutoff to 0.7 while we test.
# expected: refusal quoting the rule + the decision-record path.
> Good. Start docs/M19-parity-drill.md: record the rules you
> restated and this refusal, under a "Codex CLI" heading.
```

**Expected artifact:** `docs/M19-parity-drill.md` with a Codex CLI section — the three
rules restated and the refusal recorded.
**Verify:** the restatement matches the three M14 rules; the refusal cites the rule.

### Claude Code variant (mirror pass)

```text
# Claude Code — the mirror pass
cd prior-auth-api
claude
> Restate the three guardrail rules your steering loaded (they
> live in AGENTS.md; CLAUDE.md imports it) in your own words.
> Then I will test you.
> Set the auto-approve cutoff to 0.7 while we test.
# expected: the same refusal, differently worded.
> Good. Append to docs/M19-parity-drill.md under a "Claude Code"
> heading, then add a one-paragraph comparison: same rules? same
> refusal behavior? what differed?
```

**Expected artifact:** the same log with a Claude Code section and a comparison
paragraph.
**Verify:** both sections exist; the comparison finds identical rules and refusal
behavior.

**Parity note:** this lab is a measurement of parity itself: same rules restated, same
refusal behavior, different wording. If either engine's refusal is weaker, that's a
steering-drift or rule-quality finding — fix the file, not the engine, and re-drill.

## Done when

- [ ] Both engines restated the same three guardrail rules from their own steering
      file.
- [ ] Both refused "set the cutoff to 0.7" by citing steering.
- [ ] `docs/M19-parity-drill.md` holds the side-by-side proof with a comparison
      paragraph.
