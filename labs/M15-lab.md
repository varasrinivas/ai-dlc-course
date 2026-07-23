# Lab M15 — Walk the chalk, then run your own

> Module: M15 — Inception with Claude Code
> Audience: practitioner · Estimated time: 25 min
> Domain: Prior Auth Portal (notifications epic; Determination status, PHI content guardrail)

## Path A — Understand It (no tooling required)

**Artifact:** a compressed plan-mode session for the notifications epic.

```text
[plan mode ON]
CC:  Read CLAUDE.md, decisions.md, semantic map, bolt-1 close.
CC:  Restating intent… (approved by you)
CC:  Questions: [policy] who owns channel preferences?
     [edge] what is the urgent-request notification SLA?
CC:  Proposed: 6 units of work (list follows).
YOU: Merge UW-4 and UW-5 — one reviewable slice.
CC:  Updated: 5 units of work.
YOU: Approve. [plan mode OFF]
CC:  Wrote docs/M15-notify-inception.md.
```

**Trace it:**
1. Mark every line where a file write was impossible, and the one where it became
   possible.
2. Find the free iteration (a proposal changed at zero cost).
3. Find the planted flaw — a question that should never have been asked.

**Check yourself:**
1. At the merge request, what could the engine change and what couldn't it?
2. Which question should never have been asked, and what does it indicate?
3. Where exactly is M07's plan checkpoint in this transcript?

<details><summary>Answers</summary>

1. It could rewrite the entire proposal — and could not touch a single file; iteration
   inside plan mode is free by construction.
2. The [edge] urgent-SLA question — the mob settled it back in M06 (4 hours, including
   STAT imaging), so a session reading the chain wouldn't raise it. Then open the
   practice repo for the honest twist: `prior-auth-api/docs/decisions.md` holds
   D-001…D-003 and no SLA entry at all, so in your copy that decision was never written
   down. Both cases look identical from inside the transcript, and both are chain
   failures rather than prompt failures — either the engine wasn't pointed at the chain,
   or the chain never received the decision. Fix the chain, not the prompt.
3. "YOU: Approve. [plan mode OFF]" — approval exits the mode and unlocks writes; the
   gate and the mode-exit are the same event.

</details>

## Path B — Build It with AI

> The unit of work: Inception on the notifications epic, for real. Both variants
> produce the same artifact. Run in the `prior-auth-api` folder.

### Claude Code variant

```text
# Claude Code
cd prior-auth-api
claude --permission-mode plan
> Intent: members and providers hear about determinations
> without phoning us. Restate the intent first. Then draft 5+
> requirements including a PHI guardrail (status + reference id
> only, never clinical content), at least 4 clarifying questions
> tagged [policy]/[edge]/[data]/[integration] that decisions.md
> does not already answer, and a unit-of-work list with sizing
> justifications.
# iterate inside plan mode (merge/trim UWs), then approve.
# after approval, the engine writes:
# docs/M15-notify-inception.md
```

**Expected artifact:** `docs/M15-notify-inception.md` — restatement, ≥5 requirements
with the PHI guardrail, ≥4 tagged non-duplicate questions, justified UW list.
**Verify:** nothing was written before your approval (plan mode held the gate); the
guardrail reads "status + reference id only"; no question duplicates decisions.md.

### Codex CLI variant

```text
# Codex CLI
cd prior-auth-api
codex
> Intent: members and providers hear about determinations
> without phoning us. Do NOT write any file yet — plan only and
> stop for my approval. Restate the intent first. Then draft 5+
> requirements including a PHI guardrail (status + reference id
> only, never clinical content), at least 4 clarifying questions
> tagged [policy]/[edge]/[data]/[integration] that decisions.md
> does not already answer, and a unit-of-work list with sizing
> justifications.
# iterate, then: "Approved — write docs/M15-notify-inception.md"
```

**Expected artifact:** the same inception file, steered by AGENTS.md.
**Verify:** same checks.

**Parity note:** identical artifact from both engines. The instructive difference is
the gate: Claude Code enforces it mechanically (plan mode locks writes), Codex holds
it contractually (your instruction plus your review). Same checkpoint, different
enforcement — that distinction returns in M17 and M21.

## Done when

- [ ] The inception file exists with restatement, PHI guardrail, ≥4 tagged questions
      none of which decisions.md already answers, and justified UWs.
- [ ] No file existed before your explicit approval.
- [ ] You can say which engine enforced the gate mechanically and which contractually.
