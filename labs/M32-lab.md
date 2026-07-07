# Lab M32 — Kill the memo, then write the plan

> Module: M32 — The Rollout Playbook
> Audience: leader · Estimated time: 25 min
> Domain: Prior Auth Portal (org rollout; pilot selection, phase gates, enablement)

## Path A — Understand It (no tooling required)

**Artifact:** a rollout memo drafted by a well-meaning PMO.

```text
FROM: Transformation Office
RE:   AI Development Mandate

Effective Monday, all engineering teams will adopt
AI-assisted development. Targets: 50% of code AI-generated
by Q3 (tracked via weekly AI-usage reports); all engineers
complete the mandatory 2-hour training module by month end.
Tool licenses have been procured for all staff. Release
calendar unchanged.
```

**Trace it:**
1. Locate all four rollout killers in the memo.
2. Predict what each killer produces in six months.
3. Rewrite the first paragraph as propagation.

**Check yourself:**
1. Locate all four killers.
2. What does "release calendar unchanged" doom, specifically?
3. Rewrite the first paragraph as propagation.

<details><summary>Answers</summary>

1. Mandate before evidence ("effective Monday, all teams"); vanity dashboards ("50%
   AI-generated," "usage reports"); tool-first ("licenses procured" + a 2-hour module
   as the whole methodology); skipping the floor ("release calendar unchanged"). A
   perfect four-for-four.
2. The flow tier entirely: bolt-sized increments queuing behind quarterly releases
   means every speed gain evaporates in the queue — and the dashboard will "improve"
   anyway, which is worse than failing loudly.
3. One honest version: "We're standing up one pilot pod on a problem with real
   stakes, with its success bar published in advance. If it clears the bar, its
   members will seed the next two pods, and adoption will follow evidence — never
   the other way around. No targets on AI usage will ever appear; targets live on
   member outcomes."

</details>

## Path B — Lead It (decision exercise)

**Scenario:** the CTO has asked you to "make it everyone's." You have the portal's
evidence and this course's toolkit.

**Your task:** write the four-quarter rollout plan, one page:

1. **Pilot selection:** which team, which stakes, and the evidence bar (baseline,
   metric, counterfactual) set before bolt 1.
2. **The two phase gates** (pilot→seed, seed→standard) with their criteria.
3. **Enablement design:** the facilitated-first-bolt program, plus the three
   objections you expect and the mechanism answering each.
4. **Sustain:** who owns the charter, the scorecard, and the exception path.

**Compare:** <details><summary>A worked answer</summary>

*Pilot:* the claims-status team — real member-facing stakes, a measurable backlog, a
willing lead; bar: median status-inquiry resolution from 3 days to <8 hours by pilot
end, baseline frozen now, the fraud-review team (unchanged process) as
counterfactual.

*Gates:* pilot→seed when floor metrics hold for three consecutive bolts (per-bolt
deploys, AC-named coverage) AND the promise metric clears its bar; seed→standard
when two seeded pods hit their own bars unassisted and the close-out audit shows no
persistent rubber-stamping.

*Enablement:* every joining team runs a facilitated first bolt on its own backlog
with a pilot alumnus in the room; leaders take the artifact path (trace a real
bolt's chain). Objections: "garbage code" → walk the gate stack live; "babysitter" →
show the role-shift table and a real four-minute decision; "obsolete expertise" →
the SME jurisdiction story, told by the SME.

*Sustain:* charter owned by engineering leadership, reviewed with compliance twice
yearly; scorecard owned by the program lead, built only from close-outs; exceptions
granted by one conversation with the charter owner, logged with rationale — an
exception register is a learning source, not a shame list.

</details>

## Done when

- [ ] Your pilot has real stakes and a pre-registered evidence bar with a
      counterfactual.
- [ ] Both phase gates have criteria that evidence can open and nothing else can.
- [ ] Enablement is a facilitated first bolt (not a deck), each expected objection
      has a mechanism, and sustain has named owners.
