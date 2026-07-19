# Prior Auth Portal — web  (Claude Code entry point)

Claude Code loads this file in full at launch. It is deliberately thin: the rules live in
`AGENTS.md`, the decisions live in `docs/decisions.md`, and the two imports below load both
into context before your first prompt — mechanically, not by request.

## The shared steering file

@AGENTS.md

## Context memory, loaded not merely referenced

@docs/decisions.md

## Claude Code specifics

- **Use plan mode** (`shift+tab`, or `--permission-mode plan`) for any change under
  `src/components/` that touches what appears on a screen — that is where privacy policy
  is enforced, and the approval gate should be a switch, not a promise.
- Run the gates with the shell tool and paste the real output: `npm test`,
  `npm run typecheck`.
- `/context` shows what is actually loaded. If in doubt whether the decision log made it
  in — look, don't assume.
