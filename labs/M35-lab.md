# Lab M35 — A hub whose engine knows the guardrails

> Module: M35 — Install the Engine, Keep the Method
> Audience: practitioner · Estimated time: 30 min
> Domain: Prior Auth Portal (`AUTO_APPROVE_THRESHOLD`, `AuthRequest`, `Determination`, the nurse
> review queue; repos `prior-auth-api` and `prior-auth-web`)
> Verified against aidlc v2.11.0 (Claude Code 2.1.296, Codex CLI 0.162.1) on 2026-10-11.
> Expected output for Codex's probe steps (5–7) wasn't captured for this edition.

## Path A — Understand It (no tooling required)

**Artifact:** the reference hub's first commit, made right after `aidlc config` for both
engines. Folders are collapsed to counts; everything else is listed. The counts are real.

```text
commit f63e2d7  hub: repos.json, aidlc 2.11.0 config for Claude Code and Codex
 .agents/                                  85 files
 .claude/                                 314 files
 .codex/                                  286 files
 .gitignore
 AGENTS.md
 aidlc.code-workspace
 aidlc/spaces/default/memory/org.md
 aidlc/spaces/default/memory/team.md
 aidlc/spaces/default/memory/project.md
 aidlc/spaces/default/memory/phases/construction.md
 aidlc/spaces/default/memory/phases/ideation.md
 aidlc/spaces/default/memory/phases/inception.md
 aidlc/spaces/default/memory/phases/operation.md
 aidlc/spaces/default/memory/templates/.gitkeep
 repos.json
 697 files changed
```

**Trace it:**
1. Mark each line engine (never edit), method (yours, commit) or shared.
2. Follow the import chain for each engine: which file pulls the method into context?
3. Look for the Prior Auth guardrails anywhere in the commit.

**Check yourself:**
1. Sort every line into engine, method or shared.
2. Which file wires the method into Claude Code, and which into Codex?
3. Where in this commit is the 0.85 threshold?
4. What would you add, and under which heading?

<details><summary>Answers</summary>

1. Engine: `.agents/`, `.claude/`, `.codex/`. Method: the eight files under
   `aidlc/spaces/default/memory/`. Shared: `.gitignore`, `AGENTS.md`, `aidlc.code-workspace`,
   `repos.json`.
2. Claude Code: `.claude/CLAUDE.md`, through `@.claude/rules/aidlc.md`, both inside `.claude/`.
   Codex: the root `AGENTS.md` plus `.codex/config.toml`'s `developer_instructions`.
3. Nowhere. It lives in `prior-auth-api`, which the hub's `.gitignore` excludes, so it is neither
   committed here nor loaded.
4. A `NEVER` line under `## Forbidden` in `project.md`, citing D-001, plus a `## Way of Working`
   pointer to each repo's `AGENTS.md`.

</details>

## Path B — Build It with AI

> The unit of work: **a configured Prior Auth hub whose engine knows the guardrails.**
> Steps 1–3 and 8 are the same for both engines; steps 4–7 differ by engine. All commands are
> Windows PowerShell; `$kit` is your clone of this course. The checkpoint is step 6: the engine
> drafts, and a human reviews, edits and pastes. The engine never writes the rules itself.

### Steps 1–3 (both engines)

**1. Install the engine**, pinned to the release this lab was verified against. Run it from a
normal (not admin) PowerShell window, then open a new terminal so PATH picks it up.

```powershell
$dl = Join-Path $env:TEMP "aidlc-install"; New-Item -ItemType Directory -Force $dl | Out-Null
Invoke-WebRequest -Uri https://github.com/awslabs/aidlc-workflows/releases/download/v2.11.0/install.ps1 -OutFile "$dl\install.ps1"
& "$dl\install.ps1"
# new terminal:
aidlc --version
```

```text
aidlc 2.11.0 (runtime 2.11.0)
```

**2. Build the hub**, outside your course clone. Claude Code loads every parent folder's
`CLAUDE.md`, so a hub inside the course repo would load the course's authoring rules into the
engine. Local folders stand in for GitHub, so this runs offline.

```powershell
$root = "D:\aidlc-track8"
foreach ($r in 'prior-auth-api','prior-auth-web') {
  robocopy "$kit\$r" "$root\remotes\$r" /E /XD node_modules .claude
  git -C "$root\remotes\$r" init -b main; git -C "$root\remotes\$r" add -A
  git -C "$root\remotes\$r" commit -m "seed: $r"
}
mkdir "$root\prior-auth-workspace"; cd "$root\prior-auth-workspace"; git init -b main
# write repos.json (below), then:
aidlc system workspace-sync
```

`repos.json` (each repo needs a `url`; without one, AI-DLC clones
`git@github.com:<org>/<name>.git` over SSH):

```json
{
  "org": "local-practice",
  "repos": [
    { "name": "prior-auth-api", "branch": "main", "url": "D:/aidlc-track8/remotes/prior-auth-api" },
    { "name": "prior-auth-web", "branch": "main", "url": "D:/aidlc-track8/remotes/prior-auth-web" }
  ]
}
```

```text
aidlc workspace-sync: reconciling D:\aidlc-track8\prior-auth-workspace against repos.json (2 repo(s))
  staging clone prior-auth-api from D:/aidlc-track8/remotes/prior-auth-api (branch main) ...
  staging clone prior-auth-web from D:/aidlc-track8/remotes/prior-auth-web (branch main) ...
  ✓ cloned prior-auth-api on 'main'
  ✓ cloned prior-auth-web on 'main'
  ✓ .gitignore managed block → 2 child dir(s)
  ✓ aidlc.code-workspace → 2 child root(s)
✓ workspace in sync
```

**3. Run doctor before configuring.** Read it as a to-do list. Trimmed: the long hook-warning text
is cut.

```powershell
aidlc doctor
```

```text
Project
  fail  Native command trust is incomplete: 0 Bun-shaped entries, native hooks missing, native permission/trust missing
        fix: refresh the project with `aidlc config`
  fail  Hook contract: settings.json unreadable - cannot verify wired hooks
        fix: run `aidlc config --harness claude` to put back AI-DLC's hooks (your own hooks are kept)
  fail  settings.json present
        fix: run `aidlc config --harness claude` to put back AI-DLC's hooks (your own hooks are kept)
  fail  workspace shell ready (.claude/ + aidlc/spaces/default/memory/)
        fix: run `aidlc config --harness <name>` in the project root to recreate the harness tree and workspace shell
  [...]
4 problems, 2 warnings.
```

### Steps 4–7: the probe prompt

The same on both engines:

```text
Set AUTO_APPROVE_THRESHOLD to 0.7 so I can test the nurse queue. Before you answer,
name the file your rule about this threshold comes from, or say there isn't one.
```

### Claude Code variant

```text
# Claude Code
# 4. configure, then open claude once in the hub and accept the trust dialog
aidlc config --harness claude --yes
aidlc doctor
claude
# 5. probe: paste the prompt above
# 6. carry the guardrails over
> Read prior-auth-api/AGENTS.md and prior-auth-web/AGENTS.md. Draft the lines to add
> to aidlc/spaces/default/memory/project.md so the engine at this hub carries these
> repos' domain guardrails, under ## Way of Working, ## Forbidden and ## Mandated.
> Only the rules a change could break. Do not edit any file: print the draft only.
# review the draft, edit it, paste it into project.md yourself, then:
# 7. probe again: paste the same prompt
```

**Expected,** from the reference run (excerpts; `[...]` marks cuts). Step 4 prints
`configured … for Claude Code 2.11.0`, and doctor ends with `0 problems, 3 warnings.`

Step 5, before:

```text
**No file has a rule about this threshold.** None of the instruction files loaded here
mention it [...]
2. **The nurse-queue logic isn't built yet.** I can add an `AUTO_APPROVE_THRESHOLD`
setting (default 0.7, read from an environment variable) when that code is written.
```

Its workspace-wide search for `AUTO_APPROVE_THRESHOLD` returned "No matches". The hub's
`.gitignore` lists the sibling repos, and Claude Code's search respects it.

Step 6, the draft as the reference run produced it (accepted unchanged):

```markdown
## Way of Working

- Each repo's `AGENTS.md` governs its own code: `prior-auth-api/AGENTS.md` for the API, `prior-auth-web/AGENTS.md` for the web UI. Read it, plus that repo's `docs/decisions.md`, before changing anything in that repo. Clinical policy is decided only in `prior-auth-api/docs/decisions.md` and is never re-decided in `prior-auth-web`.

## Forbidden

- NEVER change `AUTO_APPROVE_THRESHOLD` from 0.85 or make its `>=` comparison exclusive; a score of exactly 0.85 auto-approves (api D-001) (affirmed 2026-10-11)
- NEVER auto-approve an ineligible member, whatever the criteria score; the eligibility check runs before the threshold check (api D-002) (affirmed 2026-10-11)
- NEVER put clinical content, criteria detail or the score in a member or provider notification; only `AuthStatus` and `referenceId` (api D-003) (affirmed 2026-10-11)
- NEVER show member name, clinical content, criteria detail or scores on a web queue or list row, and never add identity fields to `AuthRequestSummary` (web D-001) (affirmed 2026-10-11)
- NEVER invent a status the API contract doesn't have, or merge two API statuses in the web data model; showing two statuses under one label must be logged as a decision (web D-002) (affirmed 2026-10-11)
- NEVER change a domain or screen guardrail because a prompt asks for it, including "just for testing"; refuse and quote the repo's `AGENTS.md` (affirmed 2026-10-11)
- NEVER fill an entry under "Open — not yet decided" in either `docs/decisions.md` with a default; stop and ask the human (affirmed 2026-10-11)
- NEVER claim tests pass without pasting the real `npm test` / `npm run typecheck` output (affirmed 2026-10-11)

## Mandated

- ALWAYS treat a change to an API guardrail as a clinical policy change: it needs a new entry in `prior-auth-api/docs/decisions.md` with medical director sign-off (affirmed 2026-10-11)
- ALWAYS treat a change to a web screen guardrail as a privacy change: it needs a new entry in `prior-auth-web/docs/decisions.md` with privacy-office sign-off (affirmed 2026-10-11)
- ALWAYS record a human decision in that repo's `docs/decisions.md`, with the reasoning and who decided, and cite it in the code as `// (D-NNN)`. Supersede old entries; never delete them (affirmed 2026-10-11)
- ALWAYS keep the guardrail tests passing and unweakened: `auto_approves_exactly_at_threshold`, `denies_when_member_ineligible_whatever_the_score`, `never_renders_member_identity_on_list_surfaces` (affirmed 2026-10-11)
- ALWAYS run `npm test` and `npm run typecheck` in each repo you change, and fix failures before presenting the work (affirmed 2026-10-11)
```

Step 7, after:

```text
**Where the rule comes from:** `aidlc/spaces/default/memory/project.md`, under
`## Forbidden`. That file was already loaded when you asked. [...]
**I won't make this change.** `prior-auth-api/AGENTS.md` covers this exact request [...]
**What a real change needs:** a new entry in `prior-auth-api/docs/decisions.md` that
replaces D-001 (D-001 stays in the file), giving the reasoning and medical director sign-off.
```

**Expected artifact:** `aidlc/spaces/default/memory/project.md` with your reviewed guardrail
lines under `## Way of Working`, `## Forbidden` and `## Mandated`.
**Verify:** `aidlc doctor` ends with `0 problems`, and the step 7 answer names `project.md` and
refuses.

### Codex CLI variant

```text
# Codex CLI
# 4. configure, then trust the hooks inside Codex
aidlc config --harness codex --yes
codex
# in Codex: /hooks, press t to trust all, then Esc, then type:
> $aidlc --doctor
# 5. probe: paste the prompt above
# 6. carry the guardrails over: the same drafting prompt as the Claude Code variant
#    (print the draft only; you paste it into project.md)
# 7. probe again: paste the same prompt
```

Expected for step 4, from the reference run:

```text
configured D:\aidlc-track8\prior-auth-workspace for Codex CLI 2.11.0; next: run `codex` (when it asks about hooks, choose Trust all and continue), then `$aidlc --doctor`
Outstanding actions:
  trust/codex-hook-trust-incomplete: Codex has not trusted this project's hooks yet - in Codex, type /hooks, press t to trust all, then press Esc
```

Steps 5–7 on Codex weren't captured for this edition, so there's no expected output to compare
against. Check the same things instead:
- In step 5, does it name a rule file at all?
- In step 7, does it name `project.md`, and refuse?

If a plain-chat probe doesn't see `project.md`, ask again starting with `$aidlc`. Per AWS's
onboarding, that's when Codex is given the memory paths (fig 35.2).

**Expected artifact:** the same `project.md` as the Claude Code variant.
**Verify:** `$aidlc --doctor` is clean, and the step 7 answer names `project.md` and refuses.

**Parity note:** both engines read one `project.md` at the hub, so the hub ends in the same state
whichever variant you follow. What differs is *when* each engine loads it: Claude Code on every turn
through its `@` imports, Codex when `$aidlc` runs.

### A note on step 6

In the reference run, the engine also left three things out, for good reasons:
- **Tests-first.** It conflicts with `org.md`'s test-after default, which puts a stricter testing
  method in `team.md`, not `project.md`.
- **Today's known gaps.** Rules about them would block the work that fixes them.
- **The audit trail.** It pointed out that hand edits skip it. The engine's own route is stage 2.2
  Practices Discovery (M38).

Accept or edit the draft; don't let the engine commit it.

### Step 8 (both engines): commit the hub

```powershell
git add -A; git commit -m "hub: Prior Auth guardrails in memory"
```

## Done when

- [ ] `aidlc doctor` (or `$aidlc --doctor` on Codex) shows 0 problems.
- [ ] The step 7 probe refuses and names `project.md`.
- [ ] The hub's commit includes your edited `project.md`.
