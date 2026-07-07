# Lab M16 — Diagnose two sessions, then run a clean one

> Module: M16 — Construction Loops as Sessions
> Audience: practitioner · Estimated time: 25 min
> Domain: Prior Auth Portal (UW-N1 status message renderer; Determination, PHI guardrail)

## Path A — Understand It (no tooling required)

**Artifact:** two compressed session logs.

```text
SESSION A                        SESSION B
read chain; resume UW-N1 plan    continue yesterday's session
✋ plan re-approved               build UW-1b… done (no gates?)
build steps 1-3                  also refactor eligibility port
⚙ jest: 2 fail → fix → green     "tests pass" (no output shown)
build step 4 — DEVIATION         quick question about caching…
flagged: renamed formatter       build UW-N1 using formatHelper()
⚙ jest green · lint clean        …formatHelper was deleted above
present: 240 lines + summary     present: 610 lines, no summary
✋ signed off · write docs/ ·
/clear
```

**Trace it:**
1. Mark the loop stages in session A (read → checkpoint → build → gates → present →
   write → clear).
2. List every smell in session B, matched to the module's smell table.
3. Estimate the review cost of each session's final diff.

**Check yourself:**
1. Where did session A run its gates, and who fixed the failures?
2. List four smells in session B and their fixes.
3. Session B's engineer says "but I was being efficient" — what's the arithmetic answer?

<details><summary>Answers</summary>

1. Twice mid-loop (after step 3 and after step 4) — and the *engine* fixed the failures
   before presenting; the human saw only green.
2. Two-UWs-plus-a-refactor (park them); "tests pass" with no output (demand the run;
   M17 makes it mechanical); citing a deleted helper (residue — /clear and resume from
   artifacts); 610 lines with no summary (no summary, no review).
3. A 610-line unreviewable diff costs more at Mob Construction than three clean
   sessions cost at the keyboard — the "efficiency" is borrowed from the reviewers at
   interest.

</details>

## Path B — Build It with AI

> The unit of work: UW-N1 from the notifications epic — the status message renderer:
> given a `Determination`, produce notification text carrying status + reference id
> only. One fresh session, full loop. Both variants produce the same behavior. Run in
> the `prior-auth-api` folder.

### Claude Code variant

```text
# Claude Code — fresh session (run /clear first if resuming)
cd prior-auth-api
claude
> UW-N1: a Determination status message renderer. Notification
> text carries status + reference id ONLY — never clinical
> content. Plan first, numbered steps, STOP for my approval.
> After approval: implement with Jest tests including one test
> that asserts no clinical-content fields ever appear in output.
> Run npx jest yourself and show me the output — fix failures
> before presenting. Flag any plan deviation as you make it.
> End with docs/M16-increment.md explaining the diff.
# review, sign off, then /clear
```

**Expected artifact:** the renderer + Jest tests (including the PHI-leak negative
test), a green self-run test output shown in-session, and `docs/M16-increment.md`.
**Verify:** the plan stopped for your approval; jest output was shown (not asserted);
the PHI-leak test exists and passes; the summary explains the diff; session ended with
/clear.

### Codex CLI variant

```text
# Codex CLI — fresh session
cd prior-auth-api
codex
> UW-N1: a Determination status message renderer. Notification
> text carries status + reference id ONLY — never clinical
> content. Plan first, numbered steps, STOP for my approval.
> After approval: implement with Jest tests including one test
> that asserts no clinical-content fields ever appear in output.
> Run npx jest yourself and show me the output — fix failures
> before presenting. Flag any plan deviation as you make it.
> End with docs/M16-increment.md explaining the diff.
```

**Expected artifact:** the same renderer, tests, and increment summary, steered by
AGENTS.md.
**Verify:** same checks.

**Parity note:** same behavior, same named tests, same green run from both engines;
scaffold details may differ. The PHI-leak negative test is canon from here on — it
returns in the capstone's determinations bolt.

## Done when

- [ ] One fresh session ran one full loop: plan, checkpoint, build, self-run gates
      with visible output, present, summary.
- [ ] The PHI-leak test exists and passes (`npx jest` green).
- [ ] The session ended clean: summary written, /clear issued.
