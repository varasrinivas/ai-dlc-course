# /build-lab — Write the standalone lab file for a built module

Argument: a module ID (e.g. `M05`). Referred to below as $ARGUMENTS.

## Preconditions

- The module exists in `course/index.html`. If not, stop and point the human to `/build-module`.

## Steps

1. Read the module's in-player lab section and `templates/lab-template.md`.
2. Write `labs/$ARGUMENTS-lab.md` following the template:
   - Title, module reference, estimated time, audience tag
   - **Path A — Understand It**: the artifact (inline or referenced), trace steps, 3 check
     questions with answers in a collapsed `<details>` block
   - **Path B — Build It with AI** (or **Lead It** for leader modules):
     - *Claude Code variant*: exact prompt(s)/commands, expected artifact, verification step
     - *Codex CLI variant*: exact prompt(s)/commands, expected artifact, verification step
     - A parity note confirming both variants produce the same artifact
   - **Done when** — observable completion criteria
3. Consistency gate: the standalone lab and the in-player lab must describe the same steps and
   artifacts. If they diverge, fix the standalone file to match the player (the player is the
   source of truth) and note the fix.
4. Report the file path and remind the human to run `/validate-module $ARGUMENTS`.

## Rules

- Prior Auth Portal domain only. Engine commands must be Windows/PowerShell-safe.
- Prompts shown to learners must themselves model AI-DLC: they state intent, ask the engine to
  plan first, and include a human checkpoint before code is written.
