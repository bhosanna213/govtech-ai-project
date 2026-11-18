# Living PRD — ServiceSG enquiry response (Scenario A)

Extracted from the working prototype in `day2-validate/prototype/`. All data is synthetic and labelled as made up.

---

## 1. Product overview

An AI drafting assistant for ServiceSG enquiry officers. The officer opens a shared inbox of resident enquiries. For each enquiry the system retrieves the matching policy page and drafts a first reply with inline citations. The officer reads the draft, opens the cited passage to check it, edits if needed, and approves. The system never sends a reply without officer approval.

The prototype tests this idea with eight synthetic enquiries, four made-up policy pages, nine canned snippets and a built-in measurement system. It is a single HTML file plus a data file — no server, no API key, no AI model called. Drafts are scripted, not generated.

---

## 2. Problem and riskiest assumption

### The problem

Officers spend roughly 10 minutes per enquiry searching policy pages before they can write a reply. The inbox is busiest after a policy change, which is exactly when the pages are most likely stale. A wrong reply — a wrong fee, a missed deadline — carries the agency's name.

### Four riskiest assumptions (from `build-log.md`)

1. **Officers trust a cited draft enough to edit it.** Kill switch: stuck for 30 seconds on the core action, or more than 60% of words rewritten. Success: at least 4 of 5 drafts approved after a light edit.

2. **The cited policy pages are current and correct.** Kill switch: a planted stale-fee error is approved and would reach a resident. Success: the planted error is caught using the citation, under the session clock. Tested with enq-06 ($5 renewal fee; cited passage says free over 70) and pol-001 (last reviewed 15 Jul 2026, more than 90 days ago).

3. **A cited draft beats canned snippets.** Kill switch: snippet mode matches draft mode on speed and error-catching. Success: draft mode is faster to an approved correct reply, or catches the planted error where snippet mode misses its stale snippet (snip-03).

4. **Officers read before approving under pressure.** Kill switch: any draft approved with zero citations opened. Success: every draft-mode approval is preceded by at least one opened citation.

---

## 3. User flow and screen map

### Screen layout

Three-pane layout: inbox on the left (304 px), main content in the centre, citation panel on the right. A header bar holds the mode switch (AI draft / Snippets) and the session clock.

### Inbox pane

- Lists eight enquiries with subject, sender, date, topic tag and confidence badge.
- Three filter dropdowns: topic (6 topics + Others), date (Today / Last 3 days / Last 7 days / Older), author. Each shows a count. Combined filters work. Zero matches show "No enquiries match these filters."
- Dates are relative to `PROTO_TODAY` (18 Nov 2026), not the real date.
- Click an enquiry to open it.

### Main flow — AI draft mode

1. **Standard draft** (enq-01, enq-02, enq-03, enq-05): Draft lines shown with citation chips. Click a chip to highlight the cited passage on the right. Low-confidence lines have a dotted underline and a warning banner. Officer can Approve, Edit or Restore original.

2. **Image handoff** (enq-04): No draft produced. The three closest policy pages are listed. The officer writes the reply.

3. **Planted error** (enq-06): Draft says $5 renewal fee; the cited passage says free for residents 70 and above. The line is not flagged low-confidence. The test passes only if the officer opens the citation and catches the contradiction.

4. **Escalation** (enq-07): Matches the escalation list (complaints about staff). No draft. The escalation list is shown and the case is routed to a human lead.

5. **Follow-up** (enq-08): Draft acknowledges a prior phone call. The 5-day refund timeline from the call is not in any policy page, so the draft does not confirm it and flags that line as low confidence. Prior correspondence is shown in the enquiry pane.

6. **Lookup failure** (fee enquiries when `FORCED_LOOKUP_FAILURE` is true): Five enquiries (enq-01, enq-02, enq-03, enq-06, enq-08) show "Policy lookup failed" instead of a draft. The officer types a reply. Text survives retries and switching between enquiries. Retry runs a 1.5-second simulated lookup then fails again. After 3 total failures the message says "write the reply manually." The citation pane is empty.

### Main flow — Snippet mode

No AI draft. The officer composes the reply by clicking canned snippets from a folder of nine. One snippet (snip-03, renewal fee $5) is deliberately stale, mirroring the planted citation error. The officer approves when done.

### Results screen

Click "Finish test" to see a results table comparing both modes. Per enquiry, per mode: time from first open to decision, citations opened, share of words changed, whether the planted error survived. Three kill-switch signals flagged automatically.

---

## 4. Success metrics

All metrics come from the prototype's built-in measurement system (`track` object, per enquiry, per mode).

| Metric | How it is measured | Kill-switch line |
|---|---|---|
| Time to decision | `firstOpen` to `decidedAt` (milliseconds, shown as seconds) | None; compared across modes in the head-to-head |
| Citations opened | `citesOpened` incremented on click of a cited draft line | 0 citations opened on an approved draft = rubber-stamping |
| Words changed | Bag-of-words comparison: `changedShare()` returns 0 to 1 | > 0.6 (60%) = rewritten; the officer did not trust the draft |
| Planted error caught | `plantedErrorSurvived()` checks if "$5" and "fee" survive in the approved text | Error approved = kill switch |
| Stale snippet caught | `snippetErrorSurvived()` checks the same claim in snippet mode | Error approved = kill switch |

The session clock runs for 10 minutes to create mild time pressure.

---

## 5. Technical reality

### What exists today

- **`data.js`** (238 lines): Four policy pages (pol-001 deliberately stale), eight enquiries, nine canned snippets (snip-03 deliberately stale), a tone guide, an escalation list and six topics. Every string is labelled "(made up)."
- **`index.html`** (676 lines): Self-contained HTML + CSS + JS. CSS custom properties for theming. Full render-on-every-interaction via `render()` calling `renderInbox()` + `renderModeSwitch()` + `renderClock()` + `renderMain()`. All state is in global variables.
- **`README.md`** (45 lines): Documents the eight scenarios, measurement system, kill switches and data files.

### Key technical facts

- **No AI is called.** Drafts are scripted in `data.js`. The prototype tests the officer's behaviour, not the model's output.
- **No server.** The file opens by double-click. No install, no build, no dependencies.
- **No persistence.** All state lives in JS variables and resets on page reload.
- **Fee detection** uses a keyword regex: `/(fee|cost|charg|price|refund|deposit|how much|payment)/`. This is a prototype shortcut, not a production approach.
- **DOM is rebuilt from scratch** on every interaction. The `officerText` save-before-render pattern works around cursor-position loss.
- **Stale-page detection**: `isStale(pageId)` flags pages with `lastReviewed` more than 90 days ago. pol-001 (15 Jul 2026) is the only stale page.
- **Variable scoping**: The lookup-failure block (lines 474–505) is wrapped in an IIFE to avoid `var`/`const` conflicts in `renderMain()`.

### What does not exist

- No backend, no database, no authentication.
- No automated tests.
- No real AI model integration.
- No image reading — enq-04 is a manual handoff.
- No persistence across sessions.
- No accessibility audit beyond `prefers-reduced-motion` and `:focus-visible`.

---

## 6. Assumptions and risks

### Assumptions the prototype makes

1. Eight enquiries are enough to test the four riskiest assumptions.
2. Scripted drafts behave like real AI output for the purpose of measuring officer trust.
3. A 10-minute clock creates enough pressure to reveal rubber-stamping.
4. Keyword regex for fee detection covers the test data.
5. Bag-of-words word-change comparison is a reasonable proxy for "light edit vs. rewrite."

### Risks found during prototyping

1. **Planted error hidden by lookup failure.** enq-06 is a fee enquiry, so its draft is never shown while the forced failure is active. The planted-error kill switch cannot fire for that enquiry. The results table says "planted-error enquiry not decided," which looks like the tester skipped it.

2. **Measurement gap for lookup-failure approvals.** The failure flow has no citations to open. If an officer approves a failure-state reply, the results table shows "0 citations opened" and may fire the rubber-stamping kill switch even though there were no citations to open.

3. **State bleeds across modes.** `editedText` and `officerText` persist when the officer switches between AI draft and Snippet mode. Approvals are mode-specific (`approved` vs `snippetApproved`), but text is shared. A tester expecting a clean slate between modes will see leftover edits.

4. **Hardcoded dates.** `PROTO_TODAY` is computed from the data (18 Nov 2026). The date filter works relative to that date, not the real date. Adding a new enquiry without updating dates will make the "Today" filter miss it.

---

## 7. In and out of scope

### In scope (what the prototype covers)

- Cited first-reply drafting for text-based enquiries.
- Side-by-side citation with page freshness and stale-page warnings.
- Officer editing, approving and restoring original drafts.
- Escalation detection and routing (no draft produced).
- Follow-up acknowledgement (prior correspondence shown, unverified claims flagged).
- Head-to-head comparison: AI draft vs. canned snippets.
- Measurement: time to decision, citations opened, words changed, planted error caught, rubber-stamping detected.
- Inbox filtering by topic, date and author.
- Lookup failure handling with retry and manual fallback.

### Out of scope (the prototype does not cover)

- Real AI model calls or retrieval.
- Image or attachment reading (enq-04 is a manual handoff; 1 in 5 enquiries has an image, capping AI coverage at 80%).
- Multi-language enquiries.
- Real-time collaboration or queue assignment.
- Sending replies to residents.
- Audit trail or logging beyond the in-session results table.
- Mobile or tablet layout.
- Authentication, roles or access control.
- Volume testing (the prototype has 8 enquiries; a real inbox has hundreds).

---

## 8. Engineering recommendation

### What to keep

1. **Data separation.** Policy pages, enquiries, snippets and tone rules live in `data.js`. An engineer can swap test data without touching the UI.
2. **Measurement design.** Per-enquiry, per-mode tracking of time, citations and word changes. Three kill switches that fire automatically. This is ready to hand to a tester.
3. **Scenario coverage.** Eight enquiries exercise six distinct situations (standard, low confidence, image handoff, planted error, escalation, follow-up, lookup failure). The head-to-head and planted error are well-designed validation instruments.

### What to fix before a pilot

1. **Separate concerns.** 676 lines of mixed rendering, state and measurement in one file. Extract state management, event handling and measurement into separate modules before adding features.
2. **Stop rebuilding the DOM.** Replace the full-page `render()` with targeted updates. The officer's cursor, scroll position and focus should survive a state change.
3. **Replace the keyword regex.** `isFeeEnquiry` is a prototype shortcut. In production, fee detection should come from the AI model's topic classification or from a tag on the enquiry, not a regex on the body text.
4. **Resolve the planted-error/lookup-failure conflict.** Either make the forced failure toggleable per enquiry, or add a separate planted-error enquiry that is not about fees.
5. **Add automated tests.** There is no test file. At minimum, test the measurement functions (`changedShare`, `plantedErrorSurvived`, `isFeeEnquiry`, `isStale`) and the kill-switch logic.
6. **Fix the measurement gap.** Lookup-failure approvals should not trigger the rubber-stamping kill switch. Track "no citations available" separately from "citations available but not opened."
7. **Reset state between modes.** Either warn the tester that text carries over, or clear `editedText` and `officerText` on mode switch.

### What to build for a pilot

- Real retrieval from an indexed policy store (the prototype's `POLICY_PAGES` structure is a reasonable schema to start from).
- Real AI drafting with citation grounding (the `draft` array structure — text, cite, low-confidence flag — is a good contract).
- Persistence: officer edits, approvals and measurement data saved to a backend.
- Accountability note: trace a wrong reply to its source (stale page, bad draft, rushed approval), each with its own owner and fix, agreed with the frontline director before the pilot starts.
