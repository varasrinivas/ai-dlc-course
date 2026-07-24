# Lab M17 — Trace the gate, then build the lock

> Module: M17 — Checkpoints: Hooks & Validation Gates
> Audience: practitioner · Estimated time: 30 min
> Domain: Prior Auth Portal (AUTO_APPROVE_THRESHOLD config gate, jest test gate)

## Path A — Understand It (no tooling required)

**Artifact:** the portal's permissions + hooks config, and one attempted edit.

```text
permissions.allow:  "Bash(npx jest:*)", "Bash(git status)",
                    "Bash(git diff:*)"
hooks.PreToolUse:   matcher: "Edit|Write"  ← matches TOOL NAMES
                    run: scripts/check-threshold-gate.ps1
                    script reads the hook JSON on stdin, takes
                    tool_input.file_path, and gates only the two
                    files 0.85 can live in: the constant in
                    src/domain/clinical-criteria.ts (today) and
                    config/threshold.json (after M25's migration)
                    — blocks unless docs/decisions/ has a record
hooks.PostToolUse:  matcher: "Edit|Write"
                    run: scripts/jest-if-src.ps1
                    same shape — script checks the path is under
                    src/, then runs npx jest --silent

ATTEMPT: "bump AUTO_APPROVE_THRESHOLD to 0.82 for imaging"
→ engine proposes edit to src/domain/clinical-criteria.ts → ?
```

**Trace it:**
1. Narrate the attempt step by step: which hook fires, what it checks, what the engine
   sees back.
2. Explain each allowlist entry: why do these commands flow without prompts?
3. Stress-test the topology: propose one gate that would be wrong to add.

**Check yourself:**
1. Narrate the attempt: what fires, what does the engine see, where does a human enter?
2. The matcher says `Edit|Write`, not a path — where does the path filtering happen,
   and why is `npx jest` allowlisted while `Edit` is not?
3. Which gate here would be WRONG to add: prompting on every file read, or blocking
   edits to docs/? Why?

<details><summary>Answers</summary>

1. PreToolUse fires on *every* Edit or Write — the matcher cannot be narrower — and the
   check script decides: it reads the hook JSON on stdin, sees the path is
   `src/domain/clinical-criteria.ts`, finds no matching record in `docs/decisions/`, and
   exits non-zero. The block message returns to the engine, which reports the refusal
   and the unlock path (a signed record) — the human enters exactly where M10 said: as
   the policy owner creating that record, not as a code reviewer catching it later.
2. Matchers match tool *names*, never paths, so the hook fires broadly and the script
   does the path filtering — which is why the script, not the config, is where you
   enumerate every file the guarded value can live in; miss one and the gate has a door.
   `npx jest` is allowlisted because it is read-only-ish, frequent, and self-evidently
   safe — prompting on it breeds fatigue; edits mutate state, so they ask.
3. Both — read prompts would fire hundreds of times a session (fatigue), and docs/ is
   where the engine is *supposed* to write freely; gating it punishes the artifact
   chain. Gates follow blast radius, not anxiety.

</details>

## Path B — Build It with AI

> The unit of work: mechanize the two canon gates, then drill them. Run in the
> `prior-auth-api` folder. The two variants implement the same gates with different
> mechanisms — that difference is the lesson.
>
> Note where the 0.85 actually lives today: the constant `AUTO_APPROVE_THRESHOLD` in
> `src/domain/clinical-criteria.ts`. `config/threshold.json` is created here as the
> target of Lab M25's migration, so until that bolt the gate must cover both.

### Claude Code variant

```text
# Claude Code
cd prior-auth-api
claude
> The 0.85 lives in TWO places this bolt: the constant
> AUTO_APPROVE_THRESHOLD in src/domain/clinical-criteria.ts
> (today's real source of truth) and config/threshold.json,
> which you should create with value 0.85 so M25's migration
> has a gated target. Gate BOTH — a gate over one of two
> sources is not a gate. Wire two hooks in
> .claude/settings.json: (1) PreToolUse with matcher
> "Edit|Write" — matchers match TOOL NAMES, not paths —
> running scripts/check-threshold-gate.ps1 (PowerShell), which
> reads the hook JSON on stdin, takes tool_input.file_path,
> exits 0 for any other file, and otherwise blocks (exit 2)
> unless a file in docs/decisions/ names the threshold change.
> (2) PostToolUse with the same "Edit|Write" matcher, running
> scripts/jest-if-src.ps1, which runs npx jest --silent only
> when the edited path is under src/.
> Show me both configs and both scripts, then stop.

# the drill — fresh session:
claude
> Bump AUTO_APPROVE_THRESHOLD to 0.82 for imaging requests.
# expected: the engine reaches for the .ts constant, not the
# JSON — and the gate blocks there too, reporting the unlock
# path. Then:
> Write docs/M17-gate-drill.md: the gates wired, which file the
> engine actually tried to edit, and what the drill showed.
```

**Expected artifact:** `config/threshold.json`, `.claude/settings.json` with both
hooks, `scripts/check-threshold-gate.ps1`, `scripts/jest-if-src.ps1`, and
`docs/M17-gate-drill.md`.
**Verify:** the drill edit was blocked by the hook (not by politeness), and it blocked
on `src/domain/clinical-criteria.ts` — not merely on a JSON file nothing reads yet; an
unrelated src edit demonstrably triggered jest; the drill log records both.

### Codex CLI variant

```text
# Codex CLI — honest parity: same gates, different mechanism
cd prior-auth-api
codex
> Create config/threshold.json (value 0.85) as M25's migration
> target; today the live value is the constant
> AUTO_APPROVE_THRESHOLD in src/domain/clinical-criteria.ts.
> Wire the gates contractually: (1) write scripts/check-gates.ps1
> that fails if EITHER config/threshold.json OR the constant in
> src/domain/clinical-criteria.ts changed without a matching file
> in docs/decisions/, and add an AGENTS.md rule: run it before
> presenting any work. (2) Add the rule: run npx jest after any
> src/ change and show the output. Show me both and stop.

# the drill — fresh session:
codex
> Bump AUTO_APPROVE_THRESHOLD to 0.82 for imaging requests.
# expected: refusal citing the rule + a failing check-gates run.
> Write docs/M17-gate-drill.md: the gates wired and what the
> drill showed.
```

**Expected artifact:** `config/threshold.json`, `scripts/check-gates.ps1` (covering
both threshold sources), the two AGENTS.md rules, and the same
`docs/M17-gate-drill.md`.
**Verify:** same drill outcome, same log.

**Parity note:** the *gates* are identical — threshold edits blocked without a decision
record, jest after src changes. The *mechanisms* are not: Claude Code enforces
mechanically (hooks fire regardless of anyone's memory), Codex enforces contractually
(steering rule + script + your review). Record which is which in the drill log — this
asymmetry is direct input to M22's engine-selection discussion.

## Done when

- [ ] The threshold drill fails safely on both engines — whichever of the two threshold
      sources the engine reaches for — with the refusal citing the missing decision
      record.
- [ ] The jest gate demonstrably fires on a src edit.
- [ ] `docs/M17-gate-drill.md` records both drills and names which enforcement was
      mechanical and which contractual.
