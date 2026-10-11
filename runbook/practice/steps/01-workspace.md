# Step 01 — Build the hub workspace and its three sibling repos

> Runbook section: [01 · Workspace setup](../../multi-repo-feature.html#s1) ·
> Phase: before the lifecycle · Time: 30–40 minutes, once

## Goal

Build, by hand, the layout AI-DLC v2 uses for a feature that spans several repos:

- a **hub** folder, which is its own git repo and holds the AI-DLC record;
- the code repos cloned **beside** each other inside it.

You'll do this by hand instead of running a script, because the layout *is* the lesson:
- where each file lives decides who can see it;
- it decides what gets committed where;
- it decides what outlives the feature.

## Who's in the room

The **tech lead**, alone, once per workspace. Nobody approves anything yet.

## Do it

All commands are Windows PowerShell. `$kit` is wherever you cloned this course; change it.

**1. Install the tools (once per machine).**

```powershell
# AWS's AI-DLC CLI. Run from a normal (not admin) PowerShell window.
irm https://github.com/awslabs/aidlc-workflows/releases/latest/download/install.ps1 | iex
# Open a NEW terminal so PATH picks it up, then:
aidlc --version          # aidlc 2.11.0 (runtime 2.11.0)

# One or both engines
npm i -g @anthropic-ai/claude-code    # then sign in: claude
npm i -g @openai/codex                # needs 0.145.0 or newer; sign in: codex login
```

**2. Make three "remote" repos.** In a real team these are on GitHub. Here they're local folders that stand in for GitHub. That way the whole exercise runs offline, and you don't need SSH keys.

```powershell
$kit  = "D:\path\to\ai-dlc-course"          # <- your course clone
$root = "D:\aidlc-practice"
mkdir "$root\remotes"
robocopy "$kit\prior-auth-api" "$root\remotes\prior-auth-api" /E /XD node_modules .claude
robocopy "$kit\prior-auth-web" "$root\remotes\prior-auth-web" /E /XD node_modules .claude
robocopy "$kit\runbook\practice\seed\prior-auth-notify" "$root\remotes\prior-auth-notify" /E
foreach ($r in 'prior-auth-api','prior-auth-web','prior-auth-notify') {
  git -C "$root\remotes\$r" init -b main
  git -C "$root\remotes\$r" add -A
  git -C "$root\remotes\$r" commit -m "seed: $r"
}
```

`prior-auth-notify` starts almost empty: steering files, a decision log, and an empty
`src/`. It is the **greenfield** repo. The engine writes its code in step 08.

**3. Create the hub and let AI-DLC clone the siblings.**

```powershell
mkdir "$root\prior-auth-workspace"; cd "$root\prior-auth-workspace"
git init -b main
Copy-Item "$kit\runbook\practice\seed\repos.json" .     # edit the url paths if your $root differs
aidlc system workspace-sync
```

`repos.json` declares the repo set. Each entry has a `url`, because without one AI-DLC
clones `git@github.com:<org>/<name>.git` over SSH.

**4. Configure the engine and check the setup.**

```powershell
# Claude Code
aidlc config --harness claude --yes
aidlc doctor
```

```powershell
# Codex CLI: the same hub can hold both engines
aidlc config --harness codex --yes
aidlc doctor
codex          # first run only: type /hooks, press t to trust all, then Esc
```

**5. Install each repo's dependencies.**

```powershell
foreach ($r in 'prior-auth-api','prior-auth-web','prior-auth-notify') {
  Push-Location $r; npm install; npm test; Pop-Location
}
```

**6. Teach the hub to respect each repo's rules.** Open
`aidlc\spaces\default\memory\project.md`. Paste each block from
`$kit\runbook\practice\seed\memory-project-steering.md` under the heading of the same
name: *Way of Working*, *Forbidden*, *Mandated*. Then commit the hub:

```powershell
git add -A; git commit -m "hub: repos.json, aidlc config, repo steering"
```

**7. (Recommended) Install the learning helpers.** Follow
[`extensions/README.md`](../extensions/README.md). It takes about 10 minutes and gives you:
- `aidlc-coach`, which explains where you are;
- `repo-plan-reviewer`;
- the decision-log guard;
- the `prior-auth-pack` plugin.

## What you'll see

`workspace-sync` clones the three repos and writes two generated files:

```
aidlc workspace-sync: reconciling D:\aidlc-practice\prior-auth-workspace against repos.json (3 repo(s))
  ✓ cloned prior-auth-api on 'main'
  ✓ cloned prior-auth-web on 'main'
  ✓ cloned prior-auth-notify on 'main'
  ✓ .gitignore managed block → 3 child dir(s)
  ✓ aidlc.code-workspace → 3 child root(s)
✓ workspace in sync
```

`aidlc doctor` before your first chat in the folder:

```
0 problems, 3 warnings.
```

The three warnings are expected:
- "update cache is absent";
- "hooks have not run in this project yet" (they run on your first chat);
- "uncommitted change(s) under aidlc/" (until you commit).

## Under the hood

Open these and look; nothing here is magic.

- `.gitignore`. A managed block lists `/prior-auth-api/` and the other two. The hub
  **never** commits application code; each sibling has its own `.git`.
- `aidlc\spaces\default\memory\`, which holds `org.md`, `team.md`, `project.md` and `phases\`.
  This is the **method**, loaded into every stage of every intent.
- `.claude\settings.json`, AI-DLC's hooks:
  - `plan-approval-guard`, `state-transition-guard` and `write-audit-log`;
  - a `Stop` hook that keeps the workflow moving;
  - the status line.
  You don't write these; you learn what they do.
- `.claude\CLAUDE.md` starts with `@.claude/rules/aidlc.md`. That one line is how the
  method reaches Claude's context.
- On Codex the same onboarding goes to `.codex\config.toml` as `developer_instructions`.
  `.codex\onboarding.md` holds the same text for you to read.

## Before you move on

- Do all three repos' `npm test` runs pass? You're about to ask an engine to change them.
  You need to know the starting point is green.
- Does `project.md` have the *Repo steering* paragraph under *Way of Working*? Step 02 is
  where you'll see it working.

## Try this

Run `aidlc doctor --verbose` and read the check names. They are the setup's own
checklist: hooks, harness, runtime, workspace records.

## Files written

`repos.json` · `.gitignore` (managed block) · `aidlc.code-workspace` · `.claude/` or
`.codex/` · `aidlc/spaces/default/memory/*`.
Compare with [`reference-run/hub/`](../reference-run/).

## Common snags (hit during the reference run)

- **`aidlc` is not recognized.** The installer added it to your *user* PATH. Open a new
  terminal.
- **`git commit` fails with "Please tell me who you are".** Set
  `git config --global user.name` and `user.email` first.
- **LF/CRLF warnings on commit.** These are harmless on Windows.
- **The engine's shell says "The command line is too long".** Your PATH is very long.
  Start the engine from a terminal with a shorter PATH.
- **Headless `claude -p` ignores the project's permissions.** It needs the workspace
  trusted first. Open `claude` interactively in the hub once and accept the trust dialog.
