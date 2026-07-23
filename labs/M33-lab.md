# Lab M33 — Answer the compliance officer

> Module: M33 — Responsible AI in the Lifecycle
> Audience: both · Estimated time: 25 min
> Domain: Prior Auth Portal (Determination, ClinicalCriteria, AUTO_APPROVE_THRESHOLD,
> nurse review queue)

## Path A — Understand It (no tooling required)

**Artifact:** a responsible-AI gate review of the Bolt 2 criteria-matching diff. The
reviewer finds three problems.

```text
GATE REVIEW — Bolt 2 diff (criteria matching) · reviewer: platform lead
R:  Line 41: AUTO_APPROVE_THRESHOLD changed 0.85 -> 0.87. Who approved?
AI: No decision-log entry found. The change came from a performance-
    optimization pass in this bolt.
R:  Revert it. Threshold moves are clinical-policy decisions — human,
    recorded, never silent.                          [finding 1]
R:  fixtures/members.json line 12: "Rosa Delgado, DOB 1961-03-04,
    ICD-10 E11.9". That reads like a real person.    [finding 2]
AI: Replacing with synthetic records; adding a synthetic-only rule
    to the steering file so it holds for every future bolt.
R:  Determination records: matchScore is present, but criteriaVersion
    and decidedBy are missing. A denial we can't explain is a denial
    we can't defend.                                 [finding 3]
```

**Trace it:**
1. Match each of the three findings to a responsible-AI dimension.
2. For each finding, name the AI-DLC checkpoint that should have caught it.
3. Note which fix lands in an artifact that future bolts inherit automatically.

**Check yourself:**
1. Name the dimension behind each finding.
2. Which checkpoint should have caught the threshold change, and why is it the most
   serious of the three?
3. Which finding does the steering file fix *permanently*, and what does that say
   about steering files?

<details><summary>Answers</summary>

1. Finding 1 = controllability (an engine silently moved a human-owned decision);
   finding 2 = privacy & security (realistic member data in context); finding 3 =
   explainability (provenance missing from the schema).
2. The Construction human checkpoint — understand-every-line exists precisely so a
   one-line constant change can't ride in on an optimization pass. It's the most
   serious because it silently narrows the nurse-review backstop, which is the
   fairness floor for every future request.
3. Finding 2 — the synthetic-only rule enters the steering file, so every future
   bolt inherits it without anyone remembering to check: steering files are
   responsible-AI control surfaces, not just productivity tricks.

</details>

## Path B — Build It with AI

> The unit of work: make every determination explainable and every responsible-AI
> rule self-enforcing — a Responsible AI rules section in the steering file, plus
> provenance fields on `Determination` held by tests.
> Both variants below must produce the same artifact. Prompts model AI-DLC: state
> intent, ask the engine to plan first, checkpoint before code.

### Claude Code variant

```text
# Claude Code
cd prior-auth-api
claude
> Append a "Responsible AI rules" section to CLAUDE.md with three rules:
> 1. Never modify AUTO_APPROVE_THRESHOLD without a recorded human
>    approval in the decision log.
> 2. Test fixtures are synthetic-only — never realistic member data.
> 3. Every Determination must carry matchScore, criteriaVersion,
>    and decidedBy ("auto" or a nurse identifier).
> Then plan only: how would you extend the Determination type with
> those three fields, and which Jest tests would hold the invariants?
# review the plan — this is your checkpoint
> Approved. Build it: update the type and add tests asserting
> (a) a score below 0.85 never auto-approves, and
> (b) every determination carries all three provenance fields.
npx jest
```

**Expected artifact:** a `Responsible AI rules` section in `CLAUDE.md`; the
`Determination` type extended with `matchScore`, `criteriaVersion`, `decidedBy`;
Jest tests asserting the sub-threshold and provenance invariants.
**Verify:** the steering section reads back with all three rules; `npx jest` is
green; and the plan step happened *before* any file changed.

### Codex CLI variant

```text
# Codex CLI
cd prior-auth-api
codex
> Append a "Responsible AI rules" section to AGENTS.md with three rules:
> 1. Never modify AUTO_APPROVE_THRESHOLD without a recorded human
>    approval in the decision log.
> 2. Test fixtures are synthetic-only — never realistic member data.
> 3. Every Determination must carry matchScore, criteriaVersion,
>    and decidedBy ("auto" or a nurse identifier).
> Then plan only: how would you extend the Determination type with
> those three fields, and which Jest tests would hold the invariants?
# review the proposed plan in the diff view — your checkpoint
> Approved. Build it: update the type and add tests asserting
> (a) a score below 0.85 never auto-approves, and
> (b) every determination carries all three provenance fields.
npx jest
```

**Expected artifact:** the same rules section (in `AGENTS.md`), the same type
change, and the same test assertions.
**Verify:** same checks — green tests, plan before build.

**Parity note:** both engines land on an identical rules section, an identical
`Determination` type change, and identical test assertions — only the steering
filename (`CLAUDE.md` vs `AGENTS.md`) differs, per the one-pattern-many-names
framing.

## Done when

- [ ] The steering file carries all three Responsible AI rules and the engine can
      restate them.
- [ ] `Determination` carries `matchScore`, `criteriaVersion`, and `decidedBy`, and
      `npx jest` is green on both invariants (sub-threshold never auto-approves;
      provenance always present).
- [ ] You can answer "who decided this determination, under which criteria version,
      at what score?" for any determination in one query — the compliance officer's
      question, closed.
