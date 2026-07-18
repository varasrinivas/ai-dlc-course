# Prior Auth Portal — API  (Claude Code entry point)

Claude Code loads this file in full at launch, before your first prompt. That position is
the whole trick: the session starts already knowing how this team builds, so steering
outranks conversation.

This file is deliberately thin. The rules live in `AGENTS.md`, and the two lines below pull
them in. **This is how "context memory" actually works** — a file on disk is not memory. A
file only becomes memory when something loads it.

## The shared steering file

@AGENTS.md

## Context memory, loaded not merely referenced

@docs/decisions.md

The import above is doing real work. `AGENTS.md` *asks* you to read `docs/decisions.md`
before touching a rule — but an instruction is a request, and a request can be skipped when
the context gets long or the prompt gets insistent. The `@` import makes it mechanical: the
decision log, with every rationale and every open question, is in context before the session
starts. Nothing has to remember to fetch it.

That is the same distinction as plan mode: **mechanical beats contractual.** Codex CLI has
no import mechanism, so for that engine the decision log stays contractual — it complies
because `AGENTS.md` told it to. Same intent, weaker guarantee. That difference is the point,
not an accident.

The trade-off is real and worth stating: an import costs those tokens **every session**,
whether or not the decisions turn out to be relevant. That is affordable here because the
log is short and load-bearing — it is the guardrail rationale. When a decision log grows
past the point where it earns its tokens, the move is to import a short index and let the
engine read the full entries on demand. That judgement is what "semantics per token" means
in practice.

## Claude Code specifics

- **Use plan mode** (`shift+tab`, or `--permission-mode plan`) for any change under
  `src/determination/`. That directory is where clinical policy is enforced; the approval
  gate should be enforced by the tool, not by your goodwill.
- Run the gates with the shell tool and paste the real output. `npm test`,
  `npm run typecheck`.
- `/context` shows you what is actually loaded right now. If you ever doubt whether the
  decision log made it in, look — do not assume.
