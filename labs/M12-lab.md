# Lab M12 — Read a map, then survey your own estate

> Module: M12 — Semantic Context Building for Brownfield
> Audience: practitioner · Estimated time: 25 min
> Domain: Prior Auth Portal (eligibility system integration; Member flags, staleness invariant)

## Path A — Understand It (no tooling required)

**Artifact:** a semantic-map excerpt for the 12-year-old eligibility system.

```text
ENTITIES   Member.flags — a HISTORY of status events, not a
           current state; latest E-series flag wins.
FLOWS      portal → eligibility API (sync, 200-always) ·
           cache refresh nightly 02:00 (ops-cron repo)
INVARIANTS I-1  eligibility data ≤ 24h stale — plan for it
           I-2  E4 = retro-terminated → ineligible for new
                auths (confirmed: J. Ortiz)
           I-3  200 + empty body = member unknown → treat as
                ineligible, do NOT retry
                ⚑ CONFIRM — inferred from handler code only;
                  knowledge holder retires in May
FLAGGED    F-1  E7 appears 14 times, always with manual-review
           comments — meaning unknown ⚑ CONFIRM
```

**Trace it:**
1. Find the line that closes the unowned staleness question from the bolt-1 close-out.
2. Separate the confirmed lines from the suspected ones, and note who confirmed what.
3. For I-2, estimate what raw material it compresses (call sites, tribal knowledge).

**Check yourself:**
1. Which line closes the unowned staleness question?
2. What does confirming I-3 actually require, and why is the deadline real?
3. Roughly what compression does I-2 represent?

<details><summary>Answers</summary>

1. I-1 — and it converts the [data] question M07's plan parked at step 4 into a design
   constraint bolt 2 plans around rather than a surprise it hits in production.
2. A human who knows the eligibility system verifying the convention and putting their
   name on it — before May, because after May the only holder of that knowledge is gone
   and "confirm" becomes "reverse-engineer."
3. Six call sites' worth of string comparison plus the tribal knowledge of why —
   hundreds of lines and one retirement risk, compressed to one confirmed, citable
   sentence.

</details>

## Path B — Build It with AI

> The unit of work: survey your own estate. The `prior-auth-api` repo now has code
> (Labs M07/M08) and a docs/ chain — treat it as brownfield and map it. Both variants
> produce the same artifact. Run in the `prior-auth-api` folder.

### Claude Code variant

```text
# Claude Code
cd prior-auth-api
claude
> Treat this repo as brownfield and run a semantic survey. Write
> docs/M12-semantic-map.md with four sections: entities, flows,
> invariants, flagged unknowns. Every invariant must cite the
> file that implies it (e.g. your collect-all-errors validation,
> the >= threshold check in src/determination/). Include at
> least 2 flagged unknowns phrased as CONFIRM questions a human
> must answer. Keep the whole map under 2 pages. Change no code.
```

**Expected artifact:** `docs/M12-semantic-map.md` — four sections, file-cited invariants,
≥2 ⚑ CONFIRM flags, ≤2 pages.
**Verify:** every invariant names a real file in the repo; the CONFIRM flags are
questions a human must answer (not restatements); no code files changed.

### Codex CLI variant

```text
# Codex CLI
cd prior-auth-api
codex
> Treat this repo as brownfield and run a semantic survey. Write
> docs/M12-semantic-map.md with four sections: entities, flows,
> invariants, flagged unknowns. Every invariant must cite the
> file that implies it (e.g. your collect-all-errors validation,
> the >= threshold check in src/determination/). Include at
> least 2 flagged unknowns phrased as CONFIRM questions a human
> must answer. Keep the whole map under 2 pages. Change no code.
```

**Expected artifact:** the same four-section map, steered by AGENTS.md.
**Verify:** same checks as the Claude Code variant.

**Parity note:** the two engines may surface different invariants from the same estate —
that's the most instructive outcome of this lab. Compare the maps; the union is your
real map, and the disagreements are your next CONFIRM flags.

## Done when

- [ ] `docs/M12-semantic-map.md` exists with four sections in ≤2 pages.
- [ ] Every invariant cites the file that implies it; ≥2 honest CONFIRM flags await a
      human.
- [ ] No code changed — and the map told you something about your own repo you hadn't
      written down anywhere.
