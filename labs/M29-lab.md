# Lab M29 — Audit a pod charter, then build the next pod

> Module: M29 — Team Topology & Rituals
> Audience: leader · Estimated time: 25 min
> Domain: Prior Auth Portal (pod design, ritual calendar, role shifts)

## Path A — Understand It (no tooling required)

**Artifact:** the portal pod's charter, one bolt in.

```text
POD: portal (5 seats)
  decider     A. Reyes (PO) — policy + member-facing semantics
  engineers   3 — one unit of work per session (M16)
  SME         R. Okafor (nurse) — clinical semantics; hotline:
              answers within the hour on bolt days
  engines     per docs/M22-engine-policy.md
CALENDAR      mob elab (bolt open) · checkpoints per UW ·
              mob construction per increment · close
LEADER METRICS (this bolt)
  decision latency, median      22 min
  checkpoint audit              2 gates rubber-stamping
                                (lint approvals; batch typo
                                dispositions unread)
```

**Trace it:**
1. Check the charter against the sizing rule (every decision-owner reachable in
   minutes).
2. Diagnose the two rubber-stamping gates using M17's economics.
3. Decide which levers behind the 22-minute latency belong to leadership.

**Check yourself:**
1. Does the charter satisfy the sizing rule — and what would break it?
2. What should the leader do about the two rubber-stamping gates?
3. Why is decision latency a leadership metric rather than a team metric?

<details><summary>Answers</summary>

1. Yes: every jurisdiction the portal's decisions touch has a named, reachable owner.
   Adding a sixth engineer wouldn't break it; adding a second decision domain (say,
   claims) would — that's a new pod, split at the seam.
2. M17's economics: a rubber-stamped gate is worse than no gate (it launders risk as
   review) — demote both to machine gates (lint is free) and batch dispositions into
   one real weekly read, then re-audit next close.
3. Because the levers are leadership levers: jurisdiction clarity, calendar
   protection, and decider availability — a team can't unblock a decider the VP
   keeps booking.

</details>

## Path B — Lead It (decision exercise)

**Scenario:** cycle 2 needs a second pod for the provider-visibility UI
(prior-auth-web).

```text
ROSTER  Chen (sr FE eng, React) · Dee (jr FE eng) ·
        Marta (PO, provider relations background) ·
        Sam (QA lead, fears "being automated away") ·
        Priya (architect, 20% available) ·
        Okafor (nurse SME, already on pod 1) ·
        Ibrahim (BE eng from pod 1) · Lena (designer)
```

**Your task:**
1. Pick the five seats; name each jurisdiction — and solve SME coverage without
   double-booking Okafor.
2. Draft the one-bolt ritual calendar including hotline terms.
3. Script the role-shift conversation with Sam — reframe QA to gate designer with
   two concrete new responsibilities.
4. Marta is pod 2's only decider across three lanes. Draft her decision-rights ladder —
   what's pre-decided in the chain, what she delegates and to whom, what she reserves —
   so three simultaneous questions don't queue on her.

**Compare:** <details><summary>A worked answer</summary>

*Seats:* Marta (decider — provider-facing semantics are her jurisdiction), Chen +
Dee + Ibrahim (engineers — Ibrahim carries pod-1 context and the API seams), Sam
(gate designer). Priya stays cross-pod at 20% as contract pinner for the API seam — a
shared seam judge, not a pod member. Lena joins Mob Elaborations for UI epics by
invitation (jurisdiction: provider workflow), not as a standing seat. SME coverage:
provider-visibility decisions rarely need clinical jurisdiction — Okafor's hotline
extends to pod 2 for the two UWs that touch determination display, documented in the
charter rather than a sixth seat.

*Calendar:* bolt open Mob Elaboration (50 min, decision rule enforced); construction
sessions one UW each; Mob Construction per increment with Sam sampling spot-explains;
close writes to the chain. Hotline: Okafor answers within the hour on the two flagged
UWs; Marta same-hour for provider semantics.

*Sam:* "Nobody automated judgment — we automated typing. Two things are now yours
that didn't exist before: you own the gate stack — which checks run, in what order,
and the bolt-close audit of which gates rubber-stamp; and you own understanding
verification — spot-explain sampling at every review. The suite the engines generate
is your raw material, not your replacement."

*Marta's ladder:* **Pre-decided** — provider-visibility copy standards, the
notification status-plus-reference-id rule (D-003), and the determination-display
fields live in the chain, so lane questions about them answer themselves.
**Delegated** — Chen (senior FE) rules on component and interface shapes; Priya owns
the API seams at 20%; Lena rules on provider-workflow UX by standing delegation, each
recorded like any call. **Reserved** — anything that sets a provider's expectation the
plan must honor (what a provider is told about a pending auth), plus any change
touching determination semantics, stays Marta's, answered within the hour. Three
lanes, but only the reserved rung ever converges on her — and it rarely fires twice in
an afternoon.

</details>

## Done when

- [ ] Your pod satisfies the sizing rule with named jurisdictions, and the SME
      coverage plan avoids double-booking.
- [ ] The ritual calendar covers one bolt with hotline terms and protected
      timeboxes.
- [ ] Sam's conversation lands two concrete new responsibilities, not reassurance.
- [ ] Marta's ladder sorts every recurring call into pre-decided, delegated, or
      reserved, so three lanes don't serialize on one decider.
