# AI PRD — ServiceSG enquiry drafting assistant

Scenario A. Extracted from `day2-validate/living-prd.md`, `day2-validate/handoff-note.md` and `day3-build/CLAUDE.md`. All data is synthetic.

---

## Problem and user

**User:** ServiceSG enquiry officers. They answer resident enquiries from a shared inbox.

**Problem:** Officers spend roughly 10 minutes per enquiry searching policy pages before they can write a reply. The inbox is busiest after a policy change, which is exactly when the pages are most likely stale. A wrong reply — a wrong fee, a missed deadline — carries the agency's name.

**What the agent does:** For each enquiry the agent retrieves the matching policy page, drafts a first reply with inline citations, and presents it to the officer. The officer reads the draft, checks the cited passage, edits if needed, and approves. The agent never sends a reply on its own.

---

## Instructions

A good draft:

1. Answers the resident's question using the cited policy passage.
2. Cites the page title and passage ID for every factual claim.
3. Flags any line where the match is below the confidence threshold.
4. Uses plain, respectful language ("you" and "your", not "the applicant").
5. Fits on one screen — one topic per paragraph, each with its own citation.
6. States a fee, date or deadline only if the cited passage states it. Otherwise writes "please confirm with [team]."
7. Acknowledges prior correspondence but does not confirm unverified claims from it.

---

## Tools

Six tools. All synthetic for now. The agent must not call any tool that sends, posts or publishes content externally.

| Tool | What it does | Input | Output |
|---|---|---|---|
| `policy_search` | Searches indexed policy pages by enquiry text | Enquiry body (string) | Ranked list of page IDs, passage IDs and relevance scores |
| `page_fetch` | Retrieves a single policy page with all its passages and metadata | Page ID (e.g. `pol-001`) | Page title, `lastReviewed` date, passages as keyed text |
| `draft_reply` | Generates a reply draft from matched passages | Enquiry + matched passages + tone guide | Array of draft lines, each with `text`, `cite`, `low` (boolean) and `rationale` |
| `stale_check` | Checks whether a policy page was last reviewed more than 90 days ago | Page ID | Boolean + days since last review |
| `escalation_check` | Checks the enquiry against the escalation list | Enquiry body | Boolean + matched category (if any) |
| `prior_context_fetch` | Retrieves earlier correspondence on the same case, if any | Case reference or resident ID | Prior messages and case notes (synthetic) |

---

## Context and memory

### Enquiry schema

Each enquiry has these fields. The agent reads all of them at the start.

| Field | Type | Example | Notes |
|---|---|---|---|
| `id` | string | `enq-01` | Unique identifier |
| `from` | string | `Lim W. (synthetic)` | Sender name |
| `topic` | string or null | `Senior services` | One of the fixed topic list, or null if unknown |
| `receivedDate` | date string | `2026-11-12` | ISO date |
| `subject` | string | `Senior Activity Pass for my mother` | One-line subject |
| `body` | string | (free text) | The resident's message |
| `hasImage` | boolean | `false` | Whether the enquiry has an image attachment |
| `followUp` | boolean | `false` | Whether this is a follow-up to an earlier case |
| `priorContext` | string or null | (free text) | Earlier correspondence, if any |

**Fixed topic list (6 + Others):** Senior services, Facilities booking, Home repairs, Lost and found, Complaints and feedback, Accounts and payments. Enquiries with no match get "Others."

### Policy page schema

Each policy page has these fields. The agent reads them via `page_fetch`.

| Field | Type | Example |
|---|---|---|
| `id` | string | `pol-001` |
| `title` | string | `Senior Activity Pass — eligibility and fees` |
| `lastReviewed` | date string | `2026-07-15` |
| `passages` | object | `{ "p1": "Residents aged 60 and above…", "p2": "The pass costs $12…" }` |

Passages are keyed by passage ID (`p1`, `p2`, `p3`, etc.). Each value is a plain-text string. The agent cites passages as `[page ID, passage ID]` — e.g. `["pol-001", "p2"]`.

### Tone guide format

The tone guide is a structured object the agent receives as input to `draft_reply`.

```
{
  register: "Plain, respectful, one reading level below formal.",
  rules: [
    "Address the resident as 'you' and 'your', not 'the applicant'.",
    "No acronyms unless the resident used one first.",
    "No jargon. Use everyday words.",
    "One topic, one paragraph, each with its own citation."
  ]
}
```

### What the agent knows at the start of each enquiry

- The enquiry (see schema above).
- The tone guide (see format above).
- The escalation list: six categories (see Business rules).
- The confidence threshold: if no policy page scores above it, say so and list the three closest pages. Do not draft.

### What the agent remembers across enquiries in the same session

- Which enquiries have been drafted, approved, edited or rejected.
- Officer edits: the agent sees the change and does not repeat the same mistake on a similar enquiry.
- Prior correspondence fetched for one enquiry is kept for follow-ups from the same resident.

### What the agent does not remember

- Nothing persists across sessions. Each session starts fresh.

---

## Permissions

Every action the agent takes, classified by tier and setting. All settings confirmed.

**Tier definitions:**
- **read** — retrieves or looks up information. No content created.
- **draft** — creates or prepares text that an officer will review. Nothing reaches the resident.
- **write** — changes internal state, logs or configuration.
- **send** — communicates with residents or external systems, or takes an irreversible action.

**Setting definitions:**
- **auto** — the agent does this without asking.
- **confirm** — the agent does this, but it takes effect only after the officer confirms.
- **block** — the agent never does this.

### Read tier

| # | Action | Setting | Status |
|---|---|---|---|
| 1 | Read the enquiry (body, subject, topic, attachments) | auto | Set |
| 2 | Read the tone guide and escalation list | auto | Set |
| 3 | Search policy pages by enquiry text | auto | Set |
| 4 | Fetch a policy page and its passages | auto | Set |
| 5 | Check page staleness (90-day threshold) | auto | Set |
| 6 | Check enquiry against escalation list | auto | Set |
| 7 | Fetch prior correspondence on the same case | auto | Set |

### Draft tier

| # | Action | Setting | Status |
|---|---|---|---|
| 8 | Generate a cited reply draft | auto | Set |
| 9 | Flag a draft line as low confidence | auto | Set |
| 10 | Flag a cited page as stale (>90 days) | auto | Set |
| 11 | List three closest pages when no page matches the threshold | auto | Set |
| 12 | Write "please confirm with [team]" when a fee or date is missing from the passage | auto | Set |
| 13 | Acknowledge prior correspondence without confirming unverified claims | auto | Set |
| 14 | Present the draft to the officer for review | confirm | Set |
| 15 | Present an escalation notice and route to a human lead | confirm | Set |
| 16 | Present an image-unreadable notice to the officer | confirm | Set |
| 17 | Present a no-match notice to the officer | confirm | Set |
| 18 | Invent a fee, date, deadline or processing time not in the cited passage | block | Set |
| 19 | Invent citizen names, NRIC fragments or PII | block | Set |
| 20 | Confirm an unverified claim from prior correspondence | block | Set |
| 21 | Draft a reply for an image-dependent enquiry the agent cannot read | block | Set |
| 22 | Use acronyms the resident did not use first | block | Set |

### Write tier

| # | Action | Setting | Status |
|---|---|---|---|
| 23 | Log per-enquiry outcome fields (17 fields) | auto | Set |
| 24 | Log per-session summary fields (7 fields) | auto | Set |
| 25 | Remember officer edits within the session | auto | Set |
| 26 | Fire a kill-switch signal and log the event | auto | Set |
| 27 | Mark a case as resolved or closed | block | Set |
| 28 | Override or shorten the escalation list | block | Set |

### Send tier

| # | Action | Setting | Status |
|---|---|---|---|
| 29 | Send, post or publish a reply to the resident | block | Set |
| 30 | Post or publish content to any external system | block | Set |

---

## Human checkpoints

The agent stops and waits for the officer at these points. It does not proceed until the officer acts.

1. **Every draft.** The officer sees the draft, the cited passages and the confidence flags. The officer approves, edits or rejects. The agent does not send.

2. **Low confidence.** If any draft line is below the confidence threshold, the agent flags it with a warning. The officer must review the flagged line before approving.

3. **Stale page.** If a cited page was last reviewed more than 90 days ago, the agent shows a stale-page warning and a banner in the citation panel. The officer must check whether the passage is still current.

4. **Escalation.** If the enquiry matches any category on the escalation list, the agent produces no draft, shows the matched category and the full list, and routes the case to a human lead.

5. **No match.** If no policy page scores above the confidence threshold, the agent produces no draft, lists the three closest pages, and tells the officer.

6. **Image attachment.** If the enquiry includes an image the agent cannot read, it produces no draft and tells the officer to write the reply. If the resident's question depends on the image, the agent does not search — the text body is not a meaningful query and results will mislead.

7. **Fee or date not in the passage.** If the resident asks about a fee, date or deadline and the matched passage does not state it, the agent writes "please confirm with [team]." The officer decides what to tell the resident.

---

## Stop conditions

The agent stops work entirely — no more drafts, no retries — in these situations.

1. **Kill switch: planted error approved.** A draft containing a known error is approved without correction. The measurement system failed to catch the error. Log the enquiry ID, the error and the approved text.

2. **Kill switch: rubber-stamping.** An officer approves a draft without opening a single cited passage. Log the enquiry ID and the number of citations available.

3. **Kill switch: full rewrite.** The officer changes more than 60% of the draft's words (bag-of-words comparison). The officer did not trust the draft. Log the enquiry ID, the original draft and the rewritten text.

4. **Tool failure.** `policy_search` returns nothing three times in a row for the same enquiry. Show: "Policy lookup has failed 3 times. Write the reply manually or contact the policy team." Log the enquiry ID and the number of attempts.

5. **Session timeout.** The session clock reaches zero (10 minutes). The officer can finish the current draft but cannot open a new one. Log the session duration and the number of enquiries completed.

6. **Escalation detected.** The agent stops drafting for that enquiry (not the whole session) and routes it to a human lead.

---

## Logs

### Per enquiry (18 fields)

| Field | What it records |
|---|---|
| `enquiry_id` | The enquiry identifier (e.g. `enq-01`) |
| `topic` | The matched topic from the fixed list, or "Others" |
| `mode` | "draft" or "snippet" |
| `pages_searched` | Number of policy pages scored by `policy_search` |
| `page_matched` | The page ID of the top match, or "none" |
| `page_stale` | Boolean — was the matched page last reviewed more than 90 days ago |
| `confidence` | The confidence label (e.g. "High", "Low, 45-60%") |
| `draft_lines` | Number of lines in the generated draft |
| `low_confidence_lines` | Number of lines flagged low confidence |
| `first_open` | Timestamp — when the officer first opened this enquiry |
| `decided_at` | Timestamp — when the officer approved, edited or rejected |
| `time_to_decision` | Seconds from first open to decision |
| `cites_opened` | Number of cited passages the officer clicked to view |
| `edit_sessions` | Number of times the officer entered the editor |
| `words_changed_share` | 0 to 1 — bag-of-words share of the draft the officer changed |
| `planted_error_survived` | Boolean or null — did a known planted error survive into the approved text |
| `escalation` | Boolean — was the enquiry escalated |
| `outcome` | "approved", "edited", "rejected", "escalated", or "not decided" |

### Per session (7 fields)

| Field | What it records |
|---|---|
| `session_start` | Timestamp |
| `session_end` | Timestamp |
| `session_duration` | Seconds |
| `enquiries_opened` | Count |
| `enquiries_decided` | Count |
| `kill_switches_fired` | List of kill-switch names that fired, if any |
| `mode` | Which mode the session ran in |

---

## Business rules

These encode stakeholder commitments. An engineer must not change them without asking.

1. **Officer-in-the-loop.** The system never sends a reply without an officer approving it. No auto-send, batch-approve or skip-review.

2. **No draft without a citation.** If the policy lookup fails, the officer writes the reply manually. The system never shows a draft that cites no policy page.

3. **The planted error and its threshold.** enq-06's $5 fee vs the cited passage saying free over 70 is the instrument that tests assumption 2. Do not fix it, flag it, or remove it.

4. **The three kill-switch thresholds.** Planted error approved, >60% of words rewritten, zero citations opened on approval. These thresholds were agreed with the frontline director. Change only with her sign-off.

5. **The escalation list.** Law enforcement, legal matters, regulator enquiries, complaints about staff, appeals against decisions, vulnerable-resident flags. All six categories route to a human lead with no draft. Cannot be shortened without policy review.

6. **The head-to-head design.** The same enquiries answered in both modes, with a parallel planted error (stale snippet snip-03 mirrors the stale citation). The head of product required this.

7. **Fee and date accuracy rule.** State a fee or date only if the cited passage states it. If the passage is silent, write "please confirm with [team]." Do not guess, interpolate or round.

8. **The 10-minute clock.** Mild time pressure is part of the test design. The frontline director set this based on realistic queue pressure.

---

## What engineering decides

These are implementation choices. The business rules above stay fixed; everything below is for the engineer to choose.

1. **Which AI model and retrieval approach.** The prototype uses scripted drafts. Production needs a real model with retrieval. Choice of model, embedding strategy, retrieval pipeline and re-ranker are engineering decisions.

2. **Backend and persistence architecture.** All state resets on page reload in the prototype. How to persist officer edits, approvals, measurement data, audit trails and kill-switch events.

3. **Authentication and access control.** No login exists. How officers authenticate, how roles are assigned, and how the audit trail records who approved what.

4. **How to detect fees and dates in passages.** The prototype uses a keyword regex. Production needs a more reliable approach — model topic classification, passage tagging, or structured metadata.

5. **How to build the stale-page check.** The 90-day threshold is a business rule. The mechanism (cron job, on-fetch check, metadata field) is an engineering choice.

6. **How to measure word changes.** The 60% threshold is a business rule. The comparison method (bag-of-words, edit distance, token diff) is an engineering choice.

7. **Volume and performance.** The prototype has 8 enquiries. A real inbox has hundreds. How to handle pagination, lazy loading and render performance.

8. **Mobile and accessibility.** Desktop only in the prototype. Layout and accessibility are engineering choices.

9. **Image and attachment reading.** Whether to add image reading and how. Currently 1 in 5 enquiries has an image, capping AI coverage at 80%.

---

## Open decisions

These need a decision before building. Neither business rules nor engineering choices — they are questions that cross the line between the two.

1. **Accountability design.** Who owns a wrong reply? A stale page, a bad draft and a rushed approval each have a different owner and a different fix. The chief executive sponsor required this before a pilot. Decided.

   **Decision:** Three-row accountability table. Each cause of a wrong reply has a different owner and a different fix path.

   | Wrong reply cause | Owner | Detection | Fix path |
   |---|---|---|---|
   | Stale policy page | Policy team | Stale-page warning (>90 days) | Policy team reviews and republishes the page |
   | Bad AI draft | AI/engineering team | Kill switch: planted error approved, or >60% rewrite | Engineering investigates the retrieval or model output |
   | Rushed officer approval | The approving officer | Kill switch: zero citations opened | Supervisor reviews the session log with the officer |

   The officer's approval is the final gate, but the officer is not the only owner. Each row has its own escalation path. Agree this table with the chief executive sponsor before the pilot.

2. **Planted-error / lookup-failure conflict.** enq-06 is a fee enquiry, so its draft is hidden while the forced lookup failure is active. The planted-error kill switch cannot fire. Options: make the failure toggleable per enquiry, or add a separate planted-error enquiry that is not about fees. Decided.

   **Decision:** Add a separate planted-error enquiry that is not about fees. Making the failure toggleable adds complexity for the tester. A separate enquiry keeps both tests independent. For example: a home repair enquiry where the draft states "up to three times per year" but the cited passage says twice. This tests the same thing (officer catches a factual error by reading the citation) without touching the lookup-failure flow.

3. **Measurement gap for lookup-failure approvals.** The failure flow has no citations to open. If an officer approves a failure-state reply, it looks like rubber-stamping. Track "no citations available" separately from "citations available but not opened." Decided.

   **Decision:** Add a `citations_available` boolean to the per-enquiry log. The rubber-stamping kill switch fires only when `citations_available` is true AND `cites_opened` is 0. When `citations_available` is false (lookup failure, image handoff), the rubber-stamping check is skipped for that enquiry. This costs one extra log field and one extra condition in the kill-switch logic.

4. **Image-reading scope.** The agent currently refuses all image enquiries. If image reading is added, which checkpoint governs it? Does the officer still review the image interpretation, or does the agent act on it? Decided.

   **Decision:** Keep image reading out of the pilot. 1 in 5 enquiries has an image — that is an 80% coverage floor without it, which is enough to test the core drafting flow. If added later, treat the image interpretation as a new draft line with its own low-confidence flag. The officer reviews it like any other draft line. This keeps the officer-in-the-loop rule intact without adding a new checkpoint type.

5. **Session memory across sessions.** The agent currently forgets everything between sessions. Should officer corrections carry over (so the agent improves over time), or should each session stay independent? Decided.

   **Decision:** Keep sessions independent for the pilot. Cross-session memory introduces a new risk: an officer's correction in one session might be wrong, and that wrong correction would spread to future sessions. The kill switches and planted-error test are designed for single sessions. Add cross-session learning only after the pilot proves the single-session model works and shows what corrections are worth keeping.

6. **Confidence threshold value (blocker).** The agent instruction file says "if no policy page scores above it" but does not state the number. The entire no-match flow, the low-confidence flagging, and human checkpoints 2 and 5 depend on this value. What is the threshold, who sets it, and can it be tuned per topic? Blocker resolved — threshold is 0.70. Decided.

   **Decision:** Set a single threshold at **0.70** for the pilot. The prototype's scores range from 0.91 (strong match) to 0.22 (noise). 0.70 catches the strong matches while rejecting the noise. One threshold for all topics — per-topic tuning needs more data than the pilot will produce. The policy team sets the threshold; engineering implements it as a config value. Review after the pilot with real retrieval scores, then decide whether to tune per topic.

7. **Escalation list governance.** The list came from the skill file and cannot be shortened without policy review. But who can add categories? What is the review process? Decided.

   **Decision:** The escalation list is a policy artefact, not an engineering config. Only the policy team adds or removes categories, through the same review process that created the list. Engineering stores the list as an external config file (not hardcoded), so the policy team can update it without a code change. Changes require the frontline director's sign-off, consistent with how the kill-switch thresholds are governed.

8. **Multi-language support.** English only in the prototype. The enquiry population may include other languages. How to handle them (translate then draft, refuse, route to a language-specific officer) Decided.

   **Decision:** For the pilot, do not translate. Run `policy_search` on the original text. If the score is below the threshold (likely, since the policy pages are in English), the no-match flow handles it — the agent lists the three closest pages and the officer writes the reply. Add a `language` field to the per-enquiry log so the pilot data shows how often non-English enquiries arrive. Decide on translation support after the pilot, based on the actual volume.

9. **Hard gate vs warning for checkpoints.** Human checkpoints 2 (low confidence) and 3 (stale page) say the officer "must" review before approving. Is the approve button disabled until the officer clicks the flagged line or citation? Or is it a visual warning the officer can bypass? An engineer cannot build the UI without this answer. Decided.

   **Decision:** Hard gate for checkpoint 2 (low confidence) — disable the approve button until the officer clicks at least one flagged line. Warning for checkpoint 3 (stale page) — show a prominent banner, but the officer can still approve. Reason: a low-confidence line may be wrong and needs review before it can be approved. A stale page may still be correct — the passage hasn't changed, the review date is just old. The rubber-stamping kill switch (zero citations opened) catches officers who bypass the stale-page warning without reading.

10. **Test-only vs production scope.** The planted error (business rule 3), the head-to-head snippet mode (business rule 6), and the 10-minute session clock (business rule 8) are validation instruments. The PRD does not say which of these survive into a production system. If all three are built into production, the system ships with a test harness embedded. If they are removed, the measurement system loses its core test instruments. Decided.

    **Decision:** Remove the planted error and the head-to-head snippet mode from production. Keep the session clock as optional (configurable, default off). The planted error is a test instrument — in production, real errors replace it and the kill switches catch them. The head-to-head comparison answered its question during validation; snippet mode is not needed once the decision to use cited drafts is made. The session clock could help with queue management but should not be mandatory. The three kill switches stay — they are production safety features, not test instruments.

11. **What "similar enquiry" means for edit learning.** The memory section says the agent "does not repeat the same mistake on a similar enquiry." What makes two enquiries similar — same topic, same matched page, same passage, overlapping keywords? An engineer cannot build the edit-learning feature without a matching rule. Decided.

    **Decision:** Same matched page and same passage. If the officer corrected a draft line citing pol-001 p2, the agent flags that passage as "previously corrected" on the next enquiry that cites it. Topic and keyword matching are too broad — the agent would over-correct on unrelated enquiries. Passage-level matching is specific enough to be useful and narrow enough to avoid false positives.

12. **Kill-switch aftermath.** Stop conditions say the agent "stops work entirely" but do not say what happens next. What does the officer see — a banner, a locked screen, a redirect? Is a supervisor notified? Can the officer override the kill switch and keep working? Decided.

    **Decision:** The officer sees a full-screen banner naming the kill switch, the enquiry that triggered it, and a one-line explanation. The officer cannot dismiss the banner or start new drafts. If a draft is already open, the officer can still approve or reject it (they should not lose work in progress). A supervisor is notified (engineering decides the channel — email, dashboard alert, or queue flag). The officer cannot override the kill switch. The supervisor reviews the session log and decides the next step.

13. **Concurrent access.** The PRD says the officer opens a shared inbox. If two officers open the same enquiry at the same time, can both draft? Does one lock it? What happens if both approve different drafts? Decided.

    **Decision:** Soft lock. When an officer opens an enquiry, it shows as "in progress by [name]" in the inbox for other officers. Other officers can still open it to read it, but the approve button is disabled for the second officer. First officer to approve wins. If the first officer closes without approving, the lock releases. This prevents duplicate replies without hard-blocking read access to the enquiry.
