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

## What to measure in a test session

- Time to first meaningful action. The kill-switch line is 30 seconds.
- Whether the tester edits the draft or rewrites it from scratch.
- Whether the tester uses Restore original.

Record results in `day2-validate/validation-brief.md`.
