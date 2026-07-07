# Lab M11 — Read two stages, then add one

> Module: M11 — The Stage Library
> Audience: practitioner · Estimated time: 25 min
> Domain: Prior Auth Portal (PHI review stage; AUTO_APPROVE_THRESHOLD guardrail class)

## Path A — Understand It (no tooling required)

**Artifact:** two stage definitions in full six-field form.

```text
STAGE: semantic-survey
purpose:    restate an existing system's embedded decisions
            before changing it
trigger:    brownfield detected in any repo the change touches
inputs:     repo(s), commit history, runtime configs
activities: map entities, flows, invariants; flag undocumented
            constraints for human confirmation
outputs:    semantic map (docs/semantic-map.md)
exit:       map validated by an engineer who knows the system

STAGE: phi-review                              [org-added]
purpose:    produce compliance evidence for changes touching
            PHI or clinical guardrails
trigger:    guardrail-or-PHI class per docs/M10-rigor-policy.md
inputs:     decision record, diff, access-scope report
activities: assemble evidence pack; verify no new PHI egress
outputs:    evidence pack (decision, audit note, scope diff)
exit:       compliance owner signs the pack
```

**Trace it:**
1. Label the six fields in each definition.
2. For each of M10's tickets (T-101 typo, T-102 threshold 0.82, T-103 scoring engine),
   decide which stages trigger.
3. Test both stages against "a stage without a checkable exit is a meeting."

**Check yourself:**
1. Which tickets trigger semantic-survey?
2. Does T-102 — one line, no PHI storage touched — trigger phi-review?
3. Both stages pass the "stage, not meeting" test — what makes that true?

<details><summary>Answers</summary>

1. T-103 if the scoring engine touches the 12-year-old eligibility system (mixed change →
   riskier edge, M10); T-101 and a portal-only T-102 don't — the portal repo is
   greenfield.
2. Yes — the trigger reads the *class*, not the diff: a guardrail change is exactly what
   the evidence pack exists to document, code or no code.
3. Each has a checkable exit with a named signer: a validated map, a signed pack. No
   checkable exit, no stage.

</details>

## Path B — Build It with AI

> The unit of work: author and register the PHI-review stage in your own repo. Both
> variants produce the same artifact. Run in `prior-auth-api` (requires
> `docs/M10-rigor-policy.md` from Lab M10).

### Claude Code variant

```text
# Claude Code
cd prior-auth-api
claude
> Author our org's PHI-review stage. Write
> docs/M11-stage-phi-review.md with exactly six labeled fields:
> purpose, trigger (the guardrail-or-PHI class from
> docs/M10-rigor-policy.md), inputs, activities, outputs (an
> evidence pack: decision record, threshold audit note,
> access-scope diff), exit (compliance owner signs). Then update
> docs/M10-rigor-policy.md so the guardrail-or-PHI class lists
> this stage as required. Touch only those two files. No code.
```

**Expected artifact:** `docs/M11-stage-phi-review.md` with six labeled fields, and an
updated `docs/M10-rigor-policy.md` whose guardrail-or-PHI class requires the new stage.
**Verify:** all six fields present and labeled; the policy references the stage by name;
only the two docs files changed.

### Codex CLI variant

```text
# Codex CLI
cd prior-auth-api
codex
> Author our org's PHI-review stage. Write
> docs/M11-stage-phi-review.md with exactly six labeled fields:
> purpose, trigger (the guardrail-or-PHI class from
> docs/M10-rigor-policy.md), inputs, activities, outputs (an
> evidence pack: decision record, threshold audit note,
> access-scope diff), exit (compliance owner signs). Then update
> docs/M10-rigor-policy.md so the guardrail-or-PHI class lists
> this stage as required. Touch only those two files. No code.
```

**Expected artifact:** the same stage definition and registration edit, steered by
AGENTS.md.
**Verify:** same checks as the Claude Code variant.

**Parity note:** field prose will differ between engines; the six-field structure, the
trigger's reference to the M10 policy, and the registration edit must match. This is the
first lab where an engine edits an earlier lab's artifact — deliberate: that's how a
library grows.

## Done when

- [ ] The stage file exists in six-field form with a checkable exit and a named signer.
- [ ] `docs/M10-rigor-policy.md` now requires the stage for the guardrail-or-PHI class.
- [ ] Only those two files changed, and no code was written.
