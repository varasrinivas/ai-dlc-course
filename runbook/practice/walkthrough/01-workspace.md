# Walkthrough 01

## Background

AI-DLC v2 runs a multi-repo feature from a **workspace**: a hub folder that is its own git
repo and holds the AI-DLC record, with each code repo cloned beside it as an immediate
child. Each child keeps its own `.git`. When you describe the work in step 02, the engine
scans the hub, finds the siblings on disk and records them in the intent's registry row.
You never pass a repo list by hand.

The layout is the lesson, which is why you build it yourself instead of running a script.
Where a file sits decides three things:

| Question | Answered by |
|---|---|
| Who can see it? | A file in the hub is visible to every unit; a file in `prior-auth-api` is visible only when the engine works in that repo. |
| What gets committed where? | The hub's `.gitignore` lists the three siblings, so the hub commits the record and never the code. Each repo commits its own code. |
| What outlives the feature? | The intent record is about this feature. A repo's `AGENTS.md` and `docs\decisions.md` are about the repo, and stay with it. |

### The pieces

- **`repos.json`** at the hub root declares the expected siblings. `aidlc system
  workspace-sync` clones any that are missing, rewrites a managed block in `.gitignore`,
  and writes `aidlc.code-workspace`, a multi-root VS Code file. A teammate can rebuild the
  whole workspace from it with one command. Give each entry a `url`: without one, AI-DLC
  clones `git@github.com:<org>/<name>.git` over SSH. The kit's copy points at local folders,
  so the exercise runs offline.
- **`aidlc config --harness <engine>`** installs the engine side: agents, stage rules,
  scopes, sensors, hooks and the onboarding file. For Claude Code that is all under
  `.claude\`; for Codex, under `.codex\` and `.agents\`. The hooks are what make the method
  binding rather than advisory: one records each human turn into the audit trail, one
  guards tool calls against the current stage, one blocks code until a plan is approved,
  and a `Stop` hook keeps the workflow moving.
- **`aidlc\spaces\default\memory\`** holds the team's method: `org.md`, `team.md`,
  `project.md` and one file per phase. Every stage of every intent loads it.
- **`aidlc doctor`** checks the machine, the project and the framework files.

### The steering-file question

You start the engine at the hub. Each repo's rules live in that repo's `AGENTS.md` and
`docs\decisions.md`: for example, prior-auth-api D-001 (a criteria score ≥ 0.85
auto-approves) and D-003 (notices carry status and `referenceId` only). Nothing guarantees
an engine running from the hub reads a nested repo's steering file before it edits that
repo. So you say it once, in the method file every stage loads: `memory\project.md`.

The kit's `seed\memory-project-steering.md` holds three blocks for the headings already in
that file. *Way of Working* says to read each repo's rules first and that one unit of work
is one repo. *Forbidden* says never change a recorded rule, never put clinical content in
a payload, never import code across repos. *Mandated* says to cite the D-id in any plan
step that touches a recorded rule. Step 02 is where you see the engine quote them back.
This pointer is a course convention built on AWS's documented memory files.

### Greenfield next to brownfield

`prior-auth-api` and `prior-auth-web` are brownfield: real code, real tests, recorded
decisions. `prior-auth-notify` starts with steering files, a decision log and an empty
`src\`. It is greenfield; the engine writes its code in step 08. Its seed decision log
already records D-001, which restates prior-auth-api's D-003 for the repo that will send
the notices.

## In the reference workspace

### The workspace before this step

Nothing under `D:\aidlc-practice\` yet. The inputs come from the course clone:

```text
ai-dlc-course-kit\
├── prior-auth-api\        AGENTS.md  CLAUDE.md  README.md  docs\  src\  package.json ...
├── prior-auth-web\        AGENTS.md  CLAUDE.md  README.md  docs\  src\  package.json ...
└── runbook\practice\seed\
    ├── memory-project-steering.md
    ├── prior-auth-notify\  .gitattributes  .gitignore  AGENTS.md  CLAUDE.md  README.md
    │                       docs\  jest.config.js  package.json  src\  tsconfig.json
    └── repos.json
```

### The commands, as typed

These are the commands the reference run used, including its output filters
(`Select-Object`, `/NFL /NDL`). The card has the plain versions. The run prefixed `PATH`
itself instead of opening a new terminal after the install.

**Install the CLI.**

```powershell
irm https://github.com/awslabs/aidlc-workflows/releases/latest/download/install.ps1 | iex
```

```text
Downloading version.json...
Downloading checksums.txt...
Downloading aidlc-release.intoto.jsonl...
Downloading install.ps1...
Downloading aidlc-windows-x64.exe...
Downloading aidlc-runtime-2.11.0.tar.gz...
Installed AI-DLC 2.11.0
[...]
Added aidlc to your user PATH.

Next: In your project, run: aidlc config
Restart existing terminals or IDEs if they cannot find aidlc.
```

In a terminal that was already open, `aidlc` was not found until `PATH` was updated:

```powershell
$env:Path = "$env:LOCALAPPDATA\aidlc\bin;$env:Path"; aidlc --version
```

```text
aidlc 2.11.0 (runtime 2.11.0)
```

**Make the three "remote" repos.**

```powershell
$kit = "D:\work\ai-workspace\tutorials\repo\ai-dlc-course-kit"
$root = "D:\aidlc-practice"
New-Item -ItemType Directory "$root\remotes" | Out-Null
robocopy "$kit\prior-auth-api" "$root\remotes\prior-auth-api" /E /XD node_modules .claude /NFL /NDL /NJH /NJS | Out-Null
robocopy "$kit\prior-auth-web" "$root\remotes\prior-auth-web" /E /XD node_modules .claude /NFL /NDL /NJH /NJS | Out-Null
robocopy "$kit\runbook\practice\seed\prior-auth-notify" "$root\remotes\prior-auth-notify" /E /NFL /NDL /NJH /NJS | Out-Null
foreach ($r in 'prior-auth-api','prior-auth-web','prior-auth-notify') {
  git -C "$root\remotes\$r" init -q -b main
  git -C "$root\remotes\$r" add -A
  git -C "$root\remotes\$r" commit -q -m "seed: $r"
  git -C "$root\remotes\$r" log --oneline
}
```

```text
936b5eb seed: prior-auth-api
ce2477d seed: prior-auth-web
warning: in the working copy of '.gitignore', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'AGENTS.md', LF will be replaced by CRLF the next time Git touches it
[...]
5340d84 seed: prior-auth-notify
```

The LF/CRLF warnings are the first sign of the line-ending snag on the card. They came
back as 84 Prettier failures in step 08.

**Create the hub and sync the siblings.**

```powershell
$hub = "D:\aidlc-practice\prior-auth-workspace"
New-Item -ItemType Directory $hub | Out-Null
Set-Location $hub
git init -q -b main
Copy-Item "$kit\runbook\practice\seed\repos.json" .
aidlc system workspace-sync
Get-ChildItem -Force | Select-Object Mode,Name
Get-Content .gitignore
```

```text
aidlc workspace-sync: reconciling D:\aidlc-practice\prior-auth-workspace against repos.json (3 repo(s))
  staging clone prior-auth-api from D:/aidlc-practice/remotes/prior-auth-api (branch main) ...
  staging clone prior-auth-web from D:/aidlc-practice/remotes/prior-auth-web (branch main) ...
  staging clone prior-auth-notify from D:/aidlc-practice/remotes/prior-auth-notify (branch main) ...
  ✓ cloned prior-auth-api on 'main'
  ✓ cloned prior-auth-web on 'main'
  ✓ cloned prior-auth-notify on 'main'
  ✓ .gitignore managed block → 3 child dir(s)
  ✓ aidlc.code-workspace → 3 child root(s)
✓ workspace in sync

Mode  Name
----  ----
d--h- .git
d---- prior-auth-api
d---- prior-auth-notify
d---- prior-auth-web
-a--- .gitignore
-a--- aidlc.code-workspace
-a--- repos.json
# Child code repos are cloned in as siblings, each with its own git + origin.
# The workspace tracks only the AI-DLC records under aidlc/, not the child source.
# >>> aidlc workspace-sync managed (do not edit inside; regenerated from repos.json) >>>
/.aidlc-workspace-sync-recovery-*/
/prior-auth-api/
/prior-auth-web/
/prior-auth-notify/
# <<< aidlc workspace-sync managed <<<
```

**Configure the engine and check.** The run looked at the plan first with `--dry-run`,
which writes nothing.

```powershell
# Claude Code
aidlc config --harness claude --dry-run
```

```text
config plan for D:\aidlc-practice\prior-auth-workspace: create=323 update=0 merge=1 preserve=1 remove=0 conflict=0
```

```powershell
# Claude Code
aidlc config --harness claude --yes
aidlc doctor
```

```text
configured D:\aidlc-practice\prior-auth-workspace for Claude Code 2.11.0; next: open Claude Code in this project (if it is already open in this folder, exit it and start it again) and run `/aidlc --doctor`
AI-DLC doctor

Machine
  warn  Update: update cache is absent
        fix: run `aidlc update --check`
  ok    11 checks passed

Project (.claude, Claude Code)
  warn  AIDLC hooks have not run in this project yet
        fix: This is expected before your first Claude Code chat in this folder. [...]
  warn  Workspace records: 8 uncommitted change(s) under aidlc/ (advisory - the shared records travel by git; commit & push so teammates get them: `git add aidlc/ && git commit && git push`)
        fix: add --verbose to see the details, correct the named condition, then run doctor again
  ok    47 checks passed

Framework integrity
  ok    all 12 checks passed

0 problems, 3 warnings.
Warnings are advisory - if everything works, ignore them.
Add --verbose to see every check.
```

The Codex side, checked in a second hub (`D:\aidlc-practice\codex-workspace`) with the same
`repos.json`:

```powershell
# Codex CLI
aidlc config --harness codex --yes 2>&1 | Select-Object -Last 2
aidlc doctor 2>&1 | Select-Object -Last 4
```

```text
Outstanding actions:
  trust/codex-hook-trust-missing: Codex has not trusted this project's hooks yet - in Codex, type /hooks, press t to trust all, then press Esc

0 problems, 3 warnings.
Warnings are advisory - if everything works, ignore them.
Add --verbose to see every check.
```

**Install dependencies, paste the steering, commit.** The steering blocks were pasted into
`memory\project.md` under their headings (the run did it with a short script; by hand is
fine). Then:

```powershell
foreach ($r in 'prior-auth-api','prior-auth-web','prior-auth-notify') {
  Set-Location "D:\aidlc-practice\prior-auth-workspace\$r"
  npm install --no-audit --no-fund 2>&1 | Select-Object -Last 1
  npm test 2>&1 | Select-String -Pattern "Tests:|Tests  |No tests|passed" | Select-Object -First 3
}
Set-Location D:\aidlc-practice\prior-auth-workspace
git add -A; git commit -q -m "hub: repos.json, aidlc config (claude), repo steering in memory/project.md"; git log --oneline
```

```text
added 280 packages in 6s

Test Suites: 1 passed, 1 total
Tests:       4 passed, 4 total
added 179 packages in 6s
 Test Files  1 passed (1)
      Tests  5 passed (5)
added 280 packages in 37s
No tests found, exiting with code 0
warning: in the working copy of '.claude/CLAUDE.md', LF will be replaced by CRLF the next time Git touches it
[...]
5311035 hub: repos.json, aidlc config (claude), repo steering in memory/project.md
```

Green starting point: api 4 tests, web 5 tests, notify "No tests found" (it passes on
purpose until Construction).

**Optional helpers.** The run then installed the kit's `prior-auth-pack` plugin (see
[`extensions/README.md`](../extensions/README.md)) and committed again. The check:

```powershell
# Claude Code
aidlc engine plugin list
```

```text
PLUGIN           INSTALLED  COMPOSED  STATUS
prior-auth-pack  0.1.0      0.1.0     current
```

### What the engine showed

The engine does not speak in this step; there is no chat yet. The closest thing is
`aidlc doctor --verbose`, whose check names are the setup's own checklist. This excerpt
was captured on 2026-10-12, later in the run, on 2.11.1-preview.20261011.1, so the hooks
have fired and the counts are higher than on day one:

```text
Project (.claude, Claude Code)
  ok    Instruction file: framework-owned file intact
  ok    Native command trust: host hooks and permission entries select the installed `aidlc` command
  ok    Project runtime stamp: 2.11.1-preview.20261011.1 (claude)
  ok    aidlc-continue-workflow.ts present
  [...]
  ok    aidlc-plan-approval-guard.ts present
  [...]
  ok    aidlc-record-human-turn.ts present
  [...]
  ok    aidlc-state-transition-guard.ts present
  ok    aidlc-statusline.ts present
  [...]
  ok    aidlc-write-audit-log.ts present
  ok    Hooks enabled (resolved disableAllHooks is not true)
  [...]
  ok    workspace shell ready (.claude/ + aidlc/spaces/default/memory/)
  [...]
  ok    Workspace repos: repos.json ⇄ on-disk siblings in sync (3 repo(s))
  ok    Workspace .gitignore: managed block matches repos.json (3 repo dir(s))
  ok    Plugins: composed state is current - prior-auth-pack:current
```

### The workspace after this step

What the first hub commit (`5311035`) holds, plus the untracked siblings:

```text
D:\aidlc-practice\
├── remotes\                       stand-ins for GitHub
│   ├── prior-auth-api\            936b5eb seed: prior-auth-api
│   ├── prior-auth-web\            ce2477d seed: prior-auth-web
│   └── prior-auth-notify\         5340d84 seed: prior-auth-notify
└── prior-auth-workspace\          the hub, its own git repo
    ├── .claude\                   CLAUDE.md, settings.json, rules\, and (file counts)
    │                              agents\ (14) aidlc-common\ (43) hooks\ (19) knowledge\ (60)
    │                              scopes\ (11) sensors\ (6) skills\ (44) tools\ (113)
    ├── .gitignore                 managed block: /prior-auth-api/ /prior-auth-web/ /prior-auth-notify/
    ├── aidlc.code-workspace       root + 3 child folders
    ├── repos.json
    ├── aidlc\spaces\default\memory\
    │   ├── org.md  team.md  project.md
    │   ├── phases\  construction.md  ideation.md  inception.md  operation.md
    │   └── templates\
    ├── prior-auth-api\            own .git, ignored by the hub
    ├── prior-auth-web\            own .git, ignored by the hub
    └── prior-auth-notify\         own .git, ignored by the hub
```

The commit touched 325 files, almost all of them under `.claude\`. You did not write any of
them. The one line that connects them to Claude is the top of `.claude\CLAUDE.md`:

```text
@.claude/rules/aidlc.md
```

The most important file you changed is `memory\project.md`. Its *Way of Working* section
after the paste:

```text
## Way of Working

Repo steering (multi-repo). This workspace holds three sibling repos: prior-auth-api,
prior-auth-web, prior-auth-notify. Before planning or changing code in one of them, read
that repo's AGENTS.md and docs/decisions.md. They outrank this file for that repo.
One unit of work = one repo. Cross-repo coordination goes through the contract that
prior-auth-api publishes in prior-auth-api/contracts/, never through shared source.
```

`.claude\settings.json` wires the hooks to Claude Code. Two entries from the file as it
stands now: the hook that writes every human turn into the audit trail, and the `Stop`
hook that keeps the workflow moving.

```text
    "UserPromptSubmit": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "aidlc engine hook record-human-turn",
            "timeout": 1800
          }
        ]
      }
    ],
[...]
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "aidlc engine hook continue-workflow",
            "timeout": 3600
          }
        ]
      }
    ]
```

The rest follow the same pattern: `guard-tool-call` before tool calls, `write-audit-log`
and `run-sensors` after writes, `session-start` and `session-end`, and
`aidlc engine statusline` for the status line.

<!-- not captured: .claude\settings.json as it was at commit 5311035; the excerpt above is from the current file (2026-10-12) -->
