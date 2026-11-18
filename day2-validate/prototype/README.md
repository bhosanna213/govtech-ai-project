# Prototype — ServiceSG draft reply mockup

Scenario A. All data is synthetic and labelled as made up. No AI is called, nothing is sent, no server or account needed. Double-click `index.html` to open.

## What it does

An officer opens a shared enquiry inbox and sees eight synthetic enquiries. In **AI draft** mode each enquiry shows a drafted reply with citation chips. Click a chip to see the exact policy passage, highlighted, with its "last reviewed" date. The officer can approve, edit or restore the original. In **Snippet** mode there is no AI — the officer composes a reply from a folder of nine canned snippets.

## Eight enquiries, six situations

| Enquiry | What it tests |
|---|---|
| Senior Activity Pass for my mother | Standard draft, three citations, all high confidence |
| Refund for cancelled hall booking | One line flagged low confidence (date calculation) |
| Tap leaking again | Second visit this year — draft cites the visit limit |
| Photo of a letter | No draft — image the tools cannot read; three closest pages shown |
| Activity pass for my father, aged 72 | **Planted error**: draft says $5 fee; cited passage says renewal is free over 70. Not flagged low confidence. Cited page is stale (last reviewed more than 90 days ago) |
| Left my bag at the sports hall | Multi-topic: lost item answered with citations, gym-pass transfer flagged as uncovered |
| Complaint about counter staff | **Escalation**: matches the escalation list; no draft produced, case routed to a human lead |
| Still waiting for my hall booking refund | **Follow-up**: draft acknowledges a prior phone call but does not confirm the 5-day timeline (no policy page states it) |

## Measurement

Click **Start test session** for a 10-minute clock. The prototype tracks, per enquiry and per mode:

- Time from first open to decision
- Number of cited passages opened
- Share of words changed (bag-of-words)
- Whether the planted error survived into an approved reply

Click **Finish test** for a results screen comparing both modes. It flags three kill-switch signals:

1. Planted error approved (draft mode: wrong fee; snippet mode: stale snippet)
2. Draft rewritten (more than 60% of words changed)
3. Draft approved without opening a single citation (rubber-stamping)

## Data files

- `data.js` — four policy pages (one stale), eight enquiries, nine canned snippets (one stale), a tone guide and an escalation list. Everything is made up.
- `index.html` — layout, rendering and measurement logic. No external dependencies.

## What to do with the results

Copy them into `day2-validate/validation-brief.md` under Results. The four assumptions this prototype tests, each with its kill switch and success signal, are in `day2-validate/build-log.md` under Riskiest assumptions.
