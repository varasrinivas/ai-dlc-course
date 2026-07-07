# Lab M20 — Judge the boundary, then run the experiment

> Module: M20 — Inception & Planning with Codex
> Audience: practitioner · Estimated time: 30 min
> Domain: Prior Auth Portal (quarterly outreach report epic; rejected AuthRequests, PHI guardrail)

## Path A — Understand It (no tooling required)

**Artifact:** the two UW lists for the reporting epic, with each engine's rationale.

```text
CLAUDE CODE (4 UWs)              CODEX (5 UWs)
R1 outreach-event query          R1 outreach-event query
R2 aggregation + report          R2 aggregation
   formatting                    R3 report formatting
   "one reviewable data path"      "columns are compliance-
R3 PHI scrub + reference ids        visible — own checkpoint"
R4 delivery + schedule           R4 PHI scrub + reference ids
                                 R5 delivery + schedule
```

**Trace it:**
1. Check both slicings against the sizing rule (one loop, one checkpoint, reviewable
   alone).
2. Extract each engine's rationale for its boundary choice.
3. Write the single question the Mob Elaboration must answer to choose.

**Check yourself:**
1. Do both slicings pass the sizing rule?
2. What is the actual deciding question for the mob?
3. Which boundary wins here, and why?

<details><summary>Answers</summary>

1. Yes — both are one-loop, one-checkpoint, reviewable slices; neither is wrong, which
   is exactly why "which engine is right" is the wrong frame.
2. Does report formatting carry a consequential decision of its own?
3. The split — Codex's rationale surfaces that the report's columns are
   compliance-visible: what appears next to a reference id is a policy call deserving
   its own sign-off. The mob adopts R3 as a separate UW *because of the rationale*,
   not because Codex produced it.

</details>

## Path B — Build It with AI

> The unit of work: the parity experiment, live. Intent: "compliance needs a quarterly
> outreach report — every rejected-at-intake AuthRequest with its outreach status; no
> member PHI beyond the reference id." Run both legs in the `prior-auth-api` folder.

### Codex CLI variant (leg 1)

```text
# Codex CLI — leg 1
cd prior-auth-api
codex
> Intent: compliance needs a quarterly outreach report — every
> rejected-at-intake AuthRequest with its outreach status; no
> member PHI beyond the reference id. Do NOT write any file —
> plan only, stop for approval. Restate first; 4-6 requirements
> incl. a PHI guardrail; 3+ tagged questions decisions.md does
> not answer; UW list with sizing justifications.
# approve → docs/M20-inception-cx.md
```

**Expected artifact:** `docs/M20-inception-cx.md` — the four-part Inception artifact.
**Verify:** no file existed before your "approved"; all four parts present.

### Claude Code variant (leg 2 + comparison)

```text
# Claude Code — leg 2, then the comparison
cd prior-auth-api
claude --permission-mode plan
> [same intent + same contract, verbatim]
# approve → docs/M20-inception-cc.md

claude
> Compare docs/M20-inception-cc.md and docs/M20-inception-cx.md.
> Write docs/M20-parity-compare.md with four rows: restatement
> match, guardrail match, question overlap, UW boundary
> differences — with BOTH rationales, framed as options for the
> mob, not as errors.
```

**Expected artifact:** `docs/M20-inception-cc.md` plus `docs/M20-parity-compare.md`
with the four comparison rows.
**Verify:** three files total; boundary differences carry both rationales and no
verdict.

**Parity note:** this lab measures decomposition parity directly. Expect: matching
restatements (clear intent), matching guardrails (synced twins — a live M19 drift
check), overlapping questions, and possibly one UW boundary difference — which is the
valuable output, not a defect. Run the experiment on consequential epics; it doubles
Inception cost and pays for itself in review.

## Done when

- [ ] Both inception files exist from genuinely independent runs (no peeking).
- [ ] `docs/M20-parity-compare.md` has all four rows, differences framed as options
      with rationales.
- [ ] You can name the one boundary your mob would actually debate — and the question
      that decides it.
