# Lab M04 — Fix the pitch before the CFO reads it

> Module: M04 — The Evidence
> Audience: leader · Estimated time: 20 min
> Domain: Prior Auth Portal (program funding pitch; AuthRequest turnaround as the pilot metric)

## Path A — Understand It (no tooling required)

**Artifact:** six claim-lines from the internal one-pager pitching the portal program.

```text
1  "AWS reports 6 engineers replaced 30."
2  "Bedrock's 18-month estimate was delivered in 76 days,
    as reported by AWS."
3  "4.5x velocity is guaranteed by the methodology."
4  "Amazon Stores reported 4.5x developer velocity; definitions
    of velocity vary — we will publish ours."
5  "Blue Origin reached 95% adoption, which suggests engineers
    chose to keep working this way."
6  "Our pilot will publish its baseline turnaround before bolt 1."
```

**Trace it:**
1. Label each line OUTCOME-HONEST, OUTCOME-INFLATED, or CONDITION.
2. For every outcome line, check three things: is it attributed, is it precise about what
   was measured, and is it presented as a report rather than a promise?
3. Rewrite the two worst lines so they would survive a fact-check.

**Check yourself:**
1. What exactly is wrong with line 1?
2. Which single word makes line 3 indefensible?
3. Which lines would survive a hostile CFO fact-check unchanged?

<details><summary>Answers</summary>

1. It converts an estimate-vs-delivery comparison into a headcount-replacement claim —
   the 30 developers were an estimate's staffing, not people who were replaced.
   OUTCOME-INFLATED.
2. "Guaranteed" — it turns someone else's reported outcome into your promise.
3. Lines 2, 4, 5, and 6: each one attributes, qualifies, or commits to a condition.
   Line 5 earns it by marking "suggests" as interpretation; line 6 is the only pure
   CONDITION — and the most persuasive line on the page.

</details>

## Path B — Lead It (decision exercise)

**Scenario:** Thursday's funding meeting with the CFO and the chief medical officer. You
present AWS's reported record for AI-DLC and your own pilot's evidence bar — and you will
be fact-checked.

**Your task:** draft two artifacts on one page.

1. **The evidence slide:** the three reported results (Bedrock re-architecture, Amazon
   Stores, Blue Origin), one sentence each, with attribution a CFO would accept.
2. **The pilot bar:** one baseline (current auth-request turnaround), one metric with a
   number and a date, one counterfactual guard — plus the enabling condition your org is
   missing today (small modules? shared context? gates?) and the first move to build it.

**Compare:** <details><summary>A worked answer</summary>

*Evidence slide:* "AWS reports its Bedrock re-architecture — estimated at 18 months for 30
developers — was delivered by 6 engineers in 76 days. Amazon Stores reports 4.5x developer
velocity under the same methodology. Blue Origin reports 95% sustained adoption. All
figures are AWS-reported; we treat them as what conditions like ours can produce, not as
promises."

*Pilot bar:* "Baseline: median prior-auth turnaround is 4.2 days, measured over the last
90 days, frozen before bolt 1. Metric: median turnaround under 24 hours for auto-approvable
requests by end of quarter, with zero determinations lacking a nurse decision below the
0.85 threshold. Counterfactual guard: the claims-intake team, similar backlog, keeps its
current process this quarter — we report our delta against theirs. Missing condition: our
estate is not a monorepo and has no shared context artifact; first move is a steering file
and decision log for the portal repos, starting this bolt."

</details>

## Done when

- [ ] All six pitch lines are labeled, and the two inflated ones are rewritten with
      attribution and precision.
- [ ] Your evidence slide cites all three results in one sentence each, each carrying
      "as reported by AWS" or equivalent attribution.
- [ ] Your pilot bar names a baseline, a dated metric, a counterfactual guard, and one
      missing condition with a concrete first move.
