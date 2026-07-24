# Lab M24 — Trace the loop, then ship the intake

> Module: M24 — Bolt 1: AuthRequest Intake API
> Audience: practitioner · Estimated time: 40 min
> Domain: Prior Auth Portal (auth-requests endpoints, Member/Provider validation, outreach log)

## Path A — Understand It (no tooling required)

**Artifact:** B1's idempotency question loop and UW-1's AC-to-test trace table.

```text
AI:  Duplicate submissions — same member+provider+procedureCode
     while a request is open. My guess: reject the second with
     409. Deferring: member-facing semantics, not my call.
PO:  No 409 — provider offices double-click; don't punish them.
     Return the existing request id, 200, log the duplicate.
AI:  Restated as AC-5: a second identical submission creates no
     new AuthRequest and returns the first's id. Recording.

TRACE — UW-1 (5 ACs):
AC-1 field-level errors, collect-all → rejects_with_all_errors
AC-2 ineligible → reject + 1 log  → rejects_ineligible_with_
                                     one_outreach_entry
AC-3 unknown member = ineligible  → treats_empty_body_as_
     (no retry)                      ineligible_no_retry
AC-4 OON provider → review flag   → flags_oon_for_review
AC-5 duplicate → existing id      → returns_existing_id_on_
                                     duplicate
```

**Trace it:**
1. For each AC, name the artifact it descends from (steering rule, decision,
   semantic-map invariant, guardrail lineage, or this bolt's own loop).
2. Verify every AC has a named test — the fig 7.2 walk.
3. Replay the idempotency loop against M06's five stages.

**Check yourself:**
1. Which artifact does each AC descend from?
2. Why did the PO overrule the 409 — and what discipline made that cheap?
3. Which test protects the semantic map's ugliest trap?

<details><summary>Answers</summary>

1. AC-1: the steering rule (M14). AC-2: the M02 decision. AC-3: the semantic map's
   200-empty invariant (M12). AC-4: R4's guardrail lineage (M05). AC-5: this bolt's
   own loop — the chain grows at every layer.
2. Because the AI's guess was presented *as a guess with the deferral attached* — the
   decision cost four minutes in the room instead of a support-ticket pattern
   discovered in production.
3. `treats_empty_body_as_ineligible_no_retry` — the retiring engineer's tribal
   knowledge, now enforced by CI forever.

</details>

## Path B — Build It with AI

> The unit of work: B1's core — UW-0 scaffold + UW-1 intake endpoint. (UW-2 GET
> endpoint and UW-3 handoff flag follow the same loop; extend if time allows.) Run in
> the `prior-auth-api` folder — requires `docs/M23-capstone-inception.md`.

### Claude Code variant

```text
# Claude Code
cd prior-auth-api
claude
> Bolt 1, UW-0 + UW-1. Read docs/M23-capstone-inception.md and
> the decision record for the stack. Plan first, STOP for my
> approval. Then: (UW-0) scaffold per the stack decision, modules
> per entity, port pattern for the eligibility system. (UW-1)
> POST /auth-requests with schema → eligibility port → network
> check; statuses RECEIVED/REJECTED; duplicate submissions return
> the existing id per AC-5. Tests named for all 5 ACs, synthetic
> fixtures only. Run the gates yourself, show output, flag
> deviations live. Close with docs/M24-bolt1-close.md.
```

**Expected artifact:** the scaffold, the POST endpoint with the full validation
stack, five AC-named tests green, and `docs/M24-bolt1-close.md`.
**Verify:** tests green including `returns_existing_id_on_duplicate`; resources named
`auth-requests`; the eligibility quirks (staleness, E4, empty-body) live only in the
port; the close-out gives bolt 2 its opening read.

### Codex CLI variant

```text
# Codex CLI
cd prior-auth-api
codex
> Bolt 1, UW-0 + UW-1. Read docs/M23-capstone-inception.md and
> the decision record for the stack. Do NOT write yet — plan
> first, stop for approval. Then: (UW-0) scaffold per the stack
> decision, modules per entity, port pattern for the eligibility
> system. (UW-1) POST /auth-requests with schema → eligibility
> port → network check; statuses RECEIVED/REJECTED; duplicate
> submissions return the existing id per AC-5. Tests named for
> all 5 ACs, synthetic fixtures only. Run the gates yourself,
> show output, flag deviations live. Close with
> docs/M24-bolt1-close.md.
```

**Expected artifact:** the same surface, tests, and close-out.
**Verify:** same checks — and read the final diff, not the summary (M21), before you
sign the bolt.

**Parity note:** same endpoints, same statuses, same five test names from either
engine; scaffold internals may differ by engine and by your stack decision. Route per
your M22 policy — B1 is contract-heavy, so whichever engine your drill logs trust at
review is the right seat.

## Done when

- [ ] The intake surface exists: POST /auth-requests with the schema → eligibility →
      network stack.
- [ ] All five AC-named tests are green, on synthetic fixtures only.
- [ ] Legacy quirks are quarantined in the eligibility port, and
      `docs/M24-bolt1-close.md` is written.
