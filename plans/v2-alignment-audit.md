# AI-DLC v2 alignment audit: course/index.html

**Date:** 2026-10-10
**Scope:** every entry in `MODS` (P00, P01, M00–M34) in `course/index.html` (8,241 lines). The audit
looks only at claims that depend on AWS's versioned facts about AI-DLC. Course conventions such as
`docs/decisions.md`, `docs/units/`, the Lakeview saga and the two-engine labs are in scope only where
the course presents them as AWS's own layout or vocabulary.
**Line numbers** refer to `course/index.html` at commit `b774206`. They are approximate (±2) and point
at the line where the claim starts.

> **Status: closed, 2026-10-11.** Every annotate and rewrite item below is fixed, committed and
> deployed to learnings.varasrinivas.com/ai-dlc-course/. See **Resolution log** for the commit per
> item. Line numbers in the body still refer to `b774206`, before the fixes.

## Sources (pinned)

AWS v2 (GA, tag `v2.11.0`, 2026-10-08 per release notes; README badge reads 2.11.0):

- README: https://github.com/awslabs/aidlc-workflows/blob/v2.11.0/README.md
- Phases and stages: https://github.com/awslabs/aidlc-workflows/blob/v2.11.0/docs/guide/04-phases-and-stages.md
- Glossary: https://github.com/awslabs/aidlc-workflows/blob/v2.11.0/docs/guide/glossary.md
- Scopes and depth: https://github.com/awslabs/aidlc-workflows/blob/v2.11.0/docs/guide/05-scopes-and-depth.md
- Artifacts reference: https://github.com/awslabs/aidlc-workflows/blob/v2.11.0/docs/guide/14-artifacts-reference.md
- Spaces and intents: https://github.com/awslabs/aidlc-workflows/blob/v2.11.0/docs/guide/03-spaces-and-intents.md
- Interaction modes: https://github.com/awslabs/aidlc-workflows/blob/v2.11.0/docs/guide/07-interaction-modes.md
- Harnesses overview: https://github.com/awslabs/aidlc-workflows/blob/v2.11.0/docs/guide/harnesses/README.md
- Codex CLI harness: https://github.com/awslabs/aidlc-workflows/blob/v2.11.0/docs/guide/harnesses/codex-cli.md

AWS v1 (maintenance-only, branch `v1`):

- README (copy-in setup per tool): https://github.com/awslabs/aidlc-workflows/blob/v1/README.md
- Generated `aidlc-docs/` reference: https://github.com/awslabs/aidlc-workflows/blob/v1/docs/GENERATED_DOCS_REFERENCE.md

AWS blogs:

- "AI-Driven Development Life Cycle" (31 Jul 2025): https://aws.amazon.com/blogs/devops/ai-driven-development-life-cycle/
- "Open-sourcing adaptive workflows for AI-DLC" (29 Nov 2025): https://aws.amazon.com/blogs/devops/open-sourcing-adaptive-workflows-for-ai-driven-development-life-cycle-ai-dlc/

## Summary

| Status | Count | Modules |
|---|---|---|
| keep | 13 | M08, M15, M17, M20, M21, M24, M25, M26, M27, M28, M30, M32, M34 |
| annotate | 17 | M01, M04, M05, M06, M07, M09, M10, M12, M13, M14, M16, M18, M19, M22, M23, M29, M31 |
| rewrite | 7 | P00, P01, M00, M02, M03, M11, M33 |

All 24 annotate and rewrite modules are now fixed.

The "rewrite" status applies to specific sentences or table rows that are now factually wrong. No module
needs a structural rebuild.

**Top 5 issues by impact**

1. **Bolt definition.** The course says a bolt is one full Inception → Construction → Operations pass and
   that "one unit = one bolt = one session". The v2 glossary defines a bolt as a planned Construction
   delivery slice over one or more dependency-linked Units, planned in stage 2.9. This affects P00, M00,
   M03, M09, M23, M29 and the player's bolt rail.
2. **"Nothing to install."** P00, P01 and M02 say AI-DLC has nothing to install. v2 ships a native `aidlc`
   CLI (install.sh / install.ps1) and per-harness setup with `aidlc config --harness <name>`.
3. **Epic and story mapping.** The blog says "Epics are replaced by Units of Work". The course maps
   Story → Unit of work (M00) and Epic → bolt (M33).
4. **M11's "standard library".** M11 presents course-invented stages (`semantic-survey`, Mob Elaboration as
   a stage, a six-field schema) as AWS's published stage library. v2 has 33 named stages with a different
   definition model.
5. **Phase and stage model.** The course teaches three phases with no stage names. v2 has 5 phases and 33
   stages: Initialization (0.1–0.3) and Ideation (1.1–1.7) come before Inception, and each stage is marked
   ALWAYS or CONDITIONAL. The method-level three-phase framing is still correct per the blog, so most
   modules only need an annotation.

No code block in the course claims to be an official AI-DLC command. The course contains no `/aidlc`,
`$aidlc`, "Using AI-DLC, …" trigger or `aidlc-docs/` path, so no command needs to be retracted.

## Cross-cutting issues

### C1. Bolt = full lifecycle pass; one unit = one bolt = one session

- **Claim:** "A bolt is … one complete pass — Inception, Construction, Operations — in hours to days"; "Three
  phases per bolt"; "units of work; one unit = one bolt = one session".
- **Where:** P00 ~712 and ~1240. M00 ~1663, fig 0.1 caption ~1704, recap ~1858. M03 ~2224, fig 3.1 ~2283,
  recap ~2436, ritual table ~2304. M09 recap ~3533. M23 ~5819–5820 (full ritual set per bolt). M29 ~6814.
  Player `boltRail()` ~7746, which renders Inception · Construction · Operations · bolt on every page.
- **AWS fact:** "Bolt — A planned Construction delivery slice over one or more dependency-linked Units …
  Delivery Planning records grouping, Definition of Done … Build and Test and CI Pipeline run once across
  the completed Unit work." Source: glossary. `bolt-plan.md` is produced at 2.9 Delivery Planning
  (04-phases-and-stages, Phase 2). The 2025 blog only describes bolts as "shorter, more intense work cycles
  measured in hours or days rather than weeks" that replace sprints.
- **Fix:** Keep the course's cadence teaching. Reword the definition along these lines: "AWS defines a
  bolt as a Construction delivery slice over one or more units. This course runs the simplest case — one
  unit per bolt, one session per unit — and wraps a short Inception and close around it." Change the M03
  definition and recap first, then make M00, P00 and the fig captions consistent with it. Rename the
  player rail tooltip/label rather than restructuring it.

### C2. "Nothing to install for AI-DLC"

- **Claim:** "there is no npm package for AI-DLC … You never install the methodology"; "There is nothing to
  install for AI-DLC itself"; "AI-DLC is a methodology, not a runtime. You never install it"; Conductor
  comparison cell "a methodology — nothing to install".
- **Where:** P00 ~1294–1308 and recap ~1359. P01 ~1380, ~1385 and recap ~1639. M02 ~2118.
- **AWS fact:** v2 installs a native `aidlc` command via `install.sh` / `install.ps1`, then
  `aidlc config --harness claude|codex|…` and `/aidlc` (Claude Code) or `$aidlc` (Codex). Source:
  v2.11.0 README "Quick Start". v1 was copy-in rule files (v1 README). "No npm package named `ai-dlc`" is
  still literally true, because the installer is not npm.
- **Fix:** Rewrite these lines as follows: "AWS's reference implementation (v2) is an installable `aidlc`
  engine. This course deliberately runs the method by hand on a bare engine plus plain files, so you see
  every moving part, and needs no install." P01 is reality-checked, so update `SETUP.md` in the same
  session (per the root CLAUDE.md P01 rule).

### C3. Unit-of-work granularity and the Epic mapping

- **Claim:** Bridge table "Story / task → Unit of work" (M00 ~1713). "Epic → A bolt (or a short run) …
  Story → A unit of work" (M33 ~7370, table ~7417–7419). Unit = "smallest slice … one AI construction loop"
  (M03 ~2287).
- **AWS fact:** "Epics are replaced by Units of Work" (2025 blog). The v2 glossary defines a Unit of work as
  "an independently implementable piece of the solution, decomposed during stage 2.7 (Units Generation)".
- **Fix:** In M00 and M33, add AWS's mapping (Epic → Unit of work) and state that the course sizes units
  smaller, at roughly story size, to fit one session. M33's "Epic → bolt" row should read "Epic → Unit of
  work (AWS); this course slices further to story-sized units".

### C4. Phase count, names and stages (3 vs 5; always vs conditional)

- **Claim:** "AI-DLC organizes work into three phases" (M00 ~1663). The Track 2 title is "The Three Phases"
  (~486). Inception = requirements → stories → units (M05 ~2578, M16 ~4645). Construction = architecture →
  plan → code + tests (M07 ~2989).
- **AWS fact:** "5 phases containing 33 stages" (04-phases-and-stages). The phases are Initialization
  0.1–0.3 (automatic, no gates), Ideation 1.1–1.7 (Intent Capture 1.1 is ALWAYS), Inception 2.1–2.9,
  Construction 3.1–3.7 (3.1–3.5 per Unit, 3.6 Build and Test once and ALWAYS, 3.7 CI Pipeline CONDITIONAL),
  and Operation 4.1–4.7 (all CONDITIONAL). Verification gates run at phase boundaries. Inception ALWAYS
  runs 2.3 Requirements Analysis, 2.7 Units Generation and 2.9 Delivery Planning; Reverse Engineering (2.1)
  runs on brownfield. v2 spells the phase "Operation". The blog body uses "Operations", and v1's Operations
  phase was a placeholder (v1 README).
- **Fix:** Annotate, don't rewrite. The three-phase framing is the blog's method-level description and is
  still correct. Add one "In AWS's v2 workflows" callout in M00 (5 phases, 33 stages), with brief
  per-phase notes in M05, M07 and M09 mapping course steps to v2 stage numbers.

### C5. Anti-pattern term: "AI-managed" vs AWS's "AI-autonomous"

- **Claim:** "AI-managed" is used in P00 ~1151, M00 ~1659/1725/1857, M01 throughout (~1876–2014), M02
  ~2151, M07 ~2990, M34 ~7514 and the P00 simulator ~7966.
- **AWS fact:** The blog names "AI-assisted development" and "AI-autonomous development, where AI is
  expected to generate entire applications without human intervention". "AI-managed" does not appear.
- **Fix:** **User decision. Do not change unilaterally.** The root `CLAUDE.md` also mandates "AI-managed"
  (line 41, and the T1 beat at line 84). If the course keeps the term, add a one-line gloss in M00/M01:
  "AWS's blog calls this *AI-autonomous*." If the term is changed, change the root CLAUDE.md first; that
  file is outside this audit.

### C6. Steering-file names and placement

- **Claim:** "CLAUDE.md in Claude Code, AGENTS.md in Codex, Project Rules in Amazon Q Developer, Steering in
  Kiro." Where: M00 ~1794, M13 ~4053 plus table ~4090–4095, M22 ~5676, P00 ~1054. M00 ~1660 also says "AWS
  demonstrates it with Amazon Q Developer and Kiro".
- **AWS fact:** v1 used copy-in placement: `.amazonq/rules/aws-aidlc-rules/`, `.kiro/steering/`, root
  `CLAUDE.md` or `.claude/CLAUDE.md`, root `AGENTS.md` for Codex, plus `.aidlc-rule-details/` (v1 README).
  In v2, `aidlc config --harness <name>` writes onboarding to `.claude/CLAUDE.md` (Claude Code),
  `.codex/onboarding.md` plus `.codex/config.toml` (Codex), `.kiro/steering/aidlc-onboarding.md` (Kiro), and
  a shared root `AGENTS.md` block. Rules live in `aidlc/spaces/<space>/memory/` (org → team → project →
  phase → stage) and are pulled in by each harness's native include: a Claude `@`-import stub, or Codex
  `AIDLC_RULES_DIR`. Sources: harnesses/README, glossary "Rule". The v2 harness list (Claude Code, Kiro
  CLI/IDE, Codex CLI, Cursor, opencode, GitHub Copilot) has no Amazon Q Developer entry. v2 natively
  supports both of this course's engines.
- **Fix:** The pattern claim ("one pattern, many names") is still right. Annotate M13 and M00 with a short
  v1/v2 placement note. Update "AWS demonstrates it with Q Developer and Kiro" to say AWS now ships
  first-class Claude Code and Codex harnesses. Mark Q Developer "Project Rules" as the v1-era name.

### C7. Artifact and folder names: course layout vs AWS layout

- **Claim:** The course writes everything to `docs/` (decisions.md, units/, semantic-map.md, close-outs).
  This is fine as a course convention, and no module names `aidlc-docs/` or v2 paths. The single place that
  implies AWS's layout is M11 (~3716–3721, lab ~3797), where `docs/semantic-map.md` is the output of a
  "standard library" stage.
- **AWS fact:** v1 writes to `aidlc-docs/` (`aidlc-state.md`, `audit.md`, `inception/…`,
  `construction/{unit}/…`). v2 writes to `aidlc/spaces/<space>/intents/<YYMMDD>-<label>/` (`aidlc-state.md`,
  `audit/` shards, `inception/requirements-analysis/requirements.md`, …), with code knowledge in
  `aidlc/spaces/<space>/codekb/<repo>/`. Sources: v1 GENERATED_DOCS_REFERENCE, v2 03-spaces-and-intents,
  14-artifacts-reference.
- **Fix:** Fix M11 (see C8). Optionally, add one sentence in M13 noting that AWS's tooling keeps the same
  three kinds of memory under `aidlc/spaces/…` and that the course's `docs/` is its hand-run equivalent.

### C8. "Open-source workflow definition" and the stage library (M11)

- **Claim:** "AI-DLC ships as an open-source workflow definition … Claude Code and Codex read the same stage
  text" (~3716). "Read two from the standard library. Semantic survey … Mob Elaboration …" (~3721). "A stage
  definition is six fields" (~3720). Recap ~3858.
- **AWS fact:** The workflow is open source. v1 shipped `core-workflow.md` plus rule-detail markdown; v2
  ships a harness-neutral `core/` plus a deterministic engine rendered onto each harness (v2 README,
  "Repository Layout"). v2 stages are numbered and named (for example 2.1 Reverse Engineering, 2.4 User
  Stories, the only "mob" stage). Each stage declares `consumes`/`produces`, a lead agent, an execution
  mode and an ALWAYS/CONDITIONAL condition (04-phases-and-stages). There is no `semantic-survey` stage and
  no "Mob Elaboration" stage. Extension in v2 goes through plugins, `scope save` and harness engineering
  rather than editing a folder of prose stages.
- **Fix (rewrite):** Keep the module's lesson (a process written as text can be audited and extended). Say
  plainly that the six-field format and the two example stages are this course's teaching model. Map
  `semantic-survey` → AWS 2.1 Reverse Engineering. Say that Mob Elaboration is a team ritual (from the
  blog), not a v2 stage. Note that both engines execute AWS's stage text only when the AWS harness is
  installed; the course's labs use the hand-run docs/ library.

### C9. Adaptive rigor vs v2 scopes, depth and the composer (M10)

- **Claim:** A five-input dial (blast radius, reversibility, regulatory, novelty, size). "The AI reads the
  ground" for greenfield/brownfield using signals such as "steering file existence, commit history density"
  (~3549–3553).
- **AWS fact:** v2 selects stages through 11 scopes (enterprise, feature, mvp, poc, bugfix, refactor, infra,
  security-patch, classic, workshop, express) × 3 depths (Minimal / Standard / Comprehensive) × 3 test
  strategies. An optional adaptive composer scores five implementation-entropy components and proposes an
  EXECUTE/SKIP grid that a human approves. Workspace Detection (0.2) is "a rule-based scanner (file
  extensions, known config filenames, package manifests)". Sources: 05-scopes-and-depth,
  04-phases-and-stages. The open-sourcing blog describes adapting "both the breadth (choice of stages) and
  the depth of each stage".
- **Fix (annotate):** The course's dial is a valid teaching model, and "a human sets the dial" matches v2's
  gated composer. Add a v2 callout naming scopes and depth as AWS's mechanism, with a mapping such as
  T-101 ≈ `bugfix`/`express`, T-102 ≈ `security-patch`-style strict path, T-103 ≈ `feature`/`enterprise`.

### C10. Question and approval-gate mechanics

- **Claim:** The AI asks clarifying questions in chat. Answers are recorded in `docs/decisions.md`, and
  approval is a typed "approved" or a plan-mode exit (M05, M06, M15, M20). These are course mechanics, and
  the course does not attribute them to AWS.
- **AWS fact:** v1: "Structured multiple-choice questions in files, not chat", with `[Answer]:` tags in
  plan and question files, approval of each stage, and the "Using AI-DLC, …" trigger (v1 README). v2:
  tri-mode questions (Guide Me / Edit File / Chat) that all converge on a co-located
  `{stage-name}-questions.md` with lettered options, a mandatory "X. Other" and `[Answer]:` tags. Every
  executed stage outside Initialization ends in an approval gate, and verification gates run at phase
  boundaries. Sources: 07-interaction-modes, 14-artifacts-reference.
- **Fix (annotate):** In M05 or M06, add one sidebar contrasting the hand-run loop with AWS's questions
  file, and noting that v2's "questions file is the source of truth" plays the same role as the course's
  decision log.

### C11. Evidence numbers

- **Claim:** Bedrock 18 months / 30 devs → 6 engineers in 76 days; Amazon Stores 4.5x developer velocity;
  Blue Origin 95% adoption. Where: M04 ~2455–2558 and fig ~2479–2489; M31 ~7103; M09 ~3422 ("M04's 76-day
  story").
- **AWS fact:** **Not found** in either cited AWS blog (checked 2026-10-10) or in the v2 README or docs.
  The course's attribution ("as reported by AWS") matches the root CLAUDE.md, but no source URL is cited.
- **Fix (annotate):** Add the primary-source URL and exact AWS wording to M04 (and to the M31 Blue Origin
  line). Until a source is confirmed, treat the numbers as unverified. See "Not verified" below.
- **Resolved 2026-10-11 (`2162271`, `8221500`).** Primary sources found:
  - Bedrock: 6 engineers, 76 days, against "30 engineers, 12 to 18 months"
    (https://kiro.dev/case-studies/bedrock/). Jassy's 2025 shareholder letter says 40 engineers and a
    full year, as quoted on AWS's AI-DLC financial-services blog, which calls the project's ways of
    working "parts of what we refer to today as" AI-DLC
    (https://aws.amazon.com/blogs/industries/ai-driven-development-lifecycle-for-financial-services/).
  - Amazon Stores: "4.5x median productivity gain", not "developer velocity"; not AI-DLC-specific
    (https://aws.amazon.com/about-aws/learn-from-amazon/).
  - Blue Origin: "95% of software engineers already using generative AI tools to write code". That is
    tool adoption, not AI-DLC adoption (https://aws.amazon.com/solutions/case-studies/blue-origin-case-study/).

## Resolution log

| Fix-order item | Commit | What changed |
|---|---|---|
| 1. M03 | `57e9c26` | AWS's bolt and unit definitions first; one unit per bolt named as the course's simplest case |
| 10. Bolt rail | `24c328c` | Label "course bolt" plus a tooltip giving AWS's definition (done right after M03) |
| C5 term | `d736d6a` | "AI-managed" → "AI-autonomous" in CLAUDE.md, the course, labs, curriculum map and the prior-auth-api README (user decision) |
| 2. M00 | `dedec51` | Bolt lines, v2 five-phase callout, Epic → Unit of work bridge row, v2 harness and steering notes |
| 3. P00 | `804044d` | Optional v2 `aidlc` CLI named; the course runs the method by hand; bolt lines; Project Rules marked v1-era |
| 4. P01 + SETUP.md | `da16914` | Same install wording in both; transcripts re-run (api 4/4, web 5/5, both typechecks clean) |
| 5. M02 | `72d8220` | AWS AI-DLC column of the Conductor/OpenSpec table |
| 6. M11 | `e15ee98` | Stage library labelled as the course's model; semantic survey → 2.1; Mob Elaboration is a ritual; v2 extension points. M25 and M30 checked, no change |
| 7. M33 | `55e2c33` | Epic → Unit of work (AWS), then story-sized units (course); lab and runbook callout aligned |
| 8. M04 + CLAUDE.md | `2162271` | Evidence figures from primary sources (see C11); lab line 5 is now an inflated claim |
| 8. M31 | `8221500` | Blue Origin's 95% no longer used as adoption-as-behavior |
| 9. Annotations | `48b33ee`, `8b5c1ad` | One "In AWS's v2 workflows" callout each in M05–M07, M09, M10, M12–M14, M16, M18, M19, M23, M29; M16 stage map retitled to phases; M22 names note. M01 needed nothing after the term change |

The runbook link from P00 is `dea96b7`. The P00 recap links to the runbook, which ships at
`ai-dlc-course/runbook/` on the site.

## Per-module table

| Module | Status | Versioned claims found | Fix note | Source |
|---|---|---|---|---|
| P00 | rewrite → **fixed** `804044d` | "no npm package … never install the methodology" (~1294–1308, ~1359); "three AI-DLC phases every bolt has" (~712); "one unit = one bolt = one session" (~1240); steering names incl. Q Project Rules (~1054); "AI-managed" (~1151, sim ~7966) | C2: reword the install claim (v2 `aidlc` CLI exists; the course runs the method by hand). C1: reword the bolt lines. C5/C6: gloss only. Keep the "no npm package" half. | v2 README; glossary "Bolt" |
| P01 | rewrite → **fixed** `da16914` | "There is no package for AI-DLC … You never install it" (~1380); methodology row "nothing" (~1385); recap "Nothing installs AI-DLC" (~1639); "AWS's open-source methodology, not an AWS service" (~1390, OK) | C2: add a one-line note that AWS's v2 engine is optional and not used here. Update `SETUP.md` identically (root CLAUDE.md P01 rule). No transcript changes. | v2 README Quick Start |
| M00 | rewrite → **fixed** `dedec51` | "three phases" (~1663); fig 0.1 "three phases per bolt" (~1704); recap "Three phases per bolt" (~1858); bridge row Story/task → Unit of work (~1713); "AWS demonstrates it with Amazon Q Developer and Kiro" (~1660); steering names (~1794); "AI-managed" (~1659, ~1725, ~1857) | C1 + C3 rewrite: bolt lines and bridge row. C4/C6 annotate: v2 has 5 phases and native Claude Code and Codex harnesses. C5 gloss is the user's decision. | glossary; 04-phases; blog (Epics → Units); harnesses/README |
| M01 | annotate → **fixed** `d736d6a` | "AI-managed" as AWS's anti-pattern name throughout (~1876–2014); two dimensions described correctly | C5: add "AWS: AI-autonomous" gloss if the user keeps the term. Content otherwise matches the blog. | 2025 blog |
| M02 | rewrite → **fixed** `72d8220` | Conductor table: AWS AI-DLC "a methodology — nothing to install" (~2118); "Covers intent → construction → operations" (~2120); "unit of work inside a bolt" (~2119) | C2: change the cell to "a methodology plus an optional installable engine (v2 `aidlc`)". C4: note Initialization/Ideation. The two dimensions are correct. | v2 README; 04-phases |
| M03 | rewrite → **fixed** `57e9c26` | Bolt = "one complete pass — Inception, Construction, Operations" (~2224); fig 3.1 (~2283); recap (~2436); "Bolt close — Operations" ritual row (~2304); unit sizing rule (~2287) | C1: this is the canonical definition to fix first, framing one unit per bolt as the course's simplest case. C3: the sizing rule is the course's own; say so. | glossary "Bolt", "Unit of work" |
| M04 | annotate → **fixed** `2162271` | Bedrock 18 mo/30 devs → 6 engineers/76 days; Amazon Stores 4.5x; Blue Origin 95% (~2455–2558, fig ~2479) | C11: add the primary source URL and exact AWS wording. Not found in either blog. | not verified |
| M05 | annotate → **fixed** `48b33ee` | Inception pipeline intent → requirements → stories → UWs (~2578); intent as Inception input (~2574); questions at every joint (~2634) | C4: map to v2 1.1 Intent Capture (Ideation), 2.3 Requirements, 2.4 User Stories, 2.7 Units Generation, 2.9 Delivery Planning. C10: questions-file sidebar. | 04-phases; 07-interaction-modes |
| M06 | annotate → **fixed** `48b33ee` | Mob Elaboration mechanics (~2793–2879) presented as AI-DLC's ritual; decisions recorded in decisions.md | The ritual name comes from the 2025 blog. Note that v2 has no "Mob Elaboration" stage (2.4 User Stories is an agent mob) and that v2's questions file is the record of answers (C10). | 2025 blog; 04-phases "Mob" mode |
| M07 | annotate → **fixed** `48b33ee` | Construction = per-UW architecture proposal → plan → code + tests → review (~2989–3050) | C4: v2 runs 3.1 Functional Design, 3.2–3.4 NFR/Infra (conditional), 3.5 Code Generation (ALWAYS) per Unit, then 3.6 Build and Test once and 3.7 CI. Architecture sits at 2.6 Domain Design. v2 also has Plan Approval (matches). | 04-phases Phase 3 |
| M08 | keep | Mob Construction ritual; two exits (sign-off / send-back) | Consistent with the blog and with v2 Approve / Request Changes. Optional: mention the v2 Unit checkpoint. | 2025 blog; 07-interaction-modes |
| M09 | annotate → **fixed** `48b33ee` | Operations as "deploy, observe, preserve context"; "one full bolt, phase by phase" (~3533) | C4: v1 Operations was a placeholder; v2 Operation has 4.1–4.7, all CONDITIONAL. The close-out is a course convention (fine). C1 for the recap line. | v1 README; 04-phases Phase 4 |
| M10 | annotate → **fixed** `48b33ee` | Adaptive rigor as a five-input dial; greenfield/brownfield detection signals incl. "steering file existence, commit history density" (~3549–3553) | C9: add v2 scopes (11) × depth (3), the composer, and rule-based Workspace Detection 0.2. The dial stays as a teaching model. | 05-scopes-and-depth; 04-phases 0.2 |
| M11 | rewrite → **fixed** `e15ee98` | "AI-DLC ships as an open-source workflow definition" (~3716); "standard library" stages `semantic-survey` and Mob Elaboration (~3721); six-field stage anatomy (~3720); engines "read the same stage text" | C8: label the format and examples as the course's model; map semantic-survey → 2.1 Reverse Engineering; Mob Elaboration is a ritual, not a v2 stage; v2 extension is plugins and `scope save`. | v2 README layout; 04-phases; 05 composer/scope save |
| M12 | annotate → **fixed** `8b5c1ad` | "semantic context building"; "That ratio … is what AI-DLC calls high semantics-per-token" (~3890) | Map to v2 2.1 Reverse Engineering (brownfield; 9 RE artifacts) and `aidlc/spaces/<space>/codekb/<repo>/`. The semantics-per-token phrase is not in v2 docs (see Not verified). | 04-phases 2.1; 03-spaces-and-intents |
| M13 | annotate → **fixed** `8b5c1ad` | Steering names table incl. Amazon Q "Project Rules" (~4053, ~4090–4095); three-layer memory hierarchy (~4040) | C6: v1 vs v2 placement note; v2 rules layering (org → team → project → phase → stage) under `aidlc/spaces/…/memory/`. The course's three layers stay as a teaching model. | v1 README; harnesses/README; glossary "Rule" |
| M14 | annotate → **fixed** `8b5c1ad` | CLAUDE.md as the steering file; project-root placement (~4235–4236) | Claude Code mechanics are fine. Add a C6 note: v1 copied `core-workflow.md` into CLAUDE.md (root or `.claude/`); v2 `aidlc config --harness claude` writes `.claude/CLAUDE.md` plus an `@`-import stub, so teams that adopt AWS's engine share that file with it. | v1 README; harnesses/README |
| M15 | keep | Claude Code plan mode as the Inception gate | Engine fact, not an AWS versioned claim. Optional: v2 invokes with `/aidlc`. | — |
| M16 | annotate → **fixed** `8b5c1ad` | "The stage map: AI-DLC stages ↔ what you actually see in Claude Code" (~4635–4662) uses phase-level labels as "AI-DLC stage" names; "one unit of work per session" (~4556) | C4: retitle the table or add a column of v2 stage numbers. C1: one UW per session is the course rule; a v2 bolt may span several units. | 04-phases; glossary |
| M17 | keep | Claude Code permissions and hooks | Engine facts. Optional: v2's Claude harness installs its own hooks into `.claude/settings.json`; merge, don't overwrite. | harnesses/README |
| M18 | annotate → **fixed** `8b5c1ad` | "Parallel bolts with subagents"; serialise vs stub-decouple coupled units | C1: in v2 parallelism is Unit-level (stage-major `Construction Execution: swarm` batches, team mode); "parallel bolts" is course vocabulary. The dependency handling matches v2's Unit DAG. | 04-phases "What can run in parallel" |
| M19 | annotate → **fixed** `8b5c1ad` | Codex reads AGENTS.md at start (~5195); steering parity | C6: v1 Codex setup = `core-workflow.md` → root AGENTS.md plus `.aidlc-rule-details/`. v2 = `aidlc config --harness codex`, `$aidlc`, `.codex/onboarding.md`, a shared root AGENTS.md block, Codex ≥ 0.145.0, git repo required. | v1 README; harnesses/codex-cli |
| M20 | keep | Codex plan-only contract; parity experiment | Course technique; no AWS versioned claim. | — |
| M21 | keep | Codex sandbox and diff review | Engine facts. | — |
| M22 | annotate → **fixed** `8b5c1ad` | "The steering file has many names — CLAUDE.md, AGENTS.md, Project Rules, Kiro Steering" (~5676); "one methodology, many engines" | C6 names note. Opportunity: v2's own tagline is "one core, many harnesses"; cite it as corroboration. | v2 README |
| M23 | annotate → **fixed** `8b5c1ad` | Capstone "four bolts", each with one Mob Elaboration, sessions per UW, Mob Construction and a close (~5819–5820) | C1: v2 plans bolts at 2.9 Delivery Planning (`bolt-plan.md`). Note that the capstone backlog plays that role and each bolt here groups several UWs, which is closer to v2 than M03's 1:1 rule. | glossary; 04-phases 2.9 |
| M24 | keep | Capstone bolt 1 | No AWS versioned claims. | — |
| M25 | keep | Capstone bolt 2; PHI-review stage | Depends on M11's PHI stage (course-owned); no AWS claim. | — |
| M26 | keep | Capstone bolt 3 | No AWS versioned claims. | — |
| M27 | keep | Capstone bolt 4 | No AWS versioned claims. | — |
| M28 | keep | Ship in rings; observe; next cycle | Course content. Optional: map to v2 4.1–4.7. | 04-phases Phase 4 |
| M29 | annotate → **fixed** `8b5c1ad` | "Per bolt: Mob Elaboration opens it, Mob Construction guards its increments, the bolt close writes it down" (~6814) | C1 wording. Optional: v2 team mode (`Unit Ownership: team`) and workshop scope as AWS's multi-person mechanics. | glossary; 04-phases |
| M30 | keep | Governance by construction; "stage library" references | Inherits M11's framing; no direct AWS claim. Optional: v2's 115-event audit trail as corroboration. | v2 README |
| M31 | annotate → **fixed** `8221500` | "Blue Origin's reported 95% was this shape" (~7103) | C11: needs a source; the interpretation ("this shape") is the course's and should say so. | not verified |
| M32 | keep | Rollout playbook | No AWS versioned claims. | — |
| M33 | rewrite → **fixed** `55e2c33` | Bridge table Epic → "A bolt (or a short run)", Story → "A unit of work" (~7417–7419; prose ~7370) | C3: AWS maps Epic → Unit of Work. Show AWS's mapping and then the course's finer slicing. Sprint → Bolt stays. | 2025 blog; glossary |
| M34 | keep | AWS Responsible AI dimensions ("six of the eight AWS names"); "AI-managed" echo (~7514) | RAI dimensions are AWS RAI, not AI-DLC versioned. The term is covered by C5 (user decision). | — |

## Not verified

- ~~**Evidence numbers**~~ Resolved: primary sources found and the course corrected. See C11.
- **"Semantics-per-token" and "semantic context building"** as AWS terms. They are not in the v2 docs, the
  v2 glossary or the two blogs as fetched. They likely come from the AI-DLC method definition paper linked
  from the v2 README, which was not checked.
- **"Mob Elaboration" / "Mob Construction"** are confirmed only in the 2025 blog. Their status in the
  method paper and the v2 Specification PDF was not checked.
- **"Adaptive rigor"** as a named AWS term. The blog says the workflows adapt "breadth … and depth"; v2 uses
  scopes and depth. The exact phrase was not found.
- **v2 Claude Code harness page.** `docs/guide/harnesses/claude-code.md` returned 404 in the pinned
  download. Claude Code placement here is from harnesses/README and the README harness table.
- **Tag date.** v2.11.0 = 2026-10-08 was supplied by the caller. The downloaded README shows a 2.11.0 badge
  but no date. The pinned files were read from a local download, not diffed byte-for-byte against the tag.
- **Codex behaviour claims** in M13/M19 ("Codex has no import mechanism"; concatenates AGENTS.md from the
  git root down). These are OpenAI facts outside this audit's sources. v2 itself routes rules to Codex via
  `AIDLC_RULES_DIR` and `developer_instructions`.
- **Blog text completeness.** Both blog fetches were truncated by the fetcher. A second read past the
  truncation point of the 2025 blog found no customer metrics, but the open-sourcing blog's tail was not
  re-read.

## Recommended fix order (one module per session)

All ten items are done; see **Resolution log**.

Follow the course workflow: run `/plan-module` → `/build-module` → `/build-lab` → `/validate-module` for
each item, one module per session, and edit by injection only (never by rewriting index.html).

1. **M03**: fix the bolt and unit definitions (C1, C3). This sets the wording every later fix reuses.
2. **M00**: bolt lines, bridge row, 5-phase / native-harness callout, steering note (C1, C3, C4, C6). Ask
   the user about the C5 term before this session.
3. **P00**: install claim and bolt lines (C1, C2). There is no lab or analogy, per the P-prefix exception.
4. **P01** plus `SETUP.md` together: install claim (C2). Re-check that the transcripts are unchanged.
5. **M02**: the Conductor/OpenSpec "nothing to install" cell (C2).
6. **M11**: stage-library reframe and Reverse Engineering mapping (C8); then confirm that M25 and M30 still
   read correctly.
7. **M33**: Epic → Unit of work mapping (C3).
8. **M04**, then **M31**: evidence citations (C11), once a primary source is found.
9. Annotations, in curriculum order: M01, M05, M06, M07, M09, M10, M12, M13, M14, M16, M18, M19, M22, M23,
   M29.
10. Player `boltRail()` label/tooltip (C1). This is not a module; treat it as a small player fix after M03.

**Multi-repo:** v2's native multi-repo support (intents spanning repos, per-repo `codekb/`) is covered by
the new runbook at `runbook/multi-repo-feature.html` (written in the same session, after this audit
ran), so the course modules need no multi-repo rewrite now. The runbook's Rally mapping (unit → User
Story, with the epic-level alternative noted as a team decision) should match whatever M33 settles on in
fix 7. (Done: M33 uses the same pair of mappings, and the runbook callout says so.) An optional future **Track 8** could teach
running the course's method on AWS's v2 engine (`aidlc config`, spaces/intents, scopes, multi-repo
intents). Planning it would need a root CLAUDE.md update first (track list, Lakeview beats).
