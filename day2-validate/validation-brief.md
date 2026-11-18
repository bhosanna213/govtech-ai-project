# Validation brief

**Scenario:** A · ServiceSG enquiry response
All data in the test is synthetic and labelled as made up.

## Assumption

Officers will send an AI-drafted first reply after a light edit when every draft cites the policy page it used. They trust the cited draft enough to fix it, not to start over.

## Risk type

Usability. Build a clickable mockup first; no real AI, no real data, no engineering until the assumption survives a test.

## Kill switch

We assume officers trust a cited draft enough to edit it instead of starting over. If they do not, faster drafting does not solve the problem, and neither would a dashboard or a better model.

## Kill-switch signal

- The tester gets stuck on the core action within 30 seconds, or
- The tester rewrites most of the draft (more than about 6 in 10 words changed), or
- The tester approves the planted stale-page error without catching it. Rubber-stamping is a kill-switch result even though the click looks like success.

## Success signal

In a test session of five drafted enquiries: at least four are approved after a light edit, the planted error is caught using the citations, and no draft is rewritten from scratch. For the later pilot: 8 in 10 drafts sent after a light edit by the end of the two-week pilot, as set in `one-pager.md`.

## What the test must prove (from the three leaders)

1. **Frontline director:** officers catch a planted stale-page error using the side-by-side citation, under mild time pressure, and the test can tell a light edit from an approve-without-reading.
2. **Head of product:** the cited draft beats a folder of canned snippets on time to an approved correct reply, or on errors caught. The prototype provides the draft side; the snippet side runs manually with a printed folder of the same synthetic policy text.
3. **Chief executive sponsor:** one planted error is caught, corrected and logged end-to-end in the session.

## How the prototype measures this

The mockup records, per enquiry: time from first open to decision, how many cited passages the tester opened, whether the draft was edited and how much of it changed, and whether the planted error survived into an approved reply. A session clock applies mild time pressure. A Finish test screen reads the numbers against the kill-switch lines. Results are copied into this file after each session.

## Results

_No sessions run yet._
