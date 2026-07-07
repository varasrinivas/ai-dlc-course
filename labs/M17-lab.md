# Lab M17 — Trace the gate, then build the lock

> Module: M17 — Checkpoints: Hooks & Validation Gates
> Audience: practitioner · Estimated time: 30 min
> Domain: Prior Auth Portal (AUTO_APPROVE_THRESHOLD config gate, jest test gate)

## Path A — Understand It (no tooling required)

**Artifact:** the portal's permissions + hooks config, and one attempted edit.

```text
permissions.allow:  "Bash(npx jest*)", "Bash(git status)",
                    "Bash(git diff*)"
hooks.PreToolUse:   matcher: Edit → config/threshold.json
                    run: scripts/check-threshold-gate.ps1
                    (blocks unless docs/decisions/ has a record)
hooks.PostToolUse:  matcher: Edit → src/**
                    run: npx jest --silent

ATTEMPT: "bump AUTO_APPROVE_THRESHOLD to 0.82 for imaging"
→ engine proposes edit to config/threshold.json → ?
```

**Trace it:**
1. Narrate the attempt step by step: which hook fires, what it checks, what the engine
   sees back.
2. Explain each allowlist entry: why do these commands flow without prompts?
3. Stress-test the topology: propose one gate that would be wrong to add.

**Check yourself:**
1. Narrate the attempt: what fires, what does the engine see, where does a human enter?
2. Why is `npx jest` allowlisted but `Edit` not?
3. Which gate here would be WRONG to add: prompting on every file read, or blocking
   edits to docs/? Why?

<details><summary>Answers</summary>

1. PreToolUse matches the path and runs the check script; no decision record exists, so
   the hook blocks and its message returns to the engine, which reports the refusal and
   the unlock path (a signed record) — the human enters exactly where M10 said: as the
   policy owner creating that record, not as a code reviewer catching it later.
2. jest is read-only-ish, frequent, and self-evidently safe — prompting on it breeds
   fatigue; edits mutate state, so they ask.
3. Both — read prompts would fire hundreds of times a session (fatigue), and docs/ is
   where the engine is *supposed* to write freely; gating it punishes the artifact
   chain. Gates follow blast radius, not anxiety.

</details>

## Path B — Build It with AI

> The unit of work: mechanize the two canon gates, then drill them. Run in the
> `prior-auth-api` folder. The two variants implement the same gates with different
> mechanisms — that difference is the lesson.

### Claude Code variant

```text
# Claude Code
cd prior-auth-api
claude
> Create config/threshold.json (value 0.85). Then wire two gates:
> (1) .claude/settings.json PreToolUse hook — edits touching
> config/threshold.json run scripts/check-threshold-gate.ps1,
> which blocks unless a file exists in docs/decisions/ naming
> the threshold change; write that script (PowerShell).
> (2) PostToolUse hook — edits under src/ run npx jest --silent.
> Show me both configs and stop.

# the drill — fresh session:
claude
> Bump AUTO_APPROVE_THRESHOLD to 0.82 for imaging requests.
# expected: the hook blocks; the engine reports the refusal and
# the unlock path. Then:
> Write docs/M17-gate-drill.md: the gates wired and what the
> drill showed.
```

**Expected artifact:** `config/threshold.json`, `.claude/settings.json` with both
hooks, `scripts/check-threshold-gate.ps1`, and `docs/M17-gate-drill.md`.
**Verify:** the drill edit was blocked by the hook (not by politeness); a src edit
demonstrably triggered jest; the drill log records both.

### Codex CLI variant

```text
# Codex CLI — honest parity: same gates, different mechanism
cd prior-auth-api
codex
> Create config/threshold.json (value 0.85). Then wire our gates
> contractually: (1) write scripts/check-gates.ps1 that fails if
> config/threshold.json changed without a matching file in
> docs/decisions/, and add an AGENTS.md rule: run it before
> presenting any work. (2) Add the rule: run npx jest after any
> src/ change and show the output. Show me both and stop.

# the drill — fresh session:
codex
> Bump AUTO_APPROVE_THRESHOLD to 0.82 for imaging requests.
# expected: refusal citing the rule + a failing check-gates run.
> Write docs/M17-gate-drill.md: the gates wired and what the
> drill showed.
```

**Expected artifact:** `config/threshold.json`, `scripts/check-gates.ps1`, the two
AGENTS.md rules, and the same `docs/M17-gate-drill.md`.
**Verify:** same drill outcome, same log.

**Parity note:** the *gates* are identical — threshold edits blocked without a decision
record, jest after src changes. The *mechanisms* are not: Claude Code enforces
mechanically (hooks fire regardless of anyone's memory), Codex enforces contractually
(steering rule + script + your review). Record which is which in the drill log — this
asymmetry is direct input to M22's engine-selection discussion.

## Done when

- [ ] The threshold drill fails safely on both engines, with the refusal citing the
      missing decision record.
- [ ] The jest gate demonstrably fires on a src edit.
- [ ] `docs/M17-gate-drill.md` records both drills and names which enforcement was
      mechanical and which contractual.
