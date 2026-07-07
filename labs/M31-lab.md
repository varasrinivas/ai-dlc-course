# Lab M31 — Fix the dashboard, then design the scorecard

> Module: M31 — Measuring the Shift
> Audience: leader · Estimated time: 25 min
> Domain: Prior Auth Portal (program scorecard; turnaround, bolt lead time, gate health)

## Path A — Understand It (no tooling required)

**Artifact:** a proposed exec dashboard.

```text
1  Median auto-approvable turnaround vs 24h target
   (baseline + counterfactual attached)
2  AI suggestion acceptance rate (target: >85%)
3  Bolt lead time, per pod
4  Gate pass rate (target: 100%)
5  Escaped defects per bolt
6  AI usage hours per developer (target: >30/wk)
```

**Trace it:**
1. Sort each metric: sound, vanity, or unguarded target.
2. For each vanity metric, state its tell.
3. Repair metric 4 with its guard.

**Check yourself:**
1. Sort all six.
2. Metric 4 isn't vanity — what is it, and what's the repair?
3. What single question dismantles metrics 2 and 6 in the meeting?

<details><summary>Answers</summary>

1. Sound: 1, 3, 5. Vanity: 2, 6. Unguarded target: 4.
2. A Goodhart trap: 100% pass rate is achievable by rubber-stamping every gate — pair
   it with catch rate (a healthy stack catches things) and the close-out audit; a
   gate that never fails is either perfect or decorative, and the pair tells you
   which.
3. "Could this number improve while members wait longer?" — acceptance rate rises by
   accepting mediocre suggestions; usage hours rise with flailing. Both, yes. Cut.

</details>

## Path B — Lead It (decision exercise)

**Scenario:** the CTO wants a quarterly AI-DLC scorecard before approving the
program's expansion.

**Your task:** design it — one metric per tier (promise / flow / health), each with:
definition, source artifact, baseline, target, and its Goodhart guard. Close with
the infrastructure-floor statement (what must be true of CI/CD and test fidelity for
any of the numbers to mean anything).

**Compare:** <details><summary>A worked answer</summary>

*Promise:* median auto-approvable turnaround — from the promise table in program
close-outs; baseline 4.2 days (frozen pre-bolt-1); target <24h sustained; guard: the
skip-alarm count reported on the same line, always — speed never buys past the
guardrail.

*Flow:* bolt lead time (intent-to-shipped) — from bolt close-out timestamps;
baseline: first capstone bolt (4.5 days); target: ≤3 days median; guard: escaped
defects per bolt on the same line — lead time may not improve at quality's expense.

*Health:* gate catch ratio (caught : rubber-stamped) — from the M17 close-out audit;
baseline: 4:2 pilot; target: zero persistent rubber-stamps, catches > 0 (a stack
that never catches is decorative); guard: alert-fatigue check — total human-gate
prompts per bolt trending down, not up.

*Floor statement:* "These numbers are meaningful only while every pod deploys per
bolt through CI/CD and every acceptance criterion maps to a named test. Floor
metrics (deploy frequency, AC-named coverage) are reported quarterly; if the floor
cracks, the scorecard above it is suspended, not spun."

</details>

## Done when

- [ ] Your scorecard has one metric per tier, each with definition, source artifact,
      baseline, target, and guard.
- [ ] Every number falls out of artifacts the chain already writes — nothing needs
      manual collection.
- [ ] The floor statement makes the scorecard honest about its own preconditions.
