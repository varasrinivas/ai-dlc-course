# Lab M10 — Score the risk, set the dial

> Module: M10 — Adaptive Rigor
> Audience: both · Estimated time: 25 min
> Domain: Prior Auth Portal (AUTO_APPROVE_THRESHOLD policy change, ClinicalCriteria scoring engine)

## Path A — Understand It (no tooling required)

**Artifact:** the morning's three tickets and the five-input scorecard.

```text
SCORECARD      blast radius · reversibility · regulatory ·
               novelty · size

T-101  Fix "elligible" → "eligible" in outreach log message.
T-102  Set AUTO_APPROVE_THRESHOLD to 0.82 for imaging requests
       (clinical policy request, effective next quarter).
T-103  Implement ClinicalCriteria scoring engine: match scoring,
       immutable score log, queue routing integration.
```

**Trace it:**
1. Score each ticket low/med/high on all five inputs.
2. Assign each ticket a stage list from the full strip (intent · elaboration · plan ·
   build+test · review · deploy sign-off · close).
3. Mark what survives even at the lowest setting.

**Check yourself:**
1. Score T-102 on all five inputs — which dominate?
2. T-103 beats T-102 on novelty and size; why does T-102 still get equal-or-more
   ceremony per line changed?
3. What survives even for T-101?

<details><summary>Answers</summary>

1. Blast radius HIGH (every imaging determination), reversibility LOW-as-in-bad
   (audit-irreversible), regulatory HIGH, novelty LOW (known shape), size LOW. The
   regulated axes dominate.
2. Because ceremony allocates to risk, not effort: T-103's ceremony is mostly
   construction discipline; T-102's is mostly *decision* discipline — policy owner,
   scope question (imaging only?), exposure-boundary sign-off, audit note.
3. Mechanical gates and one named human disposition — and if the "typo" turns out to
   live in a user-facing template quoted in a compliance letter, the dial moves;
   re-scoring is allowed and logged.

</details>

## Path B — Build It with AI

> The unit of work: make the dial explicit for your repo — a rigor policy a new teammate
> could apply without you in the room. Both variants produce the same artifact. Run in
> the `prior-auth-api` folder.

### Claude Code variant

```text
# Claude Code
cd prior-auth-api
claude
> Read this repo and the steering file, then write
> docs/M10-rigor-policy.md. Section 1 — detection: is this repo
> greenfield or brownfield? Cite the actual evidence you checked
> (files, tests, history). Section 2 — a change-class table with
> four classes: docs-only, code-no-behavior, behavior-change,
> guardrail-or-PHI. For each: required stages, gates, and who
> signs off. Guardrail-or-PHI must always run the full pipeline.
> Do NOT write code.
```

**Expected artifact:** `docs/M10-rigor-policy.md` — an evidence-based detection section
plus a four-class change table mapping classes to stages, gates, and sign-off owners,
with guardrail-or-PHI locked to the full pipeline.
**Verify:** detection cites real repo evidence (actual filenames); four classes present;
the guardrail class cannot be dialed down; no code files touched.

### Codex CLI variant

```text
# Codex CLI
cd prior-auth-api
codex
> Read this repo and the steering file, then write
> docs/M10-rigor-policy.md. Section 1 — detection: is this repo
> greenfield or brownfield? Cite the actual evidence you checked
> (files, tests, history). Section 2 — a change-class table with
> four classes: docs-only, code-no-behavior, behavior-change,
> guardrail-or-PHI. For each: required stages, gates, and who
> signs off. Guardrail-or-PHI must always run the full pipeline.
> Do NOT write code.
```

**Expected artifact:** the same policy document, steered by AGENTS.md.
**Verify:** same checks as the Claude Code variant.

**Parity note:** class boundaries may be phrased differently between engines; the
four-class structure, the evidence-based detection, and the un-dialable guardrail rule
must match.

## Done when

- [ ] `docs/M10-rigor-policy.md` exists with a detection section citing actual repo
      evidence.
- [ ] Four change classes map to stages, gates, and named sign-offs; guardrail-or-PHI
      always runs the full pipeline.
- [ ] No code was written, and the policy reads as something a new teammate could apply
      unaided.
