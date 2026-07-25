# Setup — run the companion repos

> Standalone copy of course page **P01 · Setup: run the companion repos** (Track 0).
> Same content as the in-course page; keep the two in sync.

Every lab in this course says `cd prior-auth-api` or `cd prior-auth-web` as if those folders are
already on your machine with their tests green. This page is what makes that true. It takes you
from a clean laptop to two installed repos, four commands whose **real output is printed below**,
and an engine that can already recite the Prior Auth domain rules back to you.

Nothing here is a mock. If your terminal doesn't match the output on this page, something is
genuinely wrong — the fix is probably in [When it doesn't work](#when-it-doesnt-work).

---

## What you install — and the thing everyone gets wrong

**There is no package for AI-DLC.** Not `ai-dlc`, not `aws-ai-dlc` — check the registry yourself,
they don't exist. AI-DLC is a *methodology, not a runtime*. You never install it. You install an
**engine**, and AI-DLC is the set of plain files and rituals you point that engine at.

Three layers are in play, and they have almost nothing to do with each other:

| Layer | What you actually do | Why |
|---|---|---|
| **The methodology** | **Nothing.** It's already in the repos: `CLAUDE.md`, `AGENTS.md`, `docs/decisions.md`, `docs/units/` | Text files plus human attention. No install step, no daemon. |
| **An engine** (pick one, global) | `npm i -g @anthropic-ai/claude-code` **or** `npm i -g @openai/codex` | The thing that reads files, writes code, and runs your commands. |
| **Each repo's own tooling** | `npm install` inside `prior-auth-api` **and** inside `prior-auth-web` | Ordinary app deps — TypeScript, Jest, Vite, Vitest. A Python shop would have pytest here and the method would be identical. |

> **No AWS account is required.** AI-DLC is AWS's open-source methodology, not an AWS service.
> Nothing in these repos calls a cloud API, a database, or a network endpoint at runtime — the
> whole course runs offline apart from installing packages and talking to your engine.

---

## Prerequisites

Check each before you clone. The right-hand column is what the machine this course was built on
prints; your patch versions will differ, the shape should not.

| You need | Check it | Known-good output |
|---|---|---|
| Node.js 20 LTS or newer | `node -v` | `v22.14.0` |
| npm 10 or newer | `npm -v` | `11.2.0` |
| Git | `git --version` | `git version 2.4x.x` |
| One engine on your PATH | `claude --version` / `codex --version` | a version string, not "not recognized" |
| A terminal | PowerShell on Windows; any shell elsewhere | every command here is copy-paste safe in PowerShell |
| Disk | ~400 MB for both `node_modules` | no Docker, no database, no service to start |

---

## Step 1 — clone, and land in the right folder

```powershell
git clone https://github.com/varasrinivas/ai-dlc-course.git
cd ai-dlc-course
```

What you should see at the root:

```
ai-dlc-course/
  course/index.html      <- the course; open it in a browser
  labs/                  <- standalone copy of every lab
  prior-auth-api/        <- companion repo 1: TypeScript + Jest
  prior-auth-web/        <- companion repo 2: React + Vite + Vitest
```

Every lab's `cd prior-auth-api` is relative to this folder. The two repos install **separately** —
each has its own `package.json` and lockfile. `npm install` at the root does nothing useful.

---

## Step 2 — `prior-auth-api`: install, test, typecheck

```powershell
cd prior-auth-api
npm install
npm test
```

Expected output — a real run, not an illustration:

```
> prior-auth-api@0.1.0 test
> jest

PASS src/determination/determination.service.spec.ts (6.266 s)
  DeterminationService
    √ auto_approves_above_threshold (3 ms)
    √ auto_approves_exactly_at_threshold
    √ routes_below_threshold_to_pending
    √ denies_when_member_ineligible_whatever_the_score (1 ms)

Test Suites: 1 passed, 1 total
Tests:       4 passed, 4 total
Snapshots:   0 total
Time:        8.411 s
Ran all test suites.
```

Read the test names, not just the green. They are the domain rules written as executable
statements: at-or-above `AUTO_APPROVE_THRESHOLD (0.85)` auto-approves, below it routes to the
nurse review queue, and an ineligible member is never auto-approved whatever the score. When an
engine breaks one of these in a later bolt, this is the thing that notices.

```powershell
npm run typecheck
```

```
> prior-auth-api@0.1.0 typecheck
> tsc --noEmit
```

**That's the entire output.** `tsc --noEmit` prints nothing when the project is clean — silence is
the pass. File paths and `error TS…` lines mean the gate is red.

---

## Step 3 — `prior-auth-web`: install, test, typecheck, run

```powershell
cd ..\prior-auth-web
npm install
npm test
```

```
> prior-auth-web@0.1.0 test
> vitest run

 RUN  v2.1.9  …/prior-auth-web

 ✓ src/components/AuthQueue.test.tsx (5 tests) 89ms

 Test Files  1 passed (1)
      Tests  5 passed (5)
   Duration  21.25s (transform 109ms, setup 3.11s, collect 2.04s, tests 89ms,
                     environment 15.04s, prepare 536ms)
```

Twenty seconds is normal on the first run — most of it is jsdom booting a fake browser. Later runs
are faster. `npm run typecheck` behaves exactly as in the API repo: two banner lines, nothing else.

```powershell
npm run dev
```

```
> prior-auth-web@0.1.0 dev
> vite

  VITE v5.4.21  ready in 534 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Open <http://localhost:5173/>. You should see a heading **Authorization queue** and five rows —
`PA-AR-5001` through `PA-AR-5005` — each with a procedure code, a submitted date, and a status
badge. `Ctrl+C` stops the server.

> **The thing that looks like a bug is the seed.** Rows 5001 and 5004 are `PENDING_NURSE_REVIEW`
> in the data, but on screen they read **Pending** in the same amber as row 5002's plain
> `PENDING`. A nurse still can't tell which rows are theirs. That gap is deliberate, a test
> asserts it on purpose (`renders_nurse_review_identically_to_pending_TODAY`), and closing it is
> the web repo's hello-world bolt. Don't "fix" it now.

---

## Step 4 — prove the engine can see the repo

Installing an engine isn't the same as steering one. This check confirms the steering file is
actually reaching the model — which is the entire point of the setup. Run it from inside
`prior-auth-api`.

### Claude Code

```powershell
# Claude Code
npm install -g @anthropic-ai/claude-code
cd prior-auth-api
claude
```

```text
> Read CLAUDE.md. Restate the auto-approval rule, list the six domain
> entities, and tell me what is still undecided in docs/decisions.md.
> Plan only — write nothing.
```

**Expected:** it states the threshold as *at or above* 0.85, names `AuthRequest`, `Member`,
`Provider`, `ClinicalCriteria`, `Determination`, `AuthStatus`, points at the one open entry in the
decision log, and creates no files. Run `/context` to see what actually loaded — `CLAUDE.md`
imports `@AGENTS.md` and `@docs/decisions.md`, so all three should be in context before your first
prompt.

### Codex CLI

```powershell
# Codex CLI
npm install -g @openai/codex
cd prior-auth-api
codex
```

Use the same prompt, with `AGENTS.md` in place of `CLAUDE.md`.

**Expected:** the same answer in different words. Codex concatenates `AGENTS.md` from the git root
down and has no import mechanism, so the decision log reaches it only because the steering file
*asks* it to read the file. Same intent, weaker guarantee — that difference is Track 5's subject.

---

## You're ready when all of this is true

| Check | Command | Pass looks like |
|---|---|---|
| Node new enough | `node -v` | v20 or higher |
| API tests | `npm test` in `prior-auth-api` | **4 passed, 4 total** |
| API types | `npm run typecheck` | two banner lines, no errors |
| Web tests | `npm test` in `prior-auth-web` | **5 passed (5)** |
| Web types | `npm run typecheck` | two banner lines, no errors |
| Web runs | `npm run dev` | queue with 5 rows at `localhost:5173` |
| Engine steered | `claude` / `codex` | restates the 0.85 rule without being told it |

Seven green checks and you can start any lab in this course — including the hello-world bolt in
each repo's `README.md`, the fastest way to feel the method before M01.

---

## When it doesn't work

| What you see | What it means | Fix |
|---|---|---|
| `npm : cannot be loaded because running scripts is disabled` | PowerShell execution policy blocks `npm.ps1` | `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`, reopen the terminal — or call `npm.cmd` |
| `npm error Missing script: "test"` | You're in the kit root, not in a repo | `cd prior-auth-api` (or `prior-auth-web`) first — each repo installs and runs on its own |
| `Cannot find module` / `jest is not recognized` | `npm install` never ran *in that repo* | Run it in the repo folder; two lockfiles means two installs |
| `Port 5173 is in use` | An old dev server is still running | `npm run dev -- --port 5174`, or close the other terminal |
| Vitest hangs on the first run | jsdom environment boot — ~15 s of the 21 s | Wait it out once; it's cached afterwards |
| `claude` / `codex` not recognized | npm's global bin isn't on PATH | `npm prefix -g`, add that folder to PATH, reopen the terminal |
| `error TS…` on a repo you haven't touched | Node or TypeScript far off the tested versions | Node 20 LTS or newer; `git status` to confirm you have no stray edits |
| Tests fail after an engine ran | Working as intended — the gate caught it | Read the diff. `git restore .` and `git clean -fd` return either repo to its seeded state (**this discards your bolt**) |

> **Install the engine, then leave the gates alone.** Every lab from here on tells the engine to
> run `npm test` and `npm run typecheck` itself and show you the real output. That only works if
> those two commands are green before the engine starts — which is the only reason this page
> exists.

---

## What's next

- Course page **P00 — Prelude: You're the Tech Lead Now** if you haven't read it.
- **M00 — Course Orientation** for the two paths and the domain.
- The hello-world bolt in `prior-auth-api/README.md`, then `prior-auth-web/README.md`. Worked
  answers live on the `answers/hello-world-bolt` and `answers/web-hello-world-bolt` branches —
  attempt first.
