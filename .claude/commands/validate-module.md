# /validate-module — 20-point check for one module

Argument: a module ID (e.g. `M05`). Referred to below as $ARGUMENTS.

Run `scripts/validate-course.ps1 -Module $ARGUMENTS` first (it covers the mechanical checks),
then verify the editorial checks by reading the module. Report a numbered pass/fail list.

## Mechanical (script-covered)

1. Module object present in `MODS` with id `$ARGUMENTS`
2. Required fields present: id, track, title, minutes, audience
3. `audience` is one of leader | practitioner | both
4. `track` matches curriculum-map.md
5. Extracted script passes `node --check`
6. No localStorage/sessionStorage anywhere in the file
7. No hard-coded hex colors inside the module body (CSS variables only)
8. At least one inline `<svg` with `viewBox` in the body
9. `.lab` section present
10. Standalone lab file `labs/$ARGUMENTS-lab.md` exists
11. Injection marker `/* {{MODULE_INJECTION_POINT}} */` still present exactly once
12. File is valid UTF-8 and under 2.5 MB

## Editorial (read and judge)

13. Hook paragraph opens the module and is a Prior Auth Portal scenario
14. 2–4 concept sections, each ≤ ~300 words, sentence-case headings
15. Exactly one `<aside class="analogy">` (Lakeview build): 60–120 words, names at least one
    cast member, includes the `maps to →` line, uses only beats already built, advances the
    story, and never substitutes for the technical explanation
16. Domain entities spelled per CLAUDE.md (AuthRequest, ClinicalCriteria, AUTO_APPROVE_THRESHOLD…)
17. AI-DLC terminology used correctly (bolts, units of work, Mob Elaboration/Construction,
    Inception/Construction/Operations, adaptive rigor)
18. Lab has both paths; Path B shows BOTH engine variants with parity (or Lead It for leader-only)
19. Engine commands tagged `# Claude Code` / `# Codex CLI` and PowerShell-safe
20. Recap section with 3–5 bullets and a pointer to the next module in curriculum order

Any failure: fix it, re-run the script, and re-report. The module is done only at 20/20.
