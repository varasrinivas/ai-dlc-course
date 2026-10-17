# Lab M40 — Open a second intent across both repos

> Module: M40 — Multi-repo Intents and Teams on the Engine
> Audience: both · Estimated time: 30 min reading · about 30 min with the engine
> Domain: Prior Auth Portal (`AuthRequest`, `AuthQueue`, `AUTO_APPROVE_THRESHOLD`; repos
> `prior-auth-api` and `prior-auth-web`)
> Verified against aidlc v2.11.0 (Claude Code 2.1.301) on 2026-10-18. Every excerpt is from a real
> run in the reference hub (`D:\aidlc-track8\prior-auth-workspace`, record commit `693c259`): a new
> intent started beside the one M39 parked, plus one line from M38's run. Every answer and approval
> was typed by the course author acting as the portal team. Codex wasn't run for this edition; it
> reads the same stage files.

## Path A — Understand It (no tooling required)

**Artifact:** `runbook/multi-repo-feature.html` (open it beside the module), plus three excerpts from
the reference run.

The intent registry after the second intent (`aidlc/spaces/default/intents/intents.json`, trimmed):

```text
{ "slug": "criteria-rescore", "scope": "feature",
  "repos": [ "prior-auth-api", "prior-auth-web" ], "status": "in-flight" },
{ "slug": "urgent-determination-clo", "scope": "classic",
  "repos": [ "prior-auth-api", "prior-auth-web" ], "status": "in-flight" }
```

The freshness verdicts, and the question they produced for the API:

```text
STALE: the analyzed paths have changed since the store was built (intent: criteria-rescore):
CURRENT: the analyzed paths are unchanged since the store was built (intent: criteria-rescore, coverage: full):

## Q1: Code knowledge base for prior-auth-api
A. Full rescan — rebuild the whole store for the repo (replaces all 9 documents)
B. Focused scan — scan the area this work touches (AuthRequest, the determination clock, the nurse review queue ordering) and extend the store, keeping earlier content outside it
X. Other (please specify)

[Answer]: A — Full rescan. U1 added storage, intake and an HTTP layer to the API, so the whole map has changed, not just the urgent-request area.
```

**Trace it:**
1. In the runbook's "Where does every file go?" explorer, pick the Requirements gate and note where
   its files land: hub or repo.
2. Read `intents.json`. Which repos can each intent change?
3. Read the two verdicts. Which repo was rescanned, which was reused, and why?
4. Find who decided the rescan: the verdict line, or the `[Answer]:` line?

**Lead It (leaders):** the director wants the API team and the web team each to own their part of the
urgent-auth change in this hub. Write a half-page decision: who approves which plans and checkpoints,
who owns the contract, who moves which Rally card at which gate, and who decides the release order.
Use the module's last section ("Rally as a mirror, and what stays human") as the checklist.

**Check yourself:**
1. The web team wants to add `prior-auth-web` to an intent created with `--repos prior-auth-api`. What
   do they do in v2.11.0?
2. Why was the web map reused and the API map rebuilt? What would have made the web map stale?
3. Can the API team and the web team each own and approve their unit in this hub through the engine's
   team mode? What can they own?
4. A Rally story moves to Accepted before the engine's gate. What changed in the engine?

<details><summary>Answers</summary>

1. They can't add it: an intent's repos are fixed at creation, and v2.11.0 has no command for it.
   They start another intent that records both repos (name them with `--repos`, or let sibling
   auto-discovery record every sibling).
2. The web code was unchanged since the re-score scan (`CURRENT`); U1 had changed the API's analysed
   paths (`STALE`). Any change under the web's analysed paths would have made it stale. The verdict is
   the engine's; the reuse-or-rescan choice was the team's.
3. Not through team mode: "intents with recorded sibling repos must remain solo." They own it as
   people: each team approves the plans and checkpoints for its repo's units, and they share the
   contract.
4. Nothing. The engine never reads Rally. Only the gate in the engine, recorded in the audit,
   approves.

</details>

## Path B — Build It with AI

> The unit of work: **a second intent in the same hub, the urgent-auth 72-hour clock, recording both
> repos, taken to Reverse Engineering, where the team decides per repo whether to reuse or rescan the
> code map; gate approved, parked, committed.** Start from your M39 hub. Open the engine interactively
> at the hub root (`claude` or `codex`). No code is written: the engine reads both repos, plans its
> scan and asks before it rebuilds anything. Your verdicts depend on your history: if you committed
> U1 and haven't changed the API since your last scan, it may come back `CURRENT`.

### Claude Code variant (steps 1–4)

```text
# Claude Code
# 1. state the intent, name both repos, and say it's new work
/aidlc Urgent auth requests get a 72-hour determination clock. An AuthRequest can be marked urgent; the API records when its determination is due and puts urgent requests first in the nurse review queue; the web queue shows an urgency badge and a countdown in AuthQueue. The 0.85 auto-approve rule and eligibility-first do not change. This touches prior-auth-api and prior-auth-web. This is a new intent; leave the parked re-score intent as it is.
# 2. at Reverse Engineering: read each repo's verdict, fill the questions file together
> Q1: <your choice>, Q2: <your choice>
# 3. at the gate
> Approve. Then park.
# 4. later, to go back to the re-score intent
/aidlc intent criteria-rescore
/aidlc --resume
```

Expected, from the reference run (excerpts):

```text
# 1.
Intent created: 261017-urgent-determination-clo (space: default)
State initialized: classic scope, 18 stages, Standard depth
Project type: Brownfield
First post-init stage: reverse-engineering (INCEPTION)

# 2.
Q1: Code documentation for prior-auth-api. I documented this repo during the re-score work,
but the API code has changed since then. How should I scan it?
[...]
Q2: Code documentation for prior-auth-web. The web documentation is up to date and covers
the whole repo, including AuthQueue. Reuse it or rescan?

# 3.
I've approved Reverse Engineering and paused the urgent-clock work. Everything is saved,
and it will pick up at Practices Discovery.
```

What else happened in the reference run, in order:
- **Routing.** The engine asked whether the request was part of the re-score work, a separate piece of
  work, or a reshape of it. The request already said "new intent", so the agent chose separate work,
  and also took the composer's suggested scope, `classic`, without a separate question. Name the
  scope in your request if your team wants that choice (M37).
- **Drift on the other intent.** On this fresh session the engine reported the parked re-score
  intent as drifted, because of M39's hand edit to its decision log: "decision-log.md changed after
  Approval & Handoff finished. I'm carrying on with it as it is. Do you want me to redo Approval &
  Handoff with your change instead?" Nothing was redone.
- **Shared memory.** The new intent's state reads `Guard Policy: strict (from project.md)`: the
  space's memory, including M39's no-autonomy rule, applies to every intent in it.
- **The rebuilt API map** found no nurse review queue endpoint (`GET /v1/auth-requests` returns 404),
  nowhere to record urgency, an intake that rejects unknown fields, and times that don't sort across
  time-zone offsets, and left three questions for Requirements.

**Expected artifact:** a second row in `intents.json` recording both repos; the new intent folder
with its `reverse-engineering-questions.md` answered; `codekb/<repo>/` reused or rebuilt per your
answers (nine files each); the intent parked at `practices-discovery`.
**Verify:** step 5, then the checks under "Done when".

### Codex CLI variant (steps 1–4)

```text
# Codex CLI
# 1. state the intent, name both repos, and say it's new work
$aidlc Urgent auth requests get a 72-hour determination clock. An AuthRequest can be marked urgent; the API records when its determination is due and puts urgent requests first in the nurse review queue; the web queue shows an urgency badge and a countdown in AuthQueue. The 0.85 auto-approve rule and eligibility-first do not change. This touches prior-auth-api and prior-auth-web. This is a new intent; leave the parked re-score intent as it is.
# 2. at Reverse Engineering: read each repo's verdict, fill the questions file together
> Q1: <your choice>, Q2: <your choice>
# 3. at the gate
> Approve. Then park.
# 4. later, to go back to the re-score intent
$aidlc intent criteria-rescore
$aidlc --resume
```

Codex wasn't run for this edition, so there's no expected output to compare against. What must match
is the shape: an intent row recording both repos, a verdict per repo before any scan, a question for
each, and a gate in your words.

**Expected artifact:** the same as the Claude Code variant.
**Verify:** step 5, then the checks under "Done when".

### Step 5 (both engines): commit

```powershell
git add aidlc; git commit -m "intent: urgent clock created across both repos; codekb checked per repo; parked"
Get-Content aidlc\spaces\default\intents\intents.json
```

In the reference run, `git status --short` before the commit showed the nine rebuilt API files, the
registry, and the new intent folder:

```text
 M aidlc/spaces/default/codekb/prior-auth-api/api-documentation.md
[...]
 M aidlc/spaces/default/intents/intents.json
?? aidlc/spaces/default/intents/261017-urgent-determination-clo/
```

**Parity note:** the intent registry, the per-repo freshness check, the questions file and the
`codekb/` layout come from the engine's tools and stage files, not from either harness, so both
variants land on the same files under `aidlc/spaces/default/`. The wording of the questions and of
the scan findings varies from run to run and from engine to engine. The reuse-or-rescan answers and
the gate are the team's either way.

## Done when

Checks, from the hub root (PowerShell). Your new intent's folder name starts with your own date:

```powershell
$reg = Get-Content aidlc\spaces\default\intents\intents.json -Raw | ConvertFrom-Json
$reg.Count                                                   # 2
$reg | ForEach-Object { "$($_.slug): $($_.repos -join ', ')" }  # both rows list prior-auth-api, prior-auth-web
$i = "aidlc\spaces\default\intents\$($reg[-1].dirName)"
(Select-String -Path "$i\audit\*.md" -Pattern 'GATE_APPROVED').Count                                        # 1
(Select-String -Path "$i\inception\reverse-engineering\reverse-engineering-questions.md" -Pattern '^\[Answer\]: \S').Count  # 2, one per repo
(Get-ChildItem aidlc\spaces\default\codekb -Recurse -Filter *.md).Count                                    # 18
```

- [ ] `intents.json` holds two intents, each recording both repos.
- [ ] The new intent's questions file holds the team's answer for each repo.
- [ ] The audit shows its Reverse Engineering `GATE_APPROVED`.
- [ ] `codekb/` still holds nine files per repo.
- [ ] The hub commit holds it all. That's the end of the engine track: the next step is your own
      team's first intent.
