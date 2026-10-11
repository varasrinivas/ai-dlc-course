# Run it yourself: the multi-repo AI-DLC practice kit

The [multi-repo runbook](../multi-repo-feature.html) *describes* one Prior Auth feature
going through AWS AI-DLC v2: urgent requests get a 72-hour clock, across three repos.
This kit is how you **do** it, on your own machine, with Claude Code or Codex CLI.

There is no grading script. The point is to watch the method work:

- the engine asking instead of guessing;
- a reviewer agent finding gaps before you do;
- a plan gate that stops code until a human says yes;
- your answers in step 02 turning up, three stages later, in requirements and code.

## What you'll learn

By the end you will have:

- built a v2 **workspace**: a hub that holds the AI-DLC record, with code repos beside it;
- run all **five phases** and **33 stages** at enterprise scope, answering question files
  and passing human gates;
- seen how **steering files**, the hub's `memory/`, and an **AI-DLC plugin** keep an engine
  inside each repo's recorded rules;
- generated code into **two brownfield repos and one greenfield repo**, against a
  versioned contract, in two **bolts**;
- copied the feature's decisions back into each repo so they outlive the feature.

## Before you start

| You need | Check it | Notes |
|---|---|---|
| Windows 10/11 x64 | — | The `aidlc` binary is x64 only |
| Git | `git --version` | Set `user.name` and `user.email` |
| Node.js 20+ | `node -v` | The companion repos' tests |
| An engine | `claude --version` and/or `codex --version` | Codex must be 0.145.0+ |
| Engine sign-in | `claude` / `codex login` | A Claude subscription or API key; an OpenAI login for Codex |
| AWS AI-DLC CLI | `aidlc --version` | Installed in step 01. **No AWS account needed** |
| Bun 1.3.8+ (optional) | `bun --version` | Only to build the plugin in `extensions/` |

**Time and cost.** Enterprise scope is thorough: each stage asks questions, confirms a
summary, runs an AI review, and waits at a gate. Plan on a day, in sittings. The reference
run's engine usage is in [`reference-run/RUN-NOTES.md`](reference-run/RUN-NOTES.md). For a
faster first pass, use `--scope feature`: the same 33 stages at standard depth.

## The path

| Step | Card | Runbook | Phase · stages | You'll learn |
|---|---|---|---|---|
| 01 | [Workspace](steps/01-workspace.md) | [§01](../multi-repo-feature.html#s1) | setup | The hub + sibling layout; what `aidlc config` installs |
| 02 | [Intent and scope](steps/02-intent-and-scope.md) | [§02](../multi-repo-feature.html#s2) | 0–1 · 0.1–1.7 | Question files, summaries, AI review, the gate |
| 03 | [Read the repos](steps/03-read-the-repos.md) | [§03](../multi-repo-feature.html#s3) | 2 · 2.1–2.2 | Reverse engineering into a reusable codekb |
| 04 | [Requirements](steps/04-requirements.md) | [§04](../multi-repo-feature.html#s4) | 2 · 2.3 | Mob Elaboration; settle ownership early |
| 05 | [Stories and Rally](steps/05-stories-and-rally.md) | [§05](../multi-repo-feature.html#s5) | 2 · 2.4–2.5 | A mob of agents; your tracker is a mirror |
| 06 | [Design, units, contract](steps/06-design-units-contract.md) | [§06](../multi-repo-feature.html#s6) | 2 · 2.6–2.8 | One unit = one repo; the contract's two forms |
| 07 | [Bolt plan](steps/07-bolt-plan.md) | [§07](../multi-repo-feature.html#s7) | 2 · 2.9 + check | Bolts, the walking skeleton, the phase check |
| 08 | [Construction](steps/08-construction.md) | [§08](../multi-repo-feature.html#s8) | 3 · 3.1–3.5 | Plan approval before code; code lands in the right repo |
| 09 | [Build and test](steps/09-build-and-test.md) | [§09](../multi-repo-feature.html#s9) | 3 · 3.6–3.7 | Testing across the repo boundary |
| 10 | [Operate and close](steps/10-operate-and-close.md) | [§10](../multi-repo-feature.html#s10) | 4 · 4.1–4.7 | Contract-order deploys; decisions outlive the feature |

Each card has the same parts:

1. **Goal**
2. **Who's in the room**
3. **Do it**, with Claude Code and Codex commands
4. **What you'll see**, quoted from the reference run
5. **Under the hood**, the files to open
6. **Before you say Approve**
7. **Try this**, one deliberate experiment
8. **Files written**
9. **Common snags**

## What's in this folder

```
practice/
  README.md                 this file
  steps/                    the ten step cards
  answers/
    mob-answer-sheet.md     who owns each decision, and what the reference run answered (and why)
  seed/
    prior-auth-notify/      the greenfield repo's starting point (steering + decision log, empty src/)
    repos.json              declares the three siblings with local urls (offline, no SSH keys)
    memory-project-steering.md   the "read each repo's rules first" block for the hub's method file
  rally/rally-import-template.csv
  extensions/               learning helpers: an AI-DLC plugin, skills, a subagent, a hook
  reference-run/            what one real run produced, to compare against after each step
```

## How to use the reference run

Do each step yourself first. Then open the same files in
[`reference-run/`](reference-run/) and compare. Your run *will* differ: the engine writes
new questions each time, and your answers steer everything after them. The useful
question is not "did I match?" but "where did we diverge, and which answer caused it?"
[`RUN-NOTES.md`](reference-run/RUN-NOTES.md) narrates the reference run gate by gate,
including where the engine surprised us.

## Source of truth

AWS facts are checked against **AI-DLC Workflows v2.11.0** (released 2026-10-08), the
latest stable release on 2026-10-11:
<https://github.com/awslabs/aidlc-workflows> and <https://awslabs.github.io/aidlc-workflows/>.

Not from AWS: the Rally mapping, the one-unit-per-repo rule, the steering pointer, the
ADR copy-over, and the helpers in `extensions/`. Those are this course's conventions, built
on AWS's documented extension points.
