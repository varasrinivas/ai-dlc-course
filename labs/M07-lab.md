# Lab M07 — Approve a plan, then let the code exist

> Module: M07 — Construction: Plans, Code, Tests
> Audience: practitioner · Estimated time: 30 min
> Domain: Prior Auth Portal (AuthRequest, Member, Provider — UW-1a schema validation)

## Path A — Understand It (no tooling required)

**Artifact:** the AI's implementation plan for UW-1a, as posted for approval.

```text
PLAN UW-1a — AuthRequest schema validation      [for approval]
 1. Define AuthRequestDto: memberId, providerId, serviceCode,
    urgency.                                     → AC-1
 2. Field-level validation errors (collect all, not fail-fast).
                                                 → AC-1
 3. Member eligibility lookup port (interface only).
 4. BLOCKED (HUMAN): eligibility data may be up to how stale?
    [data] — blocks step 5 only.
 5. Eligibility check → reject + outreach log entry.  → AC-2
 6. Provider network lookup port (interface only).
 7. Out-of-network → route flag for nurse review, plus urgency
    propagation, plus request-received notification stub. → AC-3
 8. BLOCKED (HUMAN): does intake emit notifications at all, or
    does Determinations own that? [integration] — blocks step 7c.
 9. Tests: rejects_when_schema_invalid (AC-1),
    writes_outreach_log_once (AC-2), routes_oon_to_review (AC-3).
```

**Trace it:**
1. Find the two deferred decisions and note exactly which steps they block.
2. Walk AC-2 through the plan: which step implements it, which test verifies it.
3. Audit each step against "small enough to verify" — one step fails; decide the fix.

**Check yourself:**
1. What exactly blocks while step 4 waits — and what doesn't?
2. Walk AC-2 through the plan: which step, which test?
3. Which step smells, and how would you fix it before approving?

<details><summary>Answers</summary>

1. Only step 5 (and the AC-2 test depends on it); steps 1–3 and 6 proceed — narrow
   blocking, exactly like M02's frozen step 6.
2. AC-2 → step 5 → `writes_outreach_log_once`.
3. Step 7 bundles three concerns (routing, urgency propagation, notification stub) — and
   step 8 reveals the notification part isn't even decided. Split it: 7a routing (AC-3),
   7b urgency; move the notification stub behind step 8's answer. Approving the plan as-is
   would launder an undecided integration into "just a stub."

</details>

## Path B — Build It with AI

> The unit of work: UW-1a — AuthRequest schema validation, the course's first real code.
> The prompt enforces the plan checkpoint: the engine stops and waits for approval before
> implementing. Both variants must produce the same behavior and test coverage. Run in
> the `prior-auth-api` folder.

### Claude Code variant

```text
# Claude Code
cd prior-auth-api
claude
> UW-1a: AuthRequest schema validation. First, post an
> implementation plan (numbered steps, mark any decision you
> defer to me) and STOP — wait for my approval. After I approve:
> implement AuthRequestDto (memberId, providerId, serviceCode,
> urgency) with field-level validation collecting all errors,
> plus Jest unit tests named for their acceptance criteria:
> rejects_when_schema_invalid, plus a happy-path test. Scaffold
> minimal TypeScript + Jest if the repo has none. Then run the
> tests and write docs/M07-increment.md explaining every
> non-obvious choice in the diff.
```

**Expected artifact:** a minimal TypeScript + Jest scaffold, `AuthRequestDto` with
field-level validation (collect-all-errors), tests including `rejects_when_schema_invalid`
and a happy path, and `docs/M07-increment.md` explaining the diff.
**Verify:** the engine stopped at the plan and waited; `npx jest` is green; test names
match their criteria; the increment summary leaves nothing non-obvious unexplained.

### Codex CLI variant

```text
# Codex CLI
cd prior-auth-api
codex
> UW-1a: AuthRequest schema validation. First, post an
> implementation plan (numbered steps, mark any decision you
> defer to me) and STOP — wait for my approval. After I approve:
> implement AuthRequestDto (memberId, providerId, serviceCode,
> urgency) with field-level validation collecting all errors,
> plus Jest unit tests named for their acceptance criteria:
> rejects_when_schema_invalid, plus a happy-path test. Scaffold
> minimal TypeScript + Jest if the repo has none. Then run the
> tests and write docs/M07-increment.md explaining every
> non-obvious choice in the diff.
```

**Expected artifact:** the same DTO behavior, test coverage, and increment summary,
steered by AGENTS.md.
**Verify:** same checks as the Claude Code variant.

**Parity note:** both engines land on the same behavior, the same named tests, and a green
`npx jest`. Scaffold layout (folder names, config style) may differ between engines — that
surface difference doesn't matter and is worth noticing.

## Done when

- [ ] A numbered plan existed before any code, and you explicitly approved (or amended)
      it — the checkpoint was real.
- [ ] `npx jest` passes; tests are named for their acceptance criteria.
- [ ] `docs/M07-increment.md` explains every non-obvious choice in the diff.
