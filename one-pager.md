# One Pager

Use case: Scenario A · ServiceSG enquiry response. All data in this document is synthetic.

## Problem and user

ServiceSG officers work a shared enquiry inbox during office hours, busiest in the week after a policy change. They search policy pages before they can reply, so first replies run well past the one-day target. An officer approves every reply, and some enquiries include images the current tools cannot read. The goal: residents get a correct first reply within one working day.

## Opportunity and evidence

Officers say the policy search takes longer than writing the reply, and enquiries with photos mean retyping what the image says (synthetic quotes in `day1-discover-define/opportunity.md`).

Status quo today (from the same file): enquiries answered within SLA 90%; average first reply 1 day; enquiries with an image 1 in 5; minutes per policy search 10.

By those numbers the SLA is largely met, so the case does not rest on rescuing the SLA. It rests on officer time: every first reply carries about 10 minutes of policy search. At a synthetic volume of 300 enquiries a day (made up), that is roughly 50 officer-hours a day an AI draft with citations could recover. The volume figure is a placeholder to be replaced with a validated one before any build decision.

## Experience and trust

The moment: an officer opens an enquiry and sees a relevant, clear drafted first reply. The officer sees the draft, the policy passage cited next to each line, and Approve, Edit and Restore original buttons. Trust gaps to design for: hallucinated fees, not seeing which passage a sentence came from, and not being able to undo an AI change to the officer's own wording. Full flow in `day1-discover-define/ai-ux-flow.md`.

## Risks (market, technical, team)

- Market: the shared enquiry inbox has no categorisation or filter, so officers struggle to find and triage messages before they can even start writing. If the real bottleneck is finding the right enquiry rather than drafting the reply, an AI draft solves the wrong problem. How we test it: in the prototype test session, time how long the tester spends reading and triaging each enquiry versus editing the draft. If triage time exceeds drafting time, the case for AI drafts weakens and the team should explore inbox categorisation first.
- Technical: the policy pages the AI cites may be stale, especially in the week after a policy change when the inbox is busiest. A draft that confidently cites a stale page creates false trust — worse than no draft. How we test it: the prototype plants a stale-page error (the draft states a $5 fee; the cited passage says renewal is free for residents over 70, and the page is flagged as stale). If the tester approves the planted error, the kill switch fires.
- Team: no one currently owns the policy pages the AI would cite. Without a named owner and a review cycle, pages go stale, drafts go wrong, and officers stop trusting the tool. How we test it: before the pilot, confirm a named policy-operations lead owns every cited page with a 90-day review cycle (documented in `day2-validate/context-skill.md`). If no owner is agreed, the pilot does not start.

## Build plan and handoff

Not started. To be filled in Day 3 (build).

## Agent role and guardrails

The agent is a drafting assistant for enquiry officers: it finds the right policy passage, drafts a first reply with citations, and flags enquiries that need a senior officer. Guardrails: cite a source for every claim, mark ambiguous outputs NEEDS CLARIFICATION instead of guessing, never invent names or PII, never send a citizen-facing reply, output drafts only, and hand off law enforcement, legal or regulator matters to a human lead. Full skill file in `day1-discover-define/skill-file.md`.

## Roles and operating model

An officer approves every reply before it goes out. Below the confidence threshold the AI produces no draft; the enquiry goes to an officer with the three closest policy pages.

Six roles govern the agent (roles, not people — one person may hold more than one):

| Role | What they do |
|---|---|
| Enquiry officer | Reviews drafts, opens citations, edits and approves replies |
| Supervisor | Oversees officers, gets notified on kill switches, can pause the agent manually |
| Policy team lead | Owns policy pages, sets the confidence threshold (0.70), maintains the escalation list |
| Frontline director | Sets kill-switch thresholds, session clock, escalation list sign-off |
| Engineering lead | Builds the system, chooses model and retrieval pipeline |
| Executive sponsor | Approves pilot, accountability table and go-live |

Decision rights summary (full table in `day3-build/operating-model.md`):

| Decision | Who decides |
|---|---|
| Scope and permissions | Frontline director |
| Vendor and model | Engineering lead (model), Policy team lead (threshold) |
| Go-live and retire | Executive sponsor |
| Incident | Supervisor (immediate), Frontline director (threshold changes) |

Accountability: a wrong reply belongs to its cause, not to whoever clicked Approve. Decided: stale page → policy team lead, bad draft → engineering lead, rushed approval → the approving officer's supervisor reviews the session log. The accountability table is agreed with the executive sponsor before the pilot.

Incident response: if a wrong answer reaches a resident, the supervisor pauses the agent manually (within 15 minutes), pulls the session log, and the officer sends a corrected reply the same day. The frontline director tells the executive sponsor within 24 hours and decides whether to unpause or escalate to retire. Full 8-step sequence in `day3-build/operating-model.md`.

## Strategy and roadmap

Not started. To be filled in Day 2 (validate) and Day 3 (build).

## Metrics plan and stop line

Pilot test: two weeks, pass if officers send 8 in 10 drafted replies after a light edit, fail below 5 in 10. Success signal: 8 in 10 drafts sent after a light edit by the end of the two-week pilot; the pilot start date is set once test sessions are scheduled (the earlier 20 Nov date was unrealistic and is withdrawn). Trust metric: accept-as-is rate, checked weekly, target 8 in 10 by end of pilot. Scale honesty: before the pilot, the fail line is translated into wrong-but-sent replies per week at the synthetic volume, for the sponsor to accept or reject. Stop line (kill switch): if officers do not trust a cited draft enough to edit it — they get stuck on the core action within 30 seconds or rewrite most of the draft — stop and rethink.

## Evals and gates

Not started. To be filled in Day 4 (measure).

## Decision: continue, pivot or stop

Not yet decided. The usability test against the pass/fail line above will drive this.

## Open issues

- Enquiries with images: about 1 in 5 enquiries include a photo the current tools cannot read. Not yet addressed in the flow.
- The metric values in `day1-discover-define/opportunity.md` are not individually labelled as made up; the instructor may ask about this.
- Day 2 to Day 4 sections above are placeholders until those modules are done.
