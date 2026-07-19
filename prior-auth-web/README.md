# prior-auth-web — the React practice repo

The front end the course's later labs mean by `prior-auth-web`: the Prior Auth Portal's
queue UI, consuming `prior-auth-api`'s contract. Small on purpose — read all of `src/` in
one sitting. Real: it installs, typechecks, tests pass, and `npm run dev` serves the queue.

```bash
npm install
npm test          # 5 passing
npm run typecheck # clean
npm run dev       # the queue at http://localhost:5173
```

For the deep material — what you actually install, how an approved plan becomes code, how
files become the engine's memory — see `prior-auth-api/README.md`; it all applies here
unchanged. This README covers only what's different: the web repo's own seeded gap.

## The seeded state: the API's bolt shipped, the screen didn't notice

`prior-auth-api` ran its hello-world bolt and shipped `PENDING_NURSE_REVIEW` (its D-004).
This repo's `AuthStatus` type carries the new state — the contract is honored — but open
`src/components/StatusBadge.tsx`:

```
PENDING:              'Pending',
PENDING_NURSE_REVIEW: 'Pending',   // same label, same color
```

On screen, the API's fix is invisible. A nurse scanning the queue still cannot tell which
rows are actually theirs. A test asserts this gap **on purpose** —
`renders_nurse_review_identically_to_pending_TODAY` — your bolt flips it.

And `docs/decisions.md` carries an open question nobody has answered: when the distinction
becomes visible, what is a nurse's *default* view — everything with their rows highlighted,
or only their rows? That has care-ops weight. An honest engine surfaces it before planning;
it does not pick.

## Run the bolt

```bash
cd prior-auth-web
claude        # or: codex
```

```text
> Nurses say the queue still doesn't show which requests are waiting
> on them, even though the API now sends PENDING_NURSE_REVIEW.
>
> Plan first — numbered steps, files you'll touch and files you won't.
> STOP for my approval before writing anything.
> Read docs/decisions.md first and ask me about anything in the
> "not yet decided" section instead of guessing.
> After approval: tests first, then code. Run `npm test` and
> `npm run typecheck` yourself and show me the real output.
> Record any decision I make in docs/decisions.md, with my reasoning,
> and cite it from the code.
```

In Claude Code, press `shift+tab` first — `CLAUDE.md` asks for plan mode on anything that
changes what a screen shows.

**What you should end up with:** a visibly distinct nurse-review badge; the default-view
decision made by you and recorded as D-003; the TODAY test replaced by tests asserting the
new behavior plus your default-view choice; gates green with output shown.

### After your attempt: the worked answer

A complete run of this bolt lives on the
[`answers/web-hello-world-bolt`](https://github.com/varasrinivas/ai-dlc-course/tree/answers/web-hello-world-bolt/prior-auth-web)
branch ([full diff](https://github.com/varasrinivas/ai-dlc-course/compare/main...answers/web-hello-world-bolt)).
Attempt first — reading the answer defeats the bolt. Your D-003 may legitimately differ
(a nurse-only default is a defensible call): what matters is that a human decided it and
the reasoning is recorded.

## Layout

```
AGENTS.md                 the steering file — screen guardrails. Codex reads it by name.
CLAUDE.md                 Claude Code entry point: imports @AGENTS.md + @docs/decisions.md
docs/decisions.md         screen/workflow decisions; clinical policy stays in the API repo
docs/units/               units of work; one unit = one bolt = one session
src/domain/auth.ts        the API contract, mirrored
src/components/           AuthQueue, StatusBadge + colocated tests
src/data/sample.ts        static rows until the queue is wired to GET /auth-requests
```
