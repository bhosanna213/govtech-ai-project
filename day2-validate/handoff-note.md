# Handoff note — engineer starting point

Scenario A · ServiceSG enquiry response. All data is synthetic.

## What this is

A clickable prototype that tests whether officers trust an AI-drafted reply enough to edit it instead of starting over. Eight synthetic enquiries, four made-up policy pages, scripted drafts with inline citations, a head-to-head against canned snippets, and a built-in measurement system with three kill switches. No AI is called, no server needed, no API key.

## Files and how to run

| File | What it does |
|---|---|
| `prototype/index.html` | Layout, rendering, state and measurement — 676 lines, self-contained |
| `prototype/data.js` | Policy pages, enquiries, snippets, tone guide, escalation list — 238 lines |
| `prototype/README.md` | Documents the eight scenarios, measurement and kill switches |

Double-click `index.html` to open. No install, no build step.

## What works

- Eight enquiries covering six situations: standard draft, low confidence, image handoff, planted error, escalation, follow-up with prior correspondence, and lookup failure.
- Two modes: AI draft (cited drafts, officer edits) and Snippets (canned text-expander folder).
- Inbox filtering by topic, date and author with counts.
- 10-minute session clock for mild time pressure.
- Per-enquiry tracking: time to decision, citations opened, words changed.
- Three kill switches fire automatically: planted error approved, draft rewritten (>60% words changed), draft approved without opening a citation.
- Results screen comparing both modes side by side.

## Known issues

1. **Planted error hidden.** enq-06 (the $5 fee error) is a fee enquiry, so the forced lookup failure hides its draft. The planted-error kill switch cannot fire for that enquiry while the failure is active.
2. **Rubber-stamp false positive.** The lookup-failure flow has no citations to open. Approving a failure-state reply shows "0 citations opened" and may trigger the rubber-stamping kill switch even though there were no citations available.
3. **State bleeds across modes.** Officer text (`editedText`, `officerText`) persists when switching between AI draft and Snippet mode. Approvals are mode-specific but text is shared.
4. **Hardcoded dates.** `PROTO_TODAY` is the latest `receivedDate` in the data (18 Nov 2026). Date filters work relative to that, not today's date. Adding an enquiry without updating dates breaks the "Today" filter.

## First things to do

1. **Separate concerns.** Extract state, event handling and measurement out of `index.html` into modules.
2. **Add tests.** No test file exists. Start with `changedShare`, `plantedErrorSurvived`, `isFeeEnquiry`, `isStale` and the kill-switch logic.
3. **Fix the planted-error conflict.** Make the forced failure toggleable per enquiry, or add a non-fee planted-error enquiry.
4. **Fix the measurement gap.** Track "no citations available" separately from "citations available but not opened."

## Where to find more

- **`living-prd.md`** — full Living PRD with eight building blocks: product overview, problem, user flow, metrics, technical reality, risks, scope, engineering recommendation.
- **`build-log.md`** — change history and the four riskiest assumptions with kill switches.
- **`validation-brief.md`** — what the test must prove and results (once sessions are run).
- **`PROMPTS.md`** — the three-prompt chain (Expand, Behavior, Refine) and what worked and broke.
