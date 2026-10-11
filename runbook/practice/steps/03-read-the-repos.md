# Step 03 — Read every brownfield repo before anyone designs

> Runbook section: [03 · Read the repos](../../multi-repo-feature.html#s3) ·
> Phase 2 Inception · stages 2.1 Reverse Engineering, 2.2 Practices Discovery ·
> Time: 30–45 minutes

## Goal

Watch AI-DLC build **semantic context** for code it didn't write. Before any requirement is
written, the engine scans each existing repo. It writes nine documents per repo into a
store the *next* feature can reuse. You, as each repo's lead, check that the documents
describe the code that is actually there.

## Who's in the room

- **api lead:** checks `codekb/prior-auth-api/`.
- **web lead:** checks `codekb/prior-auth-web/`.
- **Tech lead:** approves the practices promoted into the method.

## Do it

Nothing new to type. After stage 1.7 is approved, the engine moves into Inception by
itself. If you closed the session, resume:

```text
# Claude Code
/aidlc
```

```text
# Codex CLI
$aidlc
```

At each gate: `Approve`, or `Request Changes: <what the scan got wrong>`.

## What you'll see

<!-- RUN-QUOTES:03 -->

## Under the hood

- **A two-step pipeline:** a *developer* agent scans the code, then an *architect* agent
  writes the documents. Watch for the `Task` / subagent calls in the transcript. On
  Claude Code, `/aidlc-replay` lists them after the fact.
- **Where it lands:** `aidlc/spaces/default/codekb/<repo>/`. That is the *space*, not the
  intent. A later feature that touches prior-auth-api finds this store and reuses it if
  the code hasn't moved.
- **prior-auth-notify gets no scan.** It's greenfield; there is nothing to read. Its
  practices come from the space memory and, later, the contract.
- **2.2 Practices Discovery** asks three inspector agents to review the draft
  practices independently: quality, developer, devsecops. After approval, the practices are
  **promoted** into `memory/team.md` and `memory/project.md`. Open `project.md` before and
  after; the diff is the lesson.

## Before you say Approve

Open each repo's `codekb` folder next to the code. For prior-auth-api:

- Does `business-overview.md` state the three recorded rules (D-001 `>=` 0.85,
  D-002 eligibility first, D-003 status and referenceId only)?
- Does `code-quality-assessment.md` mention the known gap? `AuthStatus.PENDING` is
  overloaded, and re-scoring after a determination is undecided.
- Does `api-documentation.md` describe an API that exists? Today prior-auth-api has
  **no HTTP layer**: services and entities only. A scan that invents endpoints is wrong.

For prior-auth-web:

- Does `api-documentation.md` say what the web app *calls*? Today it reads static sample
  rows (`src/data/sample.ts`) and calls nothing live. This is where contract drift between
  repos first shows up.

## Try this

Ask, before approving: `What did you NOT read in prior-auth-web, and why?`
The answer tells you how the scan bounded itself. Bounding the scan is a deliberate
token budget: AI-DLC's "semantics per token" idea.

## Files written

- For each scanned repo, in `aidlc/spaces/default/codekb/<repo>/`:
  - `business-overview.md`, `architecture.md`, `code-structure.md`
  - `api-documentation.md`, `component-inventory.md`, `technology-stack.md`
  - `dependencies.md`, `code-quality-assessment.md`, `reverse-engineering-timestamp.md`
- From 2.2: the practices draft in the intent's `inception/practices-discovery/`, promoted into `memory/team.md` and `memory/project.md`.

## Common snags

<!-- RUN-SNAGS:03 -->
