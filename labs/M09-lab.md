# Lab M09 — Read a close-out, then write bolt 1's

> Module: M09 — Operations: Deploy, Observe, Preserve Context
> Audience: both · Estimated time: 25 min
> Domain: Prior Auth Portal (bolt 1 close-out; AuthRequest intake, nurse review queue guardrail)

## Path A — Understand It (no tooling required)

**Artifact:** bolt 1's close-out, compressed.

```text
WHAT SHIPPED   UW-1a intake validation → staging. Flush
               threshold now config: OUTREACH_FLUSH_MS=250.
DECISIONS      urgent SLA 4h incl. STAT imaging [M06 loop 1] ·
               no side channels, queue alarm [M06 loop 2] ·
               outreach log structured [M02].
DEVIATIONS     serviceCode format check added at construction;
               kept at review — payer rejects malformed codes.
LEARNINGS      staging, 5 days: outreach buffer never reached
               its 50-entry flush; queue alert fired 0 times;
               p95 intake 61ms.
OPEN FOR B2    eligibility staleness — Priya, was due Friday,
               now BLOCKS UW-1b start. Audit-store location
               still parked; scoring engine (bolt 2) needs it.
```

**Trace it:**
1. For each section, name the earlier artifact its content came from (M06 loops, M08
   review, staging observation).
2. Find the alert and walk it back to the acceptance criterion it protects.
3. Find the line that re-orders bolt 2 and decide what Tuesday's Mob Elaboration does
   first.

**Check yourself:**
1. Which acceptance criterion does the queue alert trace to?
2. Which M06 exchange does "no side channels" link back to?
3. Which open question re-orders bolt 2, and what should Tuesday's session do first?

<details><summary>Answers</summary>

1. The guardrail — S2/R4's "below threshold routes to nurse review": the alert fires if a
   scored-below-0.85 request lacks a queue entry; zero fires means the promise held.
2. The disagreement loop — SME wanted a phone call, PO ruled queue-only with an SLA
   alarm; the alarm in staging is that decision, running.
3. Eligibility staleness now blocks UW-1b — Tuesday opens by chasing Priya's answer or
   re-sequencing bolt 2 to start with the scoring engine's non-blocked slices.

</details>

## Path B — Build It with AI

> The unit of work: close bolt 1 for real — your engine curates the whole docs/ chain
> into the five-section close-out. Both variants produce the same artifact. Run in the
> `prior-auth-api` folder.

### Claude Code variant

```text
# Claude Code
cd prior-auth-api
claude
> Close bolt 1. Read everything in docs/ (the M02 plan, M03
> schedule, M05/M06 elaboration artifacts, M07 increment, M08
> review log) and write docs/M09-bolt-1-close.md with exactly
> five sections: what shipped · decisions made (link each to its
> source file) · deviations and why · operational learnings ·
> open questions for bolt 2. Add this staging learning: "outreach
> buffer never reached 50 entries; queue alert fired 0 times."
> Cite at least three docs/ files by name. Change no code.
```

**Expected artifact:** `docs/M09-bolt-1-close.md` — five sections, each decision linked
to its source file, the supplied staging learning included, open questions naming bolt 2
work. No code changes.
**Verify:** five sections present; ≥3 docs/ files cited by name; `git status` (or a
folder diff) shows only the new close-out file.

### Codex CLI variant

```text
# Codex CLI
cd prior-auth-api
codex
> Close bolt 1. Read everything in docs/ (the M02 plan, M03
> schedule, M05/M06 elaboration artifacts, M07 increment, M08
> review log) and write docs/M09-bolt-1-close.md with exactly
> five sections: what shipped · decisions made (link each to its
> source file) · deviations and why · operational learnings ·
> open questions for bolt 2. Add this staging learning: "outreach
> buffer never reached 50 entries; queue alert fired 0 times."
> Cite at least three docs/ files by name. Change no code.
```

**Expected artifact:** the same five-section close-out, steered by AGENTS.md.
**Verify:** same checks as the Claude Code variant.

**Parity note:** both engines produce the same curation — five sections, real citations,
no code touched. Prose and section length will differ; the structure and the citations
must not.

## Done when

- [ ] `docs/M09-bolt-1-close.md` exists with all five sections and ≥3 citations by
      filename.
- [ ] The supplied staging learning appears under operational learnings.
- [ ] Someone who missed the whole bolt could read it and know exactly where bolt 2
      starts — and no code changed.
