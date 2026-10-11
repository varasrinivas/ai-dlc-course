# prior-auth-notify — the greenfield repo

The third repo in the AI-DLC multi-repo runbook (`runbook/multi-repo-feature.html`). It
starts with steering files, a decision log, and an empty `src/`. Nothing else.

```powershell
npm install
npm test          # "No tests found" passes on purpose until Construction
npm run typecheck # clean
```

Read `AGENTS.md` first: it is what the engine reads before it writes a line here. The code
arrives in runbook step 08, when the unit `notify-service` is built against the contract
`prior-auth-api` publishes.
