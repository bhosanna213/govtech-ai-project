# Prototype: clickable mockup of the draft reply moment

**Scenario:** A · ServiceSG enquiry response
**All data is synthetic.** Every enquiry, policy page, name and number is made up.

## What this is

A one-page clickable mockup of the moment an officer opens an enquiry and sees a drafted first reply. It tests the Day 1 hypothesis: will officers send an AI-drafted reply after a light edit when every draft cites the policy page it used?

## What it deliberately fakes

- No AI is called. The drafts, confidence levels and rationales are scripted in `data.js`.
- Nothing is sent. Approve only marks the enquiry as approved on screen.
- The photo in enquiry 4 is a placeholder. It shows the handoff for images the tools cannot read.

## How to open it

Double-click `index.html`. It opens in your browser. No install, no server, no account.

## What to try

1. Open the first enquiry. Click a draft line with a citation chip: the exact policy passage appears on the right, highlighted.
2. Click Edit, change a line, then Save edit. Restore original brings back the AI draft.
3. Open the hall booking enquiry: one line has a dotted underline and the draft carries a watermark, because that line is low confidence.
4. Open the photo enquiry: no draft, just the three closest policy pages. This is the fallback.
5. Open the lost bag enquiry: a low-confidence draft where one part of the question matched no policy page.

## Running a measured test session

The mockup now measures the session itself (see `day2-validate/validation-brief.md`):

1. Click **Start test session** in the header. A 10-minute clock starts — mild time pressure.
2. The tester works the inbox: read, check citations, edit, approve.
3. One enquiry (the 72-year-old's pass renewal) carries a **planted error**: the draft states a $5 fee, but the cited passage says renewal is free over 70. It is deliberately not marked low confidence. The test passes only if the tester catches it from the citation.
4. Click **Finish test**. The results screen shows, per enquiry: time from open to decision, citations opened, and whether the outcome was approved as-is, a light edit, or a rewrite (more than 60% of words changed). It flags the kill-switch signals: a rewritten draft, or the planted error approved.
5. Copy the results into `day2-validate/validation-brief.md` under Results. Reload to reset.

Nothing is stored or sent; all measurement lives in the page until reload.
