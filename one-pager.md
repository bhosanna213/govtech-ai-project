# One Pager

Use case: Scenario A · ServiceSG enquiry response. All data in this document is synthetic.

## Problem and user

ServiceSG officers work a shared enquiry inbox during office hours, busiest in the week after a policy change. They search policy pages before they can reply, so first replies run well past the one-day target. The goal: residents get a correct first reply within one working day.

## Opportunity and evidence

Officers say the policy search takes longer than writing the reply, and enquiries with photos mean retyping what the image says (synthetic quotes in `day1-discover-define/opportunity.md`). Baseline metrics are in the same file: enquiries answered within SLA, average first-reply time, share of enquiries with an image, and minutes per policy search. An AI draft that cites the policy page it used could cut the search time out of every first reply.

## Experience and trust

The moment: an officer opens an enquiry and sees a relevant, clear drafted first reply. The officer sees the draft, the policy passage cited next to each line, and Approve, Edit and Restore original buttons. Trust gaps to design for: hallucinated fees, not seeing which passage a sentence came from, and not being able to undo an AI change to the officer's own wording. Full flow in `day1-discover-define/ai-ux-flow.md`.

## Risks (market, technical, team)

- Usability risk is the main one: will officers edit a cited draft, or rewrite it from scratch? Plan: build a clickable mockup first.
- Technical: some enquiries include images the current tools cannot read. Drafts must not state fees, dates or deadlines unless the cited page states them.
- Market and team risks: not yet assessed. To be filled in Day 2 (validate).

## Build plan and handoff

Not started. To be filled in Day 3 (build).

## Agent role and guardrails

The agent is a drafting assistant for enquiry officers: it finds the right policy passage, drafts a first reply with citations, and flags enquiries that need a senior officer. Guardrails: cite a source for every claim, mark ambiguous outputs NEEDS CLARIFICATION instead of guessing, never invent names or PII, never send a citizen-facing reply, output drafts only, and hand off law enforcement, legal or regulator matters to a human lead. Full skill file in `day1-discover-define/skill-file.md`.

## Roles and operating model

An officer approves every reply before it goes out. Below the confidence threshold the AI produces no draft; the enquiry goes to an officer with the three closest policy pages. Other roles: to be filled in Day 2.

## Strategy and roadmap

Not started. To be filled in Day 2 (validate) and Day 3 (build).

## Metrics plan and stop line

Pilot test: two weeks, pass if officers send 7 in 10 drafted replies after a light edit, fail below 5 in 10. Trust metric: accept-as-is rate, checked weekly, target 6 in 10 by end of pilot. Stop line (kill switch): if officers do not trust a cited draft enough to edit it — they get stuck on the core action within 30 seconds or rewrite most of the draft — stop and rethink.

## Evals and gates

Not started. To be filled in Day 4 (measure).

## Decision: continue, pivot or stop

Not yet decided. The usability test against the pass/fail line above will drive this.

## Open issues

- Enquiries with images: about 1 in 5 enquiries include a photo the current tools cannot read. Not yet addressed in the flow.
- The metric values in `day1-discover-define/opportunity.md` are not individually labelled as made up; the instructor may ask about this.
- Day 2 to Day 4 sections above are placeholders until those modules are done.
