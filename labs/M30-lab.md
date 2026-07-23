# Lab M30 — Survive the audit, then write the charter

> Module: M30 — Governance, Risk & Compliance Gates
> Audience: leader · Estimated time: 25 min
> Domain: Prior Auth Portal (audit defense, governance charter, PHI gates)

## Path A — Understand It (no tooling required)

**Artifact:** four exchanges from the March audit.

```text
Q1  "The threshold changed to 0.82 for imaging in April.
     Walk me through it."
A1  Register entry: medical director R.Chen, April 3 (T-102) —
     a per-modality carve-out recorded in config/threshold.json;
     the 0.85 default and the >= rule are unchanged. Rationale
     attached; gate log shows the config edit blocked twice
     until the record existed; evidence pack signed.
Q2  "Does the AI ever make the approval decision?"
A2  At or above the applicable threshold — 0.85, or 0.82 for
     imaging since April; the rule is >= — software applies a
     policy humans set and locked; below, a nurse decides.
     Here's a determination from each path — walk them
     yourself.
Q3  "How do you know the guardrail holds in production?"
A3  The skip-alarm (zero fires, monitored) plus the nightly
     reconciliation sweep; both alert paths documented.
Q4  "We'd like the AI transcript history for April."
A4  Transcripts are exhaust, not the system of record — every
     consequential outcome is in the artifact chain; here is
     April's register, increments, and gate logs.
```

**Trace it:**
1. Map each answer to its governance layer (by construction / by ritual / by audit).
2. Note what makes each answer falsifiable rather than attested.
3. Judge the team's move in Q4.

**Check yourself:**
1. Which governance layer answered each question?
2. Why is A2 stronger than a policy document saying the same thing?
3. Is A4 the right move — and what makes it defensible?

<details><summary>Answers</summary>

1. Q1: ritual + construction (register + lock). Q2: ritual + audit (the walk, run
   live). Q3: construction (alarm + sweep). Q4: the M13 doctrine — audit layer.
2. Because the auditor can falsify it: two real determinations, walked backwards,
   either show a human on the below-threshold path or they don't — evidence beats
   attestation.
3. Yes, if — and only if — the artifact chain genuinely captures every consequential
   outcome, which is what the whole methodology enforces; the defensible line is
   "our system of record is designed, complete, and verifiable — transcripts are
   drafts."

</details>

## Path B — Lead It (decision exercise)

**Scenario:** the org is scaling AI-DLC beyond the portal; compliance wants a charter
before pod three exists.

**Your task:** draft the AI-DLC governance charter — one page, three sections:

1. **Non-negotiable gates** for any adopting team (three, each with its enforcing
   mechanism).
2. **The delegation rule:** what pods self-govern, what leadership audits, at what
   depth and cadence.
3. **The accountability clause** — the sentence you'd hand a regulator about AI and
   authority.

**Compare:** <details><summary>A worked answer</summary>

*Gates:* (1) Guardrail-or-PHI changes run the PHI-review stage and full pipeline —
enforced by the rigor policy and the config locks; no role exemptions. (2) Every
exposure boundary (deploy, data egress) carries a named human sign-off — enforced by
permission topology and release process. (3) No ownerless decisions: every
consequential decision enters the register with a name and rationale — enforced by
the defer protocol and close-out audit.

*Delegation:* pods select stages and run checkpoints within their rigor classes
without approval; leadership audits two bolt close-outs per pod per month, deeply —
gate effectiveness (fired/rubber-stamped/caught), register completeness,
evidence-pack quality. Persistent rubber-stamping or register gaps escalate to a
charter review, not a blame exercise.

*Accountability clause:* "AI systems in our development lifecycle hold no decision
authority. Consequential decisions are made by named individuals at defined
checkpoints, recorded with rationale in an auditable register; automated gates
prevent changes to clinical guardrails without such records. The artifact chain —
not conversation logs — is our system of record, and it is verifiable end to end."

</details>

## Done when

- [ ] Your three gates each name their enforcing mechanism (not just the rule).
- [ ] The delegation rule states what leadership audits, how deeply, how often —
      and what triggers escalation.
- [ ] The accountability clause would survive being read aloud to a regulator.
