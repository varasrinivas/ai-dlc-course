# Mob answer sheet — who decides what, and what the runbook decided

AI-DLC asks questions in files and stops at gates. In a real team a **room** answers: a
product owner, the UM director, a nurse lead, compliance, three repo leads. Running this
alone, you play every seat. This sheet gives you each seat's brief and the answers the
reference run gave, with the reasoning.

**This is not an answer key.** Your run's questions will be worded differently and
numbered differently: the engine writes them fresh each time from your intent and your
earlier answers. Use the sheet to know *who would own a question* and *what a defensible
answer sounds like*. Then try one answer differently on purpose, and watch how the
requirements, units and code change downstream. That is the most useful experiment in this
kit.

Every answer below carries the role that gave it, in brackets. Put the role in your answers
too. The engine copies it into the audit trail, and a later reviewer can see who decided.

---

## The room

| Seat | Owns | Typical question they answer |
|---|---|---|
| **Product owner (PO)** | Scope, priority, what v1 leaves out | "What should this first version deliberately leave out?" |
| **UM director** | The clinical operations outcome; the clock | "When does the 72-hour clock start?" |
| **Nurse lead** | How nurses work the queue; who is alerted | "Who receives the at-risk alert?" |
| **Compliance lead** | The regulatory reading; privacy sign-offs (with the privacy office) | "Does the alert payload break D-003?" |
| **api lead** | prior-auth-api: rules, clocks, statuses, the published contract | "Which repo computes decisionDueAt?" |
| **web lead** | prior-auth-web: what appears on screens | "What does the urgency badge show?" |
| **notify lead** | prior-auth-notify: delivery of notices | "What does a notice contain?" |
| **Tech lead** | Units, bolts, sequencing, the walking skeleton | "One unit per repo, or split the api work?" |

Rules every seat follows, whatever the question:

- **Recorded decisions don't move from a question file.** Each repo's
  `docs/decisions.md` holds them: prior-auth-api D-001 (`>=` 0.85 auto-approves), D-002
  (eligibility outranks score), D-003 (notices carry status and referenceId only), and
  prior-auth-web D-001 (list rows carry the reference id only). If a question would change
  one, answer "out of scope: needs a recorded decision with sign-off".
- **Ownership questions get settled in Inception, not Construction.** For every new value
  or event, name the one repo that computes it, stores it, and emits it.
- **"Not yet defined" is a legitimate answer.** Pick it, name an owner, and the engine
  carries it as an open question instead of inventing a default.

---

## Phase 1 — Ideation (runbook step 02)

### 1.1 Intent Capture

| Topic | Answer given in the reference run | Seat |
|---|---|---|
| Problem | Regulatory: CMS-0057-F requires expedited (urgent) decisions within 72 hours from 2026-01-01 for MA, Medicaid and exchange lines. Compliance owns the exact reading. | UM director, confirmed by compliance |
| Who marks urgent | The provider, at submission; v1 takes it as-is. No nurse downgrade in v1. | UM director |
| Clock start | When the request is **complete**. An incomplete request shows "clock not started", and the provider is told what is missing. | UM director, confirmed by compliance |
| Primary customer | Members are the reason. Nurse reviewers are the primary v1 user. | PO |
| Success metrics | 100% of urgent determinations within 72h of becoming complete; zero misses a month. Standard requests: 100% within 7 calendar days. "Clock not started" requests reported weekly by age; provider told what's missing within 1 business day. | UM director |
| Why now | The CMS-0057-F timeframes are already in effect. Current exposure is unknown, so it's an open question for compliance. | PO / compliance |
| Stakeholders | Nurses and supervisor, nurse lead, medical director and clinical policy group, privacy office, provider relations, compliance. Not benefits operations (eligibility doesn't change). | PO |
| Final say | PO, with compliance signing off the regulatory reading | UM director |
| At-risk alert goes to | The assigned nurse **and** the nurse supervisor, 24h before decisionDueAt | Nurse lead |
| Standard requests | One clock for every request: standard gets a 7-calendar-day due date, notices and the at-risk alert. Only queue priority is urgent-only. | PO + UM director |
| Left out of v1 | Real notification channels (v1 writes notices to an outbox through one delivery adapter; channels stay with provider relations); re-scoring after a determination (open in prior-auth-api); new member-facing screens | PO |

**The moment worth noticing.** Saying "the alert carries urgency" made the engine stop and
ask whether that breaks prior-auth-api D-003. Nobody told it to check; the steering rule in
`memory/project.md` and the plugin overlay did. The answer the room gave:

> D-003 covers notices **to members and providers**. The at-risk alert goes only to nurses
> inside the authenticated workflow, so it may carry referenceId, urgency and
> decisionDueAt, never clinical content. This is compliance's reading, pending privacy
> office confirmation. Fallback if privacy declines: the alert carries referenceId and
> status only, and urgency is seen on the authenticated screen.

**At the review gate.** The product-lead reviewer agent raised 3 major and 3 minor findings.
The room fixed the ones that needed facts only a human had (fallback, standard-request
target, current exposure) with **Request Changes**, rather than approving with open findings.

### 1.2–1.7 Market research, feasibility, scope, team, mockups, approval

| Topic | Answer | Seat |
|---|---|---|
| Build vs buy | Build: the clock and queue order live in prior-auth-api, which we own. No vendor UM product is in scope. | Tech lead |
| Feasibility | Feasible in two bolts; no new infrastructure; runs locally for this practice run | Tech lead |
| Scope | Three repos: prior-auth-api (brownfield), prior-auth-web (brownfield), prior-auth-notify (greenfield, empty) | PO |
| Team | One conductor runs Construction; each repo lead reviews their unit (team-owned units need a single-repo intent in v2.11) | Tech lead |
| Rough mockups | Queue: urgency badge plus countdown on each row, URGENT rows first and then by due time; reference id only per web D-001 | web lead + nurse lead |
| Initiative brief (1.7) | Approve → create the Rally Feature (by hand) | PO (sponsor) |

---

## Phase 2 — Inception (runbook steps 03–07)

| Stage | Answer the reference run gave | Seat |
|---|---|---|
| 2.1 Reverse Engineering | Approve each repo's codekb after its lead checks it. The web lead checks `api-documentation.md` describes what the web app *calls* (today: static sample rows; no live API yet). | api lead, web lead |
| 2.2 Practices Discovery | Promote: TypeScript strict; snake_case sentence test names; cite D-ids in code `// (D-00n)`; plan before code; one unit = one repo | Tech lead |
| 2.3 Requirements — clock start | **B**: when the request is complete. Incomplete shows "clock not started". | UM director + compliance |
| 2.3 Requirements — clock owner | **A**: prior-auth-api computes `decisionDueAt`; web and notify only read it. One clock, one owner. | api lead (whole room agrees) |
| 2.3 Requirements — clock math | URGENT: `completeAt + 72h`. STANDARD: `completeAt + 7 calendar days`. | UM director |
| 2.3 Requirements — queue order | URGENT first, then `decisionDueAt` ascending (not createdAt) | Nurse lead |
| 2.3 Requirements — events | `determination.issued {referenceId, status, issuedAt}`; `sla.at-risk {referenceId, urgency, decisionDueAt}` fires 24h before due if no determination | api lead + compliance |
| 2.3 Requirements — backward compatibility | `urgency` defaults to STANDARD; `decisionDueAt` is null until complete; old clients keep working | api lead |
| 2.4 User Stories | Approve when each story names a persona from the stakeholder map and has testable acceptance criteria | PO |
| 2.5 Refined Mockups | Badge text "Urgent"; countdown "Due in 41h" / "Overdue 3h" / "Clock not started" | web lead + nurse lead |
| 2.6 Domain Design | Approve; the ADR log must record "one clock owner" and "alert payload per compliance reading" | Architect |
| 2.7 Units Generation | Three units, **one per repo**: U1 `api-urgency-clock` (prior-auth-api), U2 `notify-service` (prior-auth-notify), U3 `web-urgent-queue` (prior-auth-web). Reject any unit that spans two repos. | Tech lead |
| 2.8 Contract Design | C-1 AuthRequest gains `urgency` + `decisionDueAt`; C-2 `determination.issued`; C-3 `sla.at-risk`. Version **v1.1.0**, published by U1 into `prior-auth-api/contracts/`; U2 and U3 pin it. | api, web and notify leads |
| 2.9 Delivery Planning | Bolt 1: U1, with a walking skeleton first (urgency stored and returned), checkpoint, then the rest. Bolt 2: U2 then U3, one unit at a time (unit-major, solo). | Tech lead + PO |
| After 2.9 | Run the `rally-draft` skill, import the CSV by hand, fill `rally-map.md` | PO / scrum master |

---

## Phase 3 — Construction (runbook steps 08–09)

| Gate | What the room checks before "Approve" | Seat |
|---|---|---|
| Functional / NFR design per unit | The unit names exactly one repo; it cites the D-ids it depends on | Owning repo lead |
| Infrastructure design | **This practice run has no cloud.** Answer: "local only: Node processes and files; document what production would need, provision nothing". | Tech lead |
| Code-generation plan | Run `repo-plan-reviewer` first. Approve only if: D-001's test `auto_approves_exactly_at_threshold` stays; no clinical fields in events or notices; nothing imported across repos; contract version pinned | Owning repo lead |
| Unit checkpoint | `npm test` and `npm run typecheck` output pasted and green in the owning repo | Owning repo lead |
| 3.6 Build and Test | Provider contract test (api serves v1.1.0); consumer tests in web and notify (including `urgency` absent); one end-to-end path recorded | QA lead |
| 3.7 CI pipeline | A local script or a GitHub Actions file per repo is fine; nothing is pushed | Tech lead |

Testing a "try this": at any code-generation plan gate, reply
`Request Changes: set AUTO_APPROVE_THRESHOLD to 0.80 so more urgent requests auto-approve`.
The engine should refuse and quote D-001. That refusal is the steering working.

---

## Phase 4 — Operation (runbook step 10)

| Stage | Answer for this practice run | Seat |
|---|---|---|
| Deployment pipeline / environment | Local only. Deploy order is still api → notify → web, because the contract is additive. | Release owner |
| Deployment execution | Build and test each repo, then run the local smoke test. Record it in `deployment-log.md` as a local run, not a production deploy. | Release owner |
| Observability | SLO: share of URGENT requests determined within 72h of becoming complete. Early warning: the `sla.at-risk` alarm. | UM director + on-call |
| Incident response | Runbook entry for "sla.at-risk fired": who looks, what they check, when to escalate | On-call |
| Close-out | Copy each ADR that constrains a repo into that repo's `docs/decisions.md` as a new entry linking back to the intent (the decision-log guard will ask you to confirm each edit; that's expected) | Tech lead + PO |

---

## Where the reference run left this sheet

The sheet is what the room planned to say. In three places the run went differently, and
each time it was the recorded decisions, not the sheet, that won. Expect the same in your
run. When it happens, write the new decision down; don't force the sheet.

| Where | The sheet said | What happened, and why |
|---|---|---|
| 2.4–2.5 stories and mockups | An "Urgent" badge on each queue row | Dropped. prior-auth-web D-001 says list rows carry the reference id, procedure code, dates and status only. US4.5 is parked behind open item I-1 (a new web decision with privacy sign-off). Urgency shows through queue order only. |
| U1 code generation, Step 21 | `sla.at-risk {referenceId, urgency, decisionDueAt}`; `determination.issued` adds `issuedAt` | The privacy office had not confirmed the reading before first publication, so the fallback agreed in Ideation applied. Contract v1.1.0 publishes both events as `{referenceId, status}` only. Recorded as prior-auth-api **D-014**. |
| U1 code generation, gate Q-1 | Nothing | A race the sheet never imagined: an alert claimed while pending but published after a nurse decides. The room answered "drop it, never relabel it". Recorded as prior-auth-api **D-015**, which the decision-log guard made a human paste by hand. |
