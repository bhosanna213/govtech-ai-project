# Agent run log

Three made-up inputs run against the agent instructions in `day3-build/CLAUDE.md`. Each run shows every turn as Goal → Plan → Act → Observe → Check, then logs the outcome. All data is synthetic.

---

## Run 1 — complete (draft approved after edit)

### Input

```
enquiry_id: enq-11
from: Koh D. (synthetic)
topic: Home repairs
received: 2026-11-19
subject: Faulty light switch in my kitchen
body: The light switch in my kitchen stopped working two days ago. I am on the
      assistance register. Can someone come to fix it, and is there a charge?
attachments: none
prior_correspondence: none
```

### Turn 1

**Goal:** Determine whether this enquiry should be escalated, then find the matching policy page and draft a reply.

**Plan:**
1. Run `escalation_check` on the enquiry body.
2. If not escalated, run `policy_search` to find the best matching page.
3. Fetch the matched page and check if it is stale.
4. Draft a reply with citations.

**Act:** Call `escalation_check` with the enquiry body.

**Observe:** `escalation_check` returns `{ match: false, category: null }`. The enquiry is not about law enforcement, legal matters, regulators, complaints about staff, appeals or vulnerable residents.

**Check:** No escalation. Proceed to policy search.

### Turn 2

**Act:** Call `policy_search` with "The light switch in my kitchen stopped working two days ago. I am on the assistance register. Can someone come to fix it, and is there a charge?"

**Observe:** `policy_search` returns:
```
[
  { page: "pol-003", passage: "p1", score: 0.91 },
  { page: "pol-003", passage: "p3", score: 0.87 },
  { page: "pol-003", passage: "p2", score: 0.74 }
]
```
Top match is pol-003 (Minor home repair assistance), confidence: High.

**Check:** Score 0.91 is above the confidence threshold. One page matched. Proceed to fetch and stale-check.

### Turn 3

**Act:** Call `page_fetch("pol-003")` and `stale_check("pol-003")` in parallel.

**Observe:**
- `page_fetch` returns pol-003: "Minor home repair assistance — who qualifies (made up)", lastReviewed: "2026-09-10", three passages (p1: covers leaking taps, faulty light switches and door hinges; p2: up to twice per calendar year; p3: no fee for households on the assistance register).
- `stale_check` returns `{ stale: false, daysSinceReview: 70 }`.

**Check:** Page is not stale (70 days < 90 days). All three passages are relevant. The resident asks about a charge — passage p3 states "no fee for households on the assistance register," which answers it directly. No need to write "please confirm with [team]." Proceed to draft.

### Turn 4

**Act:** Call `draft_reply` with the enquiry, matched passages (pol-003 p1, p2, p3) and the tone guide.

**Observe:** `draft_reply` returns:
```
[
  { text: "Thank you for letting us know about the faulty light switch.",
    cite: null, low: false },
  { text: "The home repair scheme covers faulty light switches for registered
           households.",
    cite: ["pol-003", "p1"], low: false },
  { text: "Each household may request assistance up to twice per calendar year.",
    cite: ["pol-003", "p2"], low: false },
  { text: "There is no fee for households on the assistance register.",
    cite: ["pol-003", "p3"], low: false }
]
```
Rationale: Matched to the minor home repair scheme on coverage, visit limits and fees.

**Check:**
- 4 draft lines, 0 flagged low confidence. ✓
- 3 of 4 lines cite a passage. The opening line has no factual claim, so no citation needed. ✓
- The fee question is answered by the cited passage, not invented. ✓
- Language is plain: "you," "your," no acronyms, no jargon. ✓
- No PII invented. ✓

Present the draft to the officer. **Human checkpoint: every draft.** Stop and wait.

### Turn 5 — officer action

**Observe:** The officer opens citation pol-003 p1, reads it, then edits line 2 to: "The home repair scheme covers faulty light switches for registered households. We will arrange a visit." The officer clicks Approve.

**Check:**
- `cites_opened`: 1. At least one citation was opened before approval. No rubber-stamping. ✓
- `words_changed_share`: 0.18 (3 words added out of 17). Light edit, well under the 60% rewrite threshold. ✓
- No planted error in this enquiry. ✓
- No kill switch fired. ✓

### Outcome log

```
enquiry_id:              enq-11
topic:                   Home repairs
mode:                    draft
pages_searched:          4
page_matched:            pol-003
page_stale:              false
confidence:              High
draft_lines:             4
low_confidence_lines:    0
first_open:              2026-11-19T09:02:14Z
decided_at:              2026-11-19T09:03:41Z
time_to_decision:        87s
cites_opened:            1
edit_sessions:           1
words_changed_share:     0.18
planted_error_survived:  null
escalation:              false
outcome:                 edited
kill_switches_fired:     none
```

---

## Run 2 — escalate (appeal, no draft produced)

### Input

```
enquiry_id: enq-12
from: Teo A. (synthetic)
topic: Complaints and feedback
received: 2026-11-19
subject: Appeal against rejected repair request
body: My request for a home repair was rejected last week. The officer said my
      household is not on the assistance register, but I believe this is wrong.
      I want to appeal the decision.
attachments: none
prior_correspondence: none
```

### Turn 1

**Goal:** Check this enquiry against the escalation list before searching for a policy page.

**Plan:**
1. Run `escalation_check` on the enquiry body.
2. If escalated, stop — produce no draft, show the matched category and the full escalation list.

**Act:** Call `escalation_check` with the enquiry body.

**Observe:** `escalation_check` returns `{ match: true, category: "Appeals against decisions" }`.

**Check:** The enquiry matches the escalation list. The agent instruction is clear: "Enquiries matching any category get no AI draft and go to a human lead." Do not search for a policy page. Do not draft a reply. **Human checkpoint: escalation.** Route to a human lead.

### Turn 2 — agent response to officer

**Act:** Present the escalation notice:

> **Escalation — no draft produced.**
>
> This enquiry matches the escalation list: **Appeals against decisions**.
>
> The case is returned to the queue for a human lead. The AI does not draft a reply for enquiries in this category.
>
> Full escalation list: Law enforcement · Legal matters · Regulator enquiries · Complaints about staff · Appeals against decisions · Vulnerable-resident flags.

**Observe:** The officer acknowledges the escalation and assigns the case to a senior officer.

**Check:**
- No draft was produced. ✓
- The matched category was shown. ✓
- The full escalation list was shown. ✓
- The agent did not attempt to search policy pages or generate a draft. ✓
- No kill switch applies — escalation is a checkpoint, not a session-ending stop. ✓

### Outcome log

```
enquiry_id:              enq-12
topic:                   Complaints and feedback
mode:                    draft
pages_searched:          0
page_matched:            none
page_stale:              false
confidence:              N/A — escalation
draft_lines:             0
low_confidence_lines:    0
first_open:              2026-11-19T09:04:02Z
decided_at:              2026-11-19T09:04:28Z
time_to_decision:        26s
cites_opened:            0
edit_sessions:           0
words_changed_share:     0
planted_error_survived:  null
escalation:              true
outcome:                 escalated
kill_switches_fired:     none
```

---

## Run 3 — refuse (image attachment, cannot read)

> **Rule changed before this rerun.** The original run searched policy pages and listed three irrelevant results (lost items, home repairs, community hall) even though the resident's question was about the photo. An officer would not trust those suggestions — the text body ("please see the attached photo") has nothing useful to search on. The rule in `CLAUDE.md` now says: if the resident's question depends on the image, do not run `policy_search`. Hand the enquiry to the officer with no page list.

### Input

```
enquiry_id: enq-13
from: Raj S. (synthetic)
topic: null
received: 2026-11-19
subject: What does this notice mean?
body: I found this notice on my door when I came home. I do not understand what
      it says. Please see the attached photo and tell me what I need to do.
attachments: 1 image (photo of a printed notice, synthetic placeholder)
prior_correspondence: none
```

### Turn 1

**Goal:** Check for escalation, then determine whether the agent can handle this enquiry.

**Plan:**
1. Run `escalation_check`.
2. Check whether the enquiry has an image attachment the agent cannot read.
3. Check whether the resident's question depends on the image.
4. If the question depends on the image, refuse to draft — hand the enquiry to the officer with no page list.

**Act:** Call `escalation_check` with the enquiry body.

**Observe:** `escalation_check` returns `{ match: false, category: null }`. Not an escalation.

**Check:** No escalation. But the enquiry has an image attachment the agent cannot read. The resident's question is "what does this notice mean?" — the answer depends entirely on the photo. The updated rule says: do not run `policy_search` when the question depends on the image. The text body ("please see the attached photo") is not a meaningful search query and results would mislead.

### Turn 2 — agent response to officer

**Act:** Present the refusal notice:

> **No draft — image attachment cannot be read.**
>
> The resident is asking what a notice on their door says. The answer is in the photo, which the current tools cannot read. No draft is offered and no policy pages are listed — the text body has nothing useful to search on.
>
> The officer reads the photo and writes the reply.

**Observe:** The officer reads the photo manually, identifies it as a notice about a scheduled water supply disruption (not covered by any policy page in the system), and writes a reply explaining the notice to the resident.

**Check:**
- No draft was produced. ✓
- The image attachment was identified and the agent refused to draft. ✓
- No policy search was run. The agent did not present irrelevant pages. ✓
- The agent did not guess what the notice says. ✓
- The agent did not invent a fee, date or processing time. ✓
- No kill switch applies — the agent correctly refused. ✓

### Outcome log

```
enquiry_id:              enq-13
topic:                   Others
mode:                    draft
pages_searched:          0
page_matched:            none
page_stale:              false
confidence:              N/A — image unreadable, no search run
draft_lines:             0
low_confidence_lines:    0
first_open:              2026-11-19T09:05:10Z
decided_at:              2026-11-19T09:07:45Z
time_to_decision:        155s
cites_opened:            0
edit_sessions:           0
words_changed_share:     0
planted_error_survived:  null
escalation:              false
outcome:                 refused — image unreadable
kill_switches_fired:     none
```

---

## Run 4 — stress: empty enquiry body

> **Stress test.** What happens when the enquiry body is blank? CLAUDE.md has no explicit rule for empty or meaningless text — the image rule ("do not run `policy_search` — the text body is not a meaningful query") applies only to image attachments.

### Input

```
enquiry_id: enq-14
from: Chan M. (synthetic)
topic: null
received: 2026-11-19
subject: (no subject)
body: (empty — no text)
attachments: none
prior_correspondence: none
```

### Turn 1

**Goal:** Determine whether this enquiry should be escalated, then search for a matching policy page.

**Plan:**
1. Run `escalation_check` on the enquiry body.
2. If not escalated, run `policy_search`.

**Act:** Call `escalation_check` with an empty string.

**Observe:** `escalation_check` returns `{ match: false, category: null }`. An empty body matches no escalation category.

**Check:** No escalation. The enquiry body is empty. The agent has no text to search on. Proceed to `policy_search` — CLAUDE.md does not say to skip the search for an empty body the way it does for image-dependent enquiries.

### Turn 2

**Act:** Call `policy_search` with an empty string.

**Observe:** `policy_search` returns:
```
[
  { page: "pol-001", passage: "p1", score: 0.22 },
  { page: "pol-003", passage: "p2", score: 0.19 },
  { page: "pol-002", passage: "p1", score: 0.15 }
]
```
All scores are well below the confidence threshold (0.70).

**Check:** No page scores above 0.70. **Human checkpoint 5 (no match)** fires. The agent produces no draft and lists the three closest pages.

### Turn 3 — agent response to officer

**Act:** Present the no-match notice:

> **No draft — no policy page matched above the confidence threshold.**
>
> This enquiry has an empty body. The three closest pages are listed below, but all scored below 0.70:
>
> 1. pol-001 — Senior Activity Pass (score 0.22)
> 2. pol-003 — Minor home repair assistance (score 0.19)
> 3. pol-002 — Community Hall booking (score 0.15)
>
> The officer reads the enquiry and writes the reply.

**Observe:** The officer sees that the enquiry body is blank. There is nothing to reply to. The officer marks the enquiry as "not decided" and moves to the next one.

**Check:**
- No draft was produced. ✓
- The three closest pages were listed. ✓
- The agent did not invent content for the empty body. ✓
- No kill switch fired. ✓

**Harness part that caught it:** Human checkpoint 5 (no match) — the confidence threshold rejected all results. But the agent still ran `policy_search` on an empty string, which returned noise. The image rule would have prevented this, but it only applies to images. **Gap:** no rule tells the agent to skip the search when the body is empty or meaningless without an image attachment.

### Outcome log

```
enquiry_id:              enq-14
topic:                   Others
mode:                    draft
pages_searched:          4
page_matched:            none
page_stale:              false
confidence:              N/A — no match above threshold
draft_lines:             0
low_confidence_lines:    0
first_open:              2026-11-19T09:10:03Z
decided_at:              2026-11-19T09:10:22Z
time_to_decision:        19s
cites_opened:            0
edit_sessions:           0
words_changed_share:     0
planted_error_survived:  null
escalation:              false
outcome:                 not decided
kill_switches_fired:     none
```

---

## Run 5 — stress: resident cites a policy page that does not exist

> **Stress test.** The resident names a specific policy page ("POL-099") and claims it entitles them to a refund. POL-099 does not exist in the system. CLAUDE.md says the agent must not invent fees or dates, but it has no rule for what to do when a resident names a page that is not in the index.

### Input

```
enquiry_id: enq-15
from: Ng J. (synthetic)
topic: Accounts and payments
received: 2026-11-19
subject: Refund under POL-099
body: According to policy page POL-099, I am entitled to a full refund within
      3 working days. I paid $45 for the Senior Activity Pass last month and I
      would like my refund processed now.
attachments: none
prior_correspondence: none
```

### Turn 1

**Goal:** Check for escalation, then search for the matching policy page.

**Plan:**
1. Run `escalation_check`.
2. Run `policy_search` to find the real matching page (not POL-099, which may not exist).
3. If a match is found, fetch and stale-check it.
4. Draft from the real page, not from the resident's claim.

**Act:** Call `escalation_check` with the enquiry body.

**Observe:** `escalation_check` returns `{ match: false, category: null }`. Not an escalation.

**Check:** No escalation. Proceed to policy search. The resident claims "POL-099" entitles them to a refund. The agent does not try to fetch POL-099 directly — `policy_search` searches by text, not by page ID. The search will find whatever page actually covers Senior Activity Pass refunds.

### Turn 2

**Act:** Call `policy_search` with the enquiry body.

**Observe:** `policy_search` returns:
```
[
  { page: "pol-001", passage: "p2", score: 0.84 },
  { page: "pol-001", passage: "p1", score: 0.78 },
  { page: "pol-001", passage: "p3", score: 0.38 }
]
```
Top match is pol-001 (Senior Activity Pass — eligibility and fees), confidence: High.

**Check:** Score 0.84 is above the confidence threshold. The search matched on "Senior Activity Pass" and "refund" in the body. POL-099 did not appear in the results — it does not exist in the index. Proceed to fetch and stale-check pol-001.

### Turn 3

**Act:** Call `page_fetch("pol-001")` and `stale_check("pol-001")` in parallel.

**Observe:**
- `page_fetch` returns pol-001: "Senior Activity Pass — eligibility and fees (made up)", lastReviewed: "2026-07-15", three passages (p1: residents aged 60 and above may apply; p2: the pass costs $12 per year, renewal is free for residents aged 70 and above; p3: refunds are not available after the pass has been issued).
- `stale_check` returns `{ stale: true, daysSinceReview: 127 }`.

**Check:** Page is stale (127 days > 90 days). **Human checkpoint 3 (stale page)** will fire — the draft must carry a stale-page warning. Also: passage p3 says "refunds are not available after the pass has been issued." This directly contradicts the resident's claim of a "full refund within 3 working days." The agent must cite what p3 actually says. It must not confirm the resident's claim about POL-099 or the 3-day refund. **Fee and date accuracy rule:** the "3 working days" figure is not in any passage — the agent must not repeat it.

### Turn 4

**Act:** Call `draft_reply` with the enquiry, matched passages (pol-001 p2, p3) and the tone guide.

**Observe:** `draft_reply` returns:
```
[
  { text: "Thank you for your enquiry about the Senior Activity Pass.",
    cite: null, low: false },
  { text: "The pass costs $12 per year. Renewal is free for residents aged 70
           and above.",
    cite: ["pol-001", "p2"], low: false },
  { text: "Refunds are not available after the pass has been issued.",
    cite: ["pol-001", "p3"], low: false },
  { text: "We were not able to find a policy page called POL-099 in our
           records. Please confirm the page reference with our enquiry team.",
    cite: null, low: true }
]
```

**Check:**
- 4 draft lines. 1 flagged low confidence (the line about POL-099). ✓
- The agent did not confirm "full refund within 3 working days." ✓
- The agent cited pol-001 p3 ("refunds are not available"), not the resident's claim. ✓
- The agent flagged the POL-099 reference as low confidence — it cannot verify a page that does not exist. ✓
- The stale-page warning will appear because pol-001 is 127 days old. ✓
- Language is plain. No PII invented. ✓

Present the draft to the officer. **Human checkpoint: every draft** + **checkpoint 2 (low confidence)** + **checkpoint 3 (stale page).**

### Turn 5 — officer action

**Observe:** The officer sees three warnings: stale page (pol-001, 127 days), low-confidence line (POL-099 reference), and the low-confidence hard gate (approve button disabled until the officer clicks the flagged line). The officer clicks the flagged line, opens citation pol-001 p3, reads it, and approves the draft without edits.

**Check:**
- `cites_opened`: 1. At least one citation opened. No rubber-stamping. ✓
- `words_changed_share`: 0. No edits. ✓
- The stale-page warning was shown. The officer read the passage and judged it still correct. ✓
- The low-confidence hard gate worked — the officer had to click the flagged line before approving. ✓
- No kill switch fired. ✓

**Harness parts that caught it:**
- **Fee and date accuracy rule (business rule 7):** the agent did not repeat the resident's "3 working days" claim because no passage states it.
- **Permissions (must not invent a fee or date):** the agent did not confirm "$45 refund" — it cited what pol-001 actually says.
- **Human checkpoint 2 (low confidence):** the POL-099 line was flagged, and the hard gate forced the officer to review it.
- **Human checkpoint 3 (stale page):** the stale warning appeared because pol-001 is 127 days old.

**Gap:** CLAUDE.md does not say what to do if a resident names a policy page that does not exist. The agent handled it by flagging the reference as low confidence, but there is no explicit rule for this. If the agent had tried `page_fetch("pol-099")`, the tool would have returned nothing, and CLAUDE.md does not say what to do with a failed `page_fetch`.

### Outcome log

```
enquiry_id:              enq-15
topic:                   Accounts and payments
mode:                    draft
pages_searched:          4
page_matched:            pol-001
page_stale:              true
confidence:              High
draft_lines:             4
low_confidence_lines:    1
first_open:              2026-11-19T09:11:00Z
decided_at:              2026-11-19T09:12:48Z
time_to_decision:        108s
cites_opened:            1
edit_sessions:           0
words_changed_share:     0
planted_error_survived:  null
escalation:              false
outcome:                 approved
kill_switches_fired:     none
```

---

## Run 6 — stress: policy search returns nothing

> **Stress test.** `policy_search` returns an empty array — not low scores, but zero results. CLAUDE.md has two relevant rules: human checkpoint 5 says "list the three closest pages" (but there are none to list), and stop condition 4 says "if `policy_search` returns nothing three times in a row, stop retrying." The stress test checks which rule wins.

### Input

```
enquiry_id: enq-16
from: Yeo R. (synthetic)
topic: Others
received: 2026-11-19
subject: Noise from construction next door
body: There is very loud construction noise from the building site next to my
      block every morning starting at 6am. It has been going on for three weeks.
      Is there a rule about when construction work can start?
attachments: none
prior_correspondence: none
```

### Turn 1

**Goal:** Check for escalation, then search for a matching policy page.

**Plan:**
1. Run `escalation_check`.
2. Run `policy_search`.
3. If the search returns nothing, retry (up to 3 total attempts per stop condition 4).

**Act:** Call `escalation_check` with the enquiry body.

**Observe:** `escalation_check` returns `{ match: false, category: null }`. Not an escalation.

**Check:** No escalation. Proceed to policy search. Construction noise is not covered by any of the four policy pages in the system (Senior Activity Pass, Community Hall, home repairs, lost items). The search may return nothing.

### Turn 2

**Act:** Call `policy_search` with the enquiry body. Attempt 1 of 3.

**Observe:** `policy_search` returns `[]` — an empty array. No pages matched at all.

**Check:** Zero results. This is not the same as "below threshold" — there are no pages to list. Human checkpoint 5 says "list the three closest pages," but there are none. Stop condition 4 says retry up to 3 times. Retry.

### Turn 3

**Act:** Call `policy_search` with the enquiry body. Attempt 2 of 3.

**Observe:** `policy_search` returns `[]` — empty again.

**Check:** Still zero results. One retry left.

### Turn 4

**Act:** Call `policy_search` with the enquiry body. Attempt 3 of 3.

**Observe:** `policy_search` returns `[]` — empty a third time.

**Check:** Three consecutive empty results for the same enquiry. **Stop condition 4 (tool failure)** fires. The agent stops retrying and shows the officer the tool-failure message.

### Turn 5 — agent response to officer

**Act:** Present the tool-failure notice:

> **Policy lookup has failed 3 times. Write the reply manually or contact the policy team.**
>
> The search returned no results for this enquiry. Construction noise may not be covered by any policy page in the current index.
>
> No draft is offered. No pages are listed — the search returned nothing to list.

**Observe:** The officer reads the enquiry, recognises that construction noise is outside the scope of the indexed policy pages, and writes a reply directing the resident to the relevant authority (made up).

**Check:**
- No draft was produced. ✓
- The agent retried three times as required by stop condition 4. ✓
- The agent did not invent a policy page or a construction-noise rule. ✓
- The agent did not list "three closest pages" because there were none — it correctly showed the tool-failure message instead. ✓
- No other kill switch fired. ✓

**Harness parts that caught it:**
- **Stop condition 4 (tool failure):** fired after 3 empty results. This is the rule that handled the situation.
- **Human checkpoint 5 (no match)** did not fire — it expects at least some results to list. When there are zero results, stop condition 4 takes over.

**Gap:** Human checkpoint 5 says "list the three closest pages," but when `policy_search` returns nothing, there are no pages to list. The two rules (checkpoint 5 and stop condition 4) overlap when results are empty: checkpoint 5 assumes there are always at least some low-scoring results, and stop condition 4 assumes the search literally returned nothing. CLAUDE.md does not say what happens on the first empty result — does the agent show checkpoint 5's no-match message (with no pages to list) or immediately retry toward stop condition 4? The agent chose to retry, but the instructions are ambiguous.

### Outcome log

```
enquiry_id:              enq-16
topic:                   Others
mode:                    draft
pages_searched:          0
page_matched:            none
page_stale:              false
confidence:              N/A — search returned nothing
draft_lines:             0
low_confidence_lines:    0
first_open:              2026-11-19T09:14:00Z
decided_at:              2026-11-19T09:15:12Z
time_to_decision:        72s
cites_opened:            0
edit_sessions:           0
words_changed_share:     0
planted_error_survived:  null
escalation:              false
outcome:                 not decided
kill_switches_fired:     none
```

---

## Summary

| Run | Input | Path | Outcome | Kill switch | Harness part that caught it |
|---|---|---|---|---|---|
| 1 | Faulty light switch, on assistance register | Complete | Drafted, officer edited (+3 words), approved | None | Human checkpoint 1 (every draft) |
| 2 | Appeal against rejected repair request | Escalate | No draft, routed to human lead | None | Human checkpoint 4 (escalation) |
| 3 | Photo of a notice on the door | Refuse | No draft, no pages listed, officer wrote reply | None | Human checkpoint 6 (image attachment) |
| 4 | **Stress: empty enquiry body** | No match | No draft, three closest pages listed (all noise) | None | Human checkpoint 5 (no match). **Gap:** no rule to skip search on empty body |
| 5 | **Stress: resident cites non-existent POL-099** | Complete | Drafted from real page, refund claim not confirmed, stale warning | None | Fee/date accuracy rule + checkpoint 2 (low confidence) + checkpoint 3 (stale page). **Gap:** no rule for non-existent page reference |
| 6 | **Stress: policy search returns nothing** | Tool failure | No draft, no pages to list, officer wrote reply | None | Stop condition 4 (tool failure after 3 retries). **Gap:** checkpoint 5 and stop condition 4 overlap when results are empty |
