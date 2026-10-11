# Learning helpers for a first AI-DLC run

AI-DLC v2.11 already installs a lot when you run `aidlc config`. Learn those parts first.
The helpers in this folder only fill the gaps this feature and a first-timer hit.

## What AI-DLC already gives you (don't add these)

| You want | Already there | Where to look |
|---|---|---|
| "No code before the plan is approved" | `plan-approval-guard` hook (PreToolUse) | `.claude/settings.json` → `hooks`; Codex: `.codex/hooks.json` |
| "Where am I in the lifecycle?" | Status line; `/aidlc --status` | bottom of the Claude Code screen |
| A record of who decided what | `record-human-turn` + `write-audit-log` hooks | `intents/<id>/audit/` |
| Keep the workflow moving between gates | `continue-workflow` Stop hook | `.claude/settings.json` → `Stop` |
| Automatic checks on what the AI writes | 6 sensors (required sections, upstream coverage, traceability, type-check, linter, claim sources) | `.claude/sensors/` |
| What happened, and what it cost | `/aidlc-replay`, `/aidlc-session-cost`, `/aidlc-outcomes-pack` | type them at the hub |
| Run one stage on its own | `/aidlc-<stage>` runners, e.g. `/aidlc-domain-design` | `.claude/skills/` |

We considered three more helpers and rejected them:

- **A plan-gate hook and a status-line banner:** they would duplicate the table above.
- **A Stop hook that runs `npm test`:** it would fire every turn, and it fights AI-DLC's
  own `continue-workflow` Stop hook.
- **The `feature-dev` plugin:** it runs a competing stage flow.

## What this folder adds

| Helper | Mechanism | Engines | What it teaches |
|---|---|---|---|
| `prior-auth-pack` | **AI-DLC plugin**: overlays + knowledge | both | How a team customises the method without forking it |
| `aidlc-coach` | Skill, read-only | both | What each stage is for and what to check before Approve |
| `repo-plan-reviewer` | Subagent (Claude) / skill (Codex), read-only | both | Reviewing an AI plan against a repo's recorded decisions |
| `rally-draft` | Skill, writes only `tracking/rally/` | both | Where AI-DLC stops and your tracker begins |
| Decision-log guard | PreToolUse hook returning `ask` | Claude Code | Steering *asks*; a hook *enforces* |

### 1. The `prior-auth-pack` plugin

`prior-auth-pack/` uses AWS's plugin format (`.aidlc-plugin/plugin.json`). It changes
**five core stages** without editing them. Each file in `contributions/` names a target
stage and a step anchor, and the composer splices its paragraph into that stage:

| Contribution | Spliced after | Says |
|---|---|---|
| `inception/requirements-analysis.md` | Step 1 | Read each repo's `AGENTS.md` and `docs/decisions.md`; settle cross-repo ownership now |
| `inception/units-generation.md` | Step 2 | One unit = one repo |
| `inception/contract-design.md` | Step 4 | The contract is two artifacts; events carry no clinical content |
| `construction/functional-design.md` | Step 1 | Read the owning repo's steering first |
| `construction/code-generation.md` | Step 1 | Add a **Repo rules honoured** section to the plan, citing D-ids |

`knowledge/` gives the developer, architect and product agents a one-page Prior Auth
domain primer.

**Build and install.** Authoring tools need Bun 1.3.8+ (`npm i -g bun`). Run these
from the hub:

```powershell
$P = "<course>\runbook\practice\extensions\prior-auth-pack"
bun .claude\tools\aidlc-plugin-validate.ts $P
bun .claude\tools\aidlc-plugin-build.ts $P claude "D:\aidlc-practice\plugins\prior-auth-pack\claude"
bun .claude\tools\aidlc-plugin-build.ts $P codex  "D:\aidlc-practice\plugins\prior-auth-pack\codex"
```

Then install the plugin.

Claude Code:

```powershell
claude plugin marketplace add D:\aidlc-practice\plugins\prior-auth-pack\claude --scope project
claude plugin install aidlc-prior-auth-pack@aidlc-plugins --scope project
aidlc engine plugin sync     # or just start a new Claude session; its SessionStart hook composes
aidlc engine plugin list     # prior-auth-pack  0.1.0  0.1.0  current
```

Codex CLI (0.162) needs one extra step. It reads a marketplace from
`.agents/plugins/marketplace.json`, but AWS's builder writes `.codex-plugin/marketplace.json`.
So wrap the build output in a small marketplace folder:

```powershell
$M = "D:\aidlc-practice\plugins\codex-marketplace"
New-Item -ItemType Directory "$M\.agents\plugins" -Force | Out-Null
Copy-Item -Recurse D:\aidlc-practice\plugins\prior-auth-pack\codex "$M\prior-auth-pack"
$m = Get-Content "$M\prior-auth-pack\.codex-plugin\marketplace.json" -Raw | ConvertFrom-Json
$m.plugins[0].source = @{ source = "local"; path = "./prior-auth-pack" }
$m | ConvertTo-Json -Depth 5 | Set-Content "$M\.agents\plugins\marketplace.json"

codex plugin marketplace add $M
codex plugin add aidlc-prior-auth-pack@aidlc-plugins
$env:AIDLC_HARNESS_DIR = ".codex"; $env:AIDLC_HARNESS_NAME = "codex"
aidlc engine plugin sync     # or start Codex and trust the plugin's hook in /hooks
aidlc engine plugin list     # prior-auth-pack  0.1.0  0.1.0  current
```

Without that step, `codex plugin marketplace add` fails with "marketplace root does not
contain a supported manifest".

**See it work.** Search the composed stage files for the plugin name:

```powershell
Select-String -Path .claude\aidlc-common\stages\*\*.md -Pattern "prior-auth-pack" | Select-Object -First 5
```

Each splice is wrapped in a `<!-- plugin:prior-auth-pack:... -->` sentinel with a content
hash, so re-composing never duplicates it. After `aidlc update`, run
`aidlc engine plugin sync` again.

> **Snag (2.11.0, Windows).** `aidlc engine plugin validate` from the packaged binary
> fails with "does not resolve to a core stage slug" and "compose-hook template is
> unavailable". It looks for its data inside the binary. Run the `.ts` tools with Bun
> as above instead.

### 2. Skills: `aidlc-coach`, `repo-plan-reviewer`, `rally-draft`

The same `SKILL.md` files work on both engines; only the folder differs.

```powershell
$X = "<course>\runbook\practice\extensions"
# Claude Code
Copy-Item -Recurse "$X\skills\aidlc-coach","$X\skills\rally-draft" .claude\skills\
Copy-Item "$X\claude\agents\repo-plan-reviewer.md" .claude\agents\
# Codex CLI (skills live in .agents/skills/)
New-Item -ItemType Directory .agents\skills -Force | Out-Null
Copy-Item -Recurse "$X\skills\aidlc-coach","$X\skills\rally-draft","$X\skills\repo-plan-reviewer" .agents\skills\
# The Rally template the rally-draft skill looks for
New-Item -ItemType Directory tracking\rally -Force | Out-Null
Copy-Item "<course>\runbook\practice\rally\rally-import-template.csv" tracking\rally\
```

How to use them:

- `/aidlc-coach` / `$aidlc-coach`: at any question file or gate. It reads `aidlc-state.md`
  and explains the stage. It never answers for you.
- `repo-plan-reviewer`: before every code-generation plan gate in step 08.
  - Claude: "Use the repo-plan-reviewer agent on the open code-generation plan."
  - Codex: `$repo-plan-reviewer`
- `/rally-draft` / `$rally-draft`: after step 07. It has `disable-model-invocation`, so
  it runs only when you type it.

The plan reviewer is a **subagent** on Claude Code. It runs in its own context with only
`Read, Grep, Glob`, so it physically cannot edit the plan it reviews. On Codex it is a
skill with the same prompt, and read-only is an instruction, not a tool limit.

### 3. The decision-log guard (Claude Code)

```powershell
New-Item -ItemType Directory .claude\kit-hooks -Force | Out-Null
Copy-Item "$X\claude\hooks\guard-decisions.ps1" .claude\kit-hooks\
Copy-Item "$X\claude\settings.local.json.example" .claude\settings.local.json   # merge by hand if you already have one
```

Restart Claude Code. Whenever the engine tries to Edit or Write any
`prior-auth-*\docs\decisions.md`, you get a permission prompt with the reason. It
returns **ask**, not deny, because step 10 legitimately appends decisions.

Why `settings.local.json`? `aidlc config` owns `.claude/settings.json` and refreshes it on
upgrade. Your local file is never touched.

**Limit:** the hook watches the Edit and Write tools. A shell command that rewrites the
file would get past it. The plugin's code-generation overlay and the repo steering cover
that case by instruction, and you cover it at the gate.

**Codex:** AI-DLC trusts its own Codex hooks through `/hooks`, but this kit doesn't ship a
Codex version of this guard. On Codex the same protection comes from the repo steering
(`AGENTS.md`), the plugin overlay, and your review at the plan gate.
