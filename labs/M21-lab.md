# Lab M21 — Catch what the summary omitted, then build UW-R1

> Module: M21 — Construction & Review with Codex
> Audience: practitioner · Estimated time: 30 min
> Domain: Prior Auth Portal (UW-R1 outreach-event query; Member PHI logging rule)

## Path A — Understand It (no tooling required)

**Artifact:** a Codex construction transcript.

```text
[suggest] plan posted: query module, 6 steps → approved
[auto-edit] steps 1-4 built; gate script: jest 7/7 green
[full-auto·sandbox] mechanical sweep: OutreachEvent rename
     across 14 files; jest 7/7 green; network off
[suggest] final review. SUMMARY: "query module + tests,
     all green, rename sweep clean."
DIFF, hunk 12 of 19:
  +  console.log('eligibility check', memberId)
REVIEWER: blocked — M14 rule: no Member fields in logs.
     Send-back: correlation id, not memberId. Re-run gates.
```

> Posture names above are the legacy Codex CLI `--approval-mode` vocabulary kept from
> M19; on the current CLI the same dial is `--ask-for-approval` plus `--sandbox`.

**Trace it:**
1. Mark each posture change and judge whether it matched the phase's risk.
2. Find what the summary omitted, and where it actually lived.
3. Decide which of this catch's causes are scriptable.

**Check yourself:**
1. Was each posture right for its phase?
2. Why didn't the gate scripts catch the memberId line?
3. On Claude Code, which mechanism would have caught it, and what does that tell a
   dual-engine team?

<details><summary>Answers</summary>

1. Yes — suggest for the consequential plan and final review, auto-edit for the
   trusted middle, sandboxed full-auto for the mechanical sweep: the dial followed
   risk, not convenience.
2. jest tests behavior, not logging hygiene; no script asserted "no Member fields in
   logs" — a scriptable gap (a lint rule or grep gate) that the send-back should
   spawn.
3. Nothing automatic, unless the team had written a hook for it — the honest symmetry:
   both engines need the rule *mechanized*; until then, the reader of hunk 12 is the
   gate on either engine.

</details>

## Path B — Build It with AI

> The unit of work: UW-R1 — the outreach-event query with tests. Codex is the primary
> seat; Claude Code runs the mirror review. Run in the `prior-auth-api` folder.

### Codex CLI variant (primary)

```text
# Codex CLI — primary
cd prior-auth-api
codex
> UW-R1: an outreach-event query module — list rejected-at-intake
> AuthRequests with outreach status, reference ids only. Plan
> first, STOP for approval. After approval: build with Jest tests
> (AC-named), run the gate scripts and npx jest yourself and show
> output. Flag deviations as you make them. Present the FULL DIFF
> at the end — I will read the hunks, not your summary. Then
> write docs/M21-increment.md.
```

**Expected artifact:** the query module + AC-named Jest tests, a green self-run gate
output, the full diff presented, and `docs/M21-increment.md`.
**Verify:** you read the hunks and noted one thing the summary didn't mention (even
benign); `npx jest` green.

### Claude Code variant (mirror review)

```text
# Claude Code — mirror
cd prior-auth-api
claude
> UW-R1 (mirror check): review the outreach-event query module
> just built. Present deviations first, then walk each AC to its
> test, then show the full diff. Answer my questions on any hunk.
> Append a "Claude Code review" section to docs/M21-increment.md
> with anything the original summary omitted.
```

**Expected artifact:** the increment file gains a cross-engine review section.
**Verify:** the section exists; any omission found is logged.

**Parity note:** the increment artifacts are engine-indistinguishable by design —
AC-named tests, deviations, summary. The enforcement differed: Codex's final gate was
your diff-read at the suggest door; Claude Code's mirror added a second cold reader.
Cross-engine review is itself a technique: two authors' theories, one set of hunks.

## Done when

- [ ] UW-R1 is green with AC-named tests and reference-ids-only output.
- [ ] `docs/M21-increment.md` exists, including the cross-engine review section.
- [ ] You found one thing in the hunks the summary didn't say — or attested the
      diff-read that proved there was none.
