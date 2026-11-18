# Prototype walkthrough — engineer handover notes

Scenario A. All data is synthetic and labelled as made up.

## The three files

**`data.js`** (238 lines) is the test harness data. Four made-up policy pages, eight enquiries, nine canned snippets, a tone guide and an escalation list. Every string is labelled "(made up)." Each enquiry carries its own pre-written draft lines, citations, confidence flags, and a rationale. Two deliberate errors are planted: a wrong $5 fee in enq-06's draft (contradicted by the cited passage), and a stale snippet (snip-03) that says the same wrong thing. The data also carries the Expand-prompt additions: six topics, dates, authors, and a `FORCED_LOOKUP_FAILURE` flag that makes five fee-related enquiries fail their policy lookup.

**`index.html`** (676 lines) is a single self-contained HTML file: CSS, layout and all logic in one `<script>` block. It renders the inbox, three-pane reply screen (enquiry, draft, citation), snippet mode, filters, the lookup-failure flow, and a measurement system with a 10-minute clock, per-enquiry timing, and kill-switch detection. No dependencies, no build step, no server needed — double-click to open.

**`README.md`** (45 lines) documents what the prototype tests, the eight enquiry scenarios, the measurement system and kill switches, and where to put the results.

## What an engineer would inherit

1. **A working clickable test.** The prototype covers eight distinct scenarios (standard draft, low confidence, image handoff, planted error, multi-topic, escalation, follow-up, lookup failure). An officer can run a timed test session in both modes and get a results table comparing them.

2. **Built-in measurement.** The code tracks time-to-decision, citations opened, words changed, and planted-error survival — per enquiry, per mode. Three kill switches fire automatically. This is ready to hand to a tester.

3. **Clean data separation.** All test data is in `data.js`, all UI and logic in `index.html`. An engineer can swap in different enquiries, policy pages or error scenarios without touching the rendering code.

4. **No infrastructure.** No server, no API key, no build tool, no database. The prototype is two files and a README.

## What would worry them

1. **676 lines of unstructured JavaScript in one file.** There is no separation between rendering, state management, measurement, and event handling. Every function reads and writes global variables (`activeId`, `editing`, `approved`, `lookupState`, `officerText`...). An engineer inheriting this would struggle to change one feature without breaking another. The IIFE wrapper around the lookup-failure block (lines 475–503) is a workaround for a scoping conflict — a sign the code has outgrown a single-file approach.

2. **DOM rebuilt on every interaction.** `render()` calls `renderInbox()` + `renderModeSwitch()` + `renderClock()` + `renderMain()`, which clear and rebuild the entire page from scratch. This loses focus, cursor position and scroll state. The `officerText` save-before-render pattern is a band-aid for the cursor problem. At eight enquiries this is fast enough, but the pattern would not survive a real inbox size.

3. **Fee detection is a keyword regex.** `isFeeEnquiry` matches "fee|cost|charg|price|refund|deposit|how much|payment" against the enquiry body. This catches five enquiries today, but in production any enquiry that happens to contain "how much" or "deposit" would trigger a forced failure. The function has no tests and no way to override per-enquiry.

4. **Planted error is hidden by the forced failure.** enq-06 (the $5 fee) is a fee enquiry, so the lookup failure hides its draft. The planted-error kill switch cannot fire for that enquiry while the forced failure is active. If a tester runs the full session, the results table will say "planted-error enquiry not decided" for draft mode — which looks like the tester skipped it, not that the prototype blocked it.

5. **No automated tests.** There is no test file. The only way to verify the prototype works is to open it in a browser and click through. An engineer making a change has no safety net.

6. **Measurement only tracks draft mode citations.** `track[id].draft.citesOpened` increments on click, but the lookup-failure flow has no citations to open. If an officer approves a failure-state reply, the results table will show "0 citations opened" and may incorrectly fire the rubber-stamping kill switch (approved without opening a citation), even though there were no citations to open.

7. **State does not reset between modes.** If the officer approves a reply in draft mode, switches to snippet mode, then switches back, the approval still shows. The `approved` and `snippetApproved` objects are separate, but `editedText` and `officerText` persist across mode switches. This is fine for a test session but would confuse a tester who expects a clean slate.

8. **Hardcoded dates.** `PROTO_TODAY` is computed as the latest `receivedDate` in the data (18 Nov 2026). The date filter ("Today", "Last 3 days") works relative to that date, not the real date. This is intentional for a stable demo, but an engineer would need to know it — the "Today" filter will never match if they add a new enquiry without also updating the dates.

## Bottom line

The prototype is good for what it is — a one-day validation tool. An engineer picking it up for a pilot would need to refactor the state management, add tests, and fix the planted-error/lookup-failure conflict before trusting the measurement results.
