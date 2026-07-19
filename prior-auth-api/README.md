# prior-auth-api — the AI-DLC practice repo

This is the repo the course's labs mean when they say `cd prior-auth-api`. It is small on
purpose: you should be able to read all of `src/` in one sitting. It is real: it installs,
it typechecks, and its tests pass.

```bash
npm install
npm test          # 4 passing
npm run typecheck # clean
```

It is seeded at the state **just before** the hello-world bolt. Nothing here is a mock —
the gap the bolt closes is a real gap in this code, and you can run the bolt yourself and
watch it close.

---

## What you actually install (and the thing everyone gets wrong)

**There is no npm package for AI-DLC.** Not `ai-dlc`, not `aws-ai-dlc` — check the registry
yourself, they don't exist. This trips up almost everyone, so it is worth being blunt:

> **AI-DLC is a methodology, not a runtime.** You never install it. You install an *engine*,
> and AI-DLC is the set of files and rituals you point that engine at.

There are two kinds of dependency in play, and they have nothing to do with each other:

| | What | Why |
|---|---|---|
| **This repo's devDependencies** | `typescript`, `jest`, `ts-jest`, `@types/jest` | Ordinary app tooling. Nothing to do with AI-DLC. A Python shop would have pytest here and the method would be identical. |
| **An engine** (install one, globally) | `@anthropic-ai/claude-code` **or** `@openai/codex` | This is the thing that actually reads files, writes code, and runs commands. |

```bash
# Claude Code
npm install -g @anthropic-ai/claude-code   # then: claude

# or Codex CLI
npm install -g @openai/codex               # then: codex
```

And AI-DLC itself? It's the plain files already sitting in this repo — no install step:

```
CLAUDE.md / AGENTS.md   the steering file .... the rules, read before your first prompt
docs/decisions.md       context memory ....... what humans decided, and why
docs/units/             units of work ........ one unit = one bolt = one session
npm test / typecheck    the gates ............ what "done" is allowed to mean
```

That's the whole runtime. The methodology is a way of arranging text files and human
attention around an engine that can already read and write.

---

## How an approved plan becomes code

The other question everyone asks: you approve a plan — then *what*? How does agreement turn
into a diff?

There is no magic and no compilation step. The engine is a loop around a model that has
**tools**: read a file, write a file, edit a file, run a shell command. "The plan" is just
text the model produced. Approving it doesn't hand it to an interpreter — it releases the
model to start calling the write and shell tools.

```
you type intent
   → model reads CLAUDE.md + the files it needs        [read tool]
   → model emits a plan as plain text                   (nothing has changed on disk yet)
   → ⏸  YOU APPROVE  ────────────────────────────────── the gate
   → model calls the edit tool on src/…                [your files change here]
   → model calls the shell tool: `npm test`            [your gates run here]
   → model reads the output, fixes, repeats
   → model presents the diff
   → ⏸  YOU REVIEW
```

So "the AI wrote the code" means literally: **the model called a write tool with a string,
and your filesystem changed.** That is why reading every line is not ceremony.

**What makes the gate real** is the engine's permission system, not the methodology — and
this is the sharpest difference between the two engines:

- **Claude Code — mechanical.** Plan mode (`shift+tab`, or `--permission-mode plan`) makes
  the write tools *unavailable* to the model. It cannot edit your files before you approve,
  even if it decides it should. The gate is enforced by the tool layer.
- **Codex CLI — contractual.** You instruct it to plan first and stop, and it complies
  because it was told to. The gate is enforced by the instruction and by your review.

Same bolt, same artifacts, different enforcement. Mechanical beats contractual when the
stakes are clinical — which is why M15 and Track 5 spend real time on this.

---

## Run the hello-world bolt yourself

**The gap:** `AuthStatus.PENDING` is the only waiting state, so a request parked for a nurse
and a request parked for anything else look identical in the queue. Nurses can't tell what's
theirs. Open `src/determination/auth-status.enum.ts` — the comment says so.

**The decision waiting for you:** `docs/decisions.md` has an "Open — not yet decided" section
with exactly one entry. An engine that reads this repo honestly must stop and ask you about
it rather than guess.

### Claude Code

```bash
cd prior-auth-api
claude
```

```text
> Nurses open the queue every morning and can't tell which auth requests
> are actually waiting on them.
>
> Plan first — numbered steps, files you'll touch and files you won't.
> STOP for my approval before writing anything.
> Read docs/decisions.md before you propose rules, and ask me about
> anything in the "not yet decided" section instead of guessing.
> After approval: tests first, then code. Run `npm test` and
> `npm run typecheck` yourself and show me the real output.
> End by recording any decision I make in docs/decisions.md, with my
> reasoning and my name, and cite it from the code.
```

Press `shift+tab` first if you want plan mode to make the approval gate mechanical rather
than contractual. Then watch for the moment it stops and asks about the re-score case —
that moment is the entire method.

### Codex CLI

```bash
cd prior-auth-api
codex
```

Use the same prompt verbatim. The wording of its plan will differ; the artifacts should not.

### What you should end up with

- `PENDING_NURSE_REVIEW` on `AuthStatus`, and below-threshold requests routed to it
- a new test for the re-score rule **you** chose — the engine should not have picked one
- `docs/decisions.md` gaining a D-004 with your reasoning, and the "Open" entry cleared
- `npm test` green, with the output shown to you rather than asserted

If the engine sailed past the re-score question and just picked one — that's the AI-managed
anti-pattern happening to you live, and it's worth sitting with. Tell it so, and watch what
a steering file is actually for.

### After your attempt: the worked answer

A complete run of this bolt — the deferred question, the failing-first tests, D-004 with
its reasoning, the steering diff — lives on the
[`answers/hello-world-bolt`](https://github.com/varasrinivas/ai-dlc-course/tree/answers/hello-world-bolt/prior-auth-api)
branch ([full diff](https://github.com/varasrinivas/ai-dlc-course/compare/main...answers/hello-world-bolt)).
Diff your attempt against it *after* you've run your own — reading the answer first defeats
the bolt. Your D-004 may legitimately differ: what matters is that it was decided by a
human and recorded with its why.

---

## Layout

```
AGENTS.md                 the steering file — the rules. Codex reads this by name.
CLAUDE.md                 Claude Code's entry point: imports @AGENTS.md + @docs/decisions.md
docs/decisions.md         context memory: decisions + reasoning + who decided
docs/units/               units of work; one unit = one bolt = one session
src/domain/               Member, Provider, AuthRequest, ClinicalCriteria + the threshold
src/determination/        AuthStatus, Determination, the service, its spec
```

Tests are colocated as `*.spec.ts` next to the unit under test.

---

## Who writes the memory files, and how they become memory

Two questions people ask in this order, and the second one is where the real
misunderstanding lives.

### Who writes them

**The engine writes them. You supply what goes in.** You never hand-type a decision record.
At the end of a bolt you say "record that decision with my reasoning", the model calls its
edit tool, and `docs/decisions.md` gains an entry. Same for `docs/units/`: the engine drafts
the unit of work during Inception and the team validates it in Mob Elaboration.

That's the AI-DLC split exactly. The AI does the volume — the writing, the formatting, the
cross-referencing. You do the part that can't be derived: **the decision itself and the
reasoning behind it.** It's transcribing your judgement, not forming it.

They're reviewed like any other artifact, which is why they are plain Markdown in git and
not a database. A decision record that isn't in a diff isn't reviewed, and a decision nobody
reviewed isn't a decision — it's an assumption with a timestamp.

### How they become memory

Here is the part that trips everyone up:

> **Writing a file does not make it memory. A file on disk is not in the model's context.**

"Context memory" is not a feature you switch on. It's a file *plus a mechanism that loads
it*. For Claude Code there are exactly three tiers, and it's worth knowing which one you're
relying on:

| Tier | What | When it loads |
|---|---|---|
| **Automatic** | `CLAUDE.md` in the project root, in any ancestor directory, and `~/.claude/CLAUDE.md`; plus `.claude/rules/` | Eagerly, in full, at launch — before your first prompt |
| **Imported** | Any file named with `@path` inside `CLAUDE.md` — recursive to 4 hops, ignored inside code fences | Eagerly at launch, alongside the file that imports it |
| **Everything else** | `docs/decisions.md`, `docs/units/`, all your source | **Not in context at all** until something reads it: the model calling the Read tool (usually because an instruction told it to), a grep, you `@`-mentioning it, a hook, or a skill |

Subdirectory `CLAUDE.md` files are a special case: they load lazily, only when the engine
touches files in that directory.

So which tier is this repo's decision log in? Look at `CLAUDE.md` — it's tier 2, on purpose:

```
@AGENTS.md
@docs/decisions.md
```

`AGENTS.md` *asks* the engine to read the decision log before touching a rule. That's tier 3,
and an instruction is a request — skippable when context gets long or a prompt gets
insistent. The `@` import makes it **mechanical**: the log is in context before the session
starts, and nothing has to remember to fetch it.

That's the same distinction as plan mode — **mechanical beats contractual** — and it's why
`AGENTS.md` and `CLAUDE.md` are split the way they are rather than duplicated. Claude Code
does not read `AGENTS.md` at all; the import is what lets one file steer both engines
without drift. (A symlink would also work, but needs Admin or Developer Mode on Windows,
which is why the docs recommend the import.)

Codex CLI has no import mechanism — it concatenates `AGENTS.md` files from the git root down.
So for Codex the decision log stays contractual. Same intent, weaker guarantee.

**The cost is real:** an import spends those tokens every session whether the decisions turn
out to be relevant or not. It's worth it here because the log is short and load-bearing.
When a decision log outgrows its tokens, import a short index and let the engine read full
entries on demand. Making that call is what "semantics per token" means in practice.

**Don't take any of this on faith:** run `/context` in a session to see what's actually
loaded, and `/memory` to see which memory files are configured. If you're unsure whether the
decision log made it in — look, don't assume.
