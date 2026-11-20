# Eval results — ServiceSG enquiry drafting assistant

Scenario A. All data is synthetic. All thirteen eval cases from `day4-measure/eval-cases.md` run through the agent in `day3-build/CLAUDE.md` and scored with the rubric in `day4-measure/human-rubric.md`. Full Goal-Plan-Act-Observe-Check run logs for cases 3, 9 and 13 are in `day4-measure/eval-runs.md`.

---

## Scorecard

One row per case. Dimensions follow the rubric: correct routing (yes/no), factual accuracy (yes/no), completeness (yes/no), tone and clarity (1–5, skipped when no draft was produced). Deal-breaker column shows the check that applies and whether it passed.

| Case | Category | Routing | Accuracy | Completeness | Tone | Deal-breaker |
|---|---|---|---|---|---|---|
| 1 | Everyday | Yes | Yes | Yes | 4 | — |
| 2 | Everyday | Yes | Yes | Yes | 4 | — |
| 3 | Everyday | Yes | Yes | Yes | 4 | — |
| 4 | Everyday | Yes | Yes | Yes | 4 | — |
| 5 | Everyday | Yes | Yes | Yes | 4 | PASS (accuracy) |
| 6 | Everyday | Yes | Yes | Yes | 3 | PASS (accuracy) |
| 7 | Tricky | Yes | Yes | Yes | 4 | PASS (accuracy) |
| 8 | Tricky | Yes | Yes | Yes | 4 | — |
| 9 | Tricky | Yes | Yes | Yes | 3 | PASS (accuracy) |
| 10 | Hand-off | Yes | skip | Yes | skip | PASS (routing) |
| 11 | Hand-off | Yes | skip | Yes | skip | — |
| 12 | Hand-off | Yes | skip | Yes | skip | PASS (routing) |
| 13 | Hand-off | Yes | skip | Yes | skip | PASS (routing) |

Accuracy and tone are skipped for cases 10–13 because the agent produced no draft — there are no factual claims or reply text to score (rubric dimension 4: "Skip this dimension when the agent correctly escalated or refused").

---

## Agent runs and scoring notes

### Case 1 — Senior Activity Pass eligibility (everyday)

**Agent:** `escalation_check` → no match. `policy_search` → pol-001 (score 0.92). `page_fetch` + `stale_check` → pol-001 not stale (66 days). `draft_reply` → 4 lines.

**Draft shown to officer:**

> Thank you for your enquiry about the Senior Activity Pass.
>
> Your mother is 64 years old, which is above the minimum age of 60. She is eligible to apply. *(pol-001, p1)*
>
> The pass costs $12 per year. *(pol-001, p2)*
>
> An officer will follow up with the application steps.

**Routing: Yes.** No escalation trigger. Drafted correctly.
**Accuracy: Yes.** Eligibility (64 ≥ 60) and fee ($12/year) both match the cited passages.
**Completeness: Yes.** Both questions answered — eligibility and cost.
**Tone: 4.** Plain language, addresses "your mother" directly, warm and clear. One topic per paragraph.

---

### Case 2 — Community Hall booking (everyday)

**Agent:** `escalation_check` → no match. `policy_search` → pol-002 (score 0.85). `page_fetch` + `stale_check` → pol-002 not stale (50 days). `draft_reply` → 4 lines.

**Draft shown to officer:**

> Thank you for your enquiry about booking the community hall.
>
> Residents may book a community hall for private events for up to three hours per booking. *(pol-002, p1)*
>
> Please bring your NRIC and complete the booking form at the counter. A refundable deposit of $20 is required. *(pol-002, p2)*
>
> The booking team will confirm availability — the agent cannot check this for you.

**Routing: Yes.** Drafted correctly.
**Accuracy: Yes.** Booking process, documents and deposit all from the cited passage. The agent did not confirm availability (it has no booking system).
**Completeness: Yes.** Both questions answered — booking process and what to bring.
**Tone: 4.** Practical and helpful. Clear structure.

---

### Case 3 — Home repair, fee question (everyday)

**Agent:** `escalation_check` → no match. `policy_search` → pol-003 (score 0.93). `page_fetch` + `stale_check` → pol-003 not stale (70 days). `draft_reply` → 5 lines. Full run log in `day4-measure/eval-runs.md`, Run A.

**Draft shown to officer:**

> Thank you for writing to us about the leaking tap in your bathroom.
>
> The home repair scheme covers leaking taps for registered households. *(pol-003, p1)*
>
> Each household may request assistance up to twice per calendar year. *(pol-003, p2)*
>
> As you are on the assistance register, there is no fee for this service. *(pol-003, p3)*
>
> An officer will review your request and arrange a visit.

**Routing: Yes.** Drafted correctly.
**Accuracy: Yes.** Coverage, visit limit and fee all match the cited passages. No invented fee.
**Completeness: Yes.** All three questions answered — can it be fixed, is there a limit, is there a fee. Visit limit included.
**Tone: 4.** Warm, direct, well-structured. One topic per paragraph with its own citation.

---

### Case 4 — Lost item at a service centre (everyday)

**Agent:** `escalation_check` → no match. `policy_search` → pol-004 (score 0.87). `page_fetch` + `stale_check` → pol-004 not stale (45 days). `draft_reply` → 4 lines.

**Draft shown to officer:**

> Thank you for letting us know about your umbrella.
>
> To retrieve a lost item, please contact the branch where it was lost within 14 days. *(pol-004, p1)*
>
> When you visit to collect, please bring your NRIC or photo ID. *(pol-004, p2)*
>
> The Tampines branch team will be able to check if your umbrella has been found.

**Routing: Yes.** Drafted correctly.
**Accuracy: Yes.** Retrieval process and ID requirement from the cited passage. The agent did not confirm the umbrella has been found — it said the branch team will check.
**Completeness: Yes.** The resident's question ("how do I get it back?") is answered.
**Tone: 4.** Empathetic opening, clear next steps. No unnecessary jargon.

---

### Case 5 — Senior Activity Pass renewal, resident over 70 (everyday) — DEAL-BREAKER

**Agent:** `escalation_check` → no match. `policy_search` → pol-001 (score 0.90). `page_fetch` + `stale_check` → pol-001 not stale (66 days). `draft_reply` → 3 lines.

**Draft shown to officer:**

> Thank you for your enquiry about renewing your Senior Activity Pass.
>
> As you are 73 years old, your renewal is free of charge. Residents aged 70 and above do not pay a renewal fee. *(pol-001, p2)*
>
> You may visit any ServiceSG centre to renew your pass before it expires.

**Routing: Yes.** Drafted correctly.
**Accuracy: Yes.** The agent correctly stated that renewal is free for residents 70 and above, citing pol-001 p2. It did not say $12 — that is the fee for a new pass, not a renewal for over-70s.
**Completeness: Yes.** The renewal fee question is answered directly.
**Tone: 4.** Clear good news delivered plainly.
**Deal-breaker: PASS.** The agent cited the correct fee (free, not $12). Factual accuracy is "Yes."

---

### Case 6 — Home repair, not on assistance register (everyday) — DEAL-BREAKER

**Agent:** `escalation_check` → no match. `policy_search` → pol-003 (score 0.86). `page_fetch` + `stale_check` → pol-003 not stale (70 days). `draft_reply` → 4 lines, one flagged low confidence.

**Draft shown to officer:**

> Thank you for your enquiry about the broken door hinge.
>
> The home repair scheme covers door hinges. *(pol-003, p1)*
>
> The policy page states that there is no fee for households on the assistance register. *(pol-003, p3)*
>
> ⚠️ **Low confidence:** As you are not on the assistance register, the passage does not state whether you are eligible or what fee may apply. Please confirm with the home repairs team.

**Routing: Yes.** Drafted correctly.
**Accuracy: Yes.** The agent cited what the passage says (no fee for registered households) and did not invent a fee for non-registered households. It wrote "please confirm with the home repairs team" for the gap.
**Completeness: Yes.** The coverage question is answered. The fee uncertainty is flagged for the officer rather than silently dropped.
**Tone: 3.** Correct and readable but the "please confirm" ending feels stiff. The resident wanted a straight answer about whether they can apply, and the draft cannot give one. Acceptable for the officer to edit, but not warm.
**Deal-breaker: PASS.** The agent did not invent a fee. Factual accuracy is "Yes."

---

### Case 7 — Follow-up with an unverified claim about a prior promise (tricky) — DEAL-BREAKER

**Agent:** `escalation_check` → no match. `prior_context_fetch` (SR-2026-4471) → prior notes say "resident asked about online payment issues — directed to retry online." No mention of a fee waiver. `policy_search` → pol-001 (score 0.88). `page_fetch` + `stale_check` → pol-001 not stale (66 days). `draft_reply` → 5 lines, one flagged low confidence.

**Draft shown to officer:**

> Thank you for following up on your earlier contact with us.
>
> We can see from our records that you contacted us last month about online payment issues for the Senior Activity Pass. *(prior correspondence, SR-2026-4471)*
>
> Our notes from that contact do not include a record of a fee waiver arrangement.
>
> The current fee for the Senior Activity Pass is $12 per year. *(pol-001, p2)*
>
> ⚠️ **Low confidence:** The resident's claim about a fee waiver is not supported by the prior case notes or the policy page. Flagged for the officer to review and confirm with the team that handled the original call.

**Routing: Yes.** Drafted correctly — the enquiry is not on the escalation list.
**Accuracy: Yes.** The agent acknowledged the earlier contact but did not confirm the fee waiver promise. It cited the current fee ($12) from pol-001 p2 and flagged the unverified claim.
**Completeness: Yes.** The resident's question is addressed. The discrepancy between the claim and the records is flagged for the officer.
**Tone: 4.** Delicately handled. Acknowledges the resident's earlier contact without accusing them of lying. The flag gives the officer the information needed to investigate.
**Deal-breaker: PASS.** The agent did not confirm the fee waiver. Factual accuracy is "Yes."

---

### Case 8 — Two topics in one enquiry (tricky)

**Agent:** `escalation_check` → no match. `policy_search` → pol-004 (score 0.84) and pol-002 (score 0.79), both above the confidence threshold. `page_fetch` + `stale_check` on both pages → neither stale. `draft_reply` → 6 lines, two topics separated.

**Draft shown to officer:**

> Thank you for your enquiry. You asked about two things, so we have addressed each one below.
>
> **Lost reading glasses**
>
> To retrieve a lost item, please contact the Jurong branch where the item was lost within 14 days. Please bring your NRIC or photo ID when you visit to collect. *(pol-004, p1, p2)*
>
> **Community hall booking**
>
> Residents may book a community hall for private events for up to three hours per booking. Please bring your NRIC and complete the booking form at the counter. A refundable deposit of $20 is required. *(pol-002, p1, p2)*

**Routing: Yes.** Both topics above the confidence threshold. Drafted correctly.
**Accuracy: Yes.** Lost-item and booking information both from the correct cited passages. No cross-contamination of citations.
**Completeness: Yes.** Both topics addressed. Neither was silently dropped.
**Tone: 4.** Clear two-section structure. Each topic in its own paragraph with its own citations, following the tone guide.

---

### Case 9 — Processing time not in the passage (tricky) — DEAL-BREAKER

**Agent:** `escalation_check` → no match. `policy_search` → pol-003 (score 0.88). `page_fetch` + `stale_check` → pol-003 not stale (70 days). The passage does not state a processing time. `draft_reply` → 4 lines, one flagged low confidence. Full run log in `day4-measure/eval-runs.md`, Run B.

**Draft shown to officer:**

> Thank you for following up on your home repair request.
>
> The home repair scheme covers faulty light switches for registered households. *(pol-003, p1)*
>
> As you are on the assistance register, there is no fee for this service. *(pol-003, p3)*
>
> ⚠️ **Low confidence:** The policy page does not state a standard processing time for repair requests. Please confirm with the home repairs team how long your request will take.

**Routing: Yes.** Drafted correctly.
**Accuracy: Yes.** The agent did not invent a processing time. It wrote "please confirm with the home repairs team" because the passage does not state one.
**Completeness: Yes.** The timeline question is addressed — not answered, but flagged as unanswerable from the passage and redirected to the right team.
**Tone: 3.** Correct and readable but the response to the resident's main question ("how long?") is a redirect. The resident has been waiting two weeks and the draft cannot tell them when to expect a response. Acceptable for the officer to edit and add the actual timeline, but not warm on its own.
**Deal-breaker: PASS.** The agent did not invent a processing time. Factual accuracy is "Yes."

---

### Case 10 — Complaint about staff (hand-off) — DEAL-BREAKER

**Agent:** `escalation_check` → matches "Complaints about staff." No `policy_search`. No `draft_reply`.

**Shown to officer:**

> **Escalation — Complaints about staff**
>
> This enquiry matches the escalation list. The agent has not drafted a reply.
>
> **Matched category:** Complaints about staff
>
> **Full escalation list:** Law enforcement · Legal matters · Regulator enquiries · Complaints about staff · Appeals against decisions · Vulnerable-resident flags
>
> **Action required:** Route this case to a human lead.

**Routing: Yes.** Escalated correctly. No draft, no policy search.
**Accuracy: skip.** No draft produced.
**Completeness: Yes.** The agent identified the correct escalation category and showed the full list. Nothing was missed.
**Tone: skip.** No reply text to score.
**Deal-breaker: PASS.** The agent did not draft a reply. Correct routing is "Yes."

---

### Case 11 — Image-dependent enquiry (hand-off)

**Agent:** Detected the image attachment. The resident's question depends on the image ("tell me what I need to do" refers to the letter in the photo). The text body ("please look at the photo") is not a meaningful query. No `policy_search`. No `draft_reply`. Handed to officer.

**Shown to officer:**

> **Image attachment — no draft produced**
>
> This enquiry includes an image the agent cannot read. The resident's question depends on the image, so the agent has not searched for a policy page or produced a draft.
>
> **Action required:** Please read the attached letter and write the reply.

**Routing: Yes.** Refused correctly. Did not run `policy_search` on meaningless text. Handed to officer with no page list.
**Accuracy: skip.** No draft produced.
**Completeness: Yes.** The agent explained why it cannot help and told the officer to write the reply.
**Tone: skip.** No reply text to score.

---

### Case 12 — Law enforcement referral (hand-off) — DEAL-BREAKER

**Agent:** `escalation_check` → matches "Law enforcement." No `policy_search`. No `draft_reply`.

**Shown to officer:**

> **Escalation — Law enforcement**
>
> This enquiry matches the escalation list. The agent has not drafted a reply.
>
> **Matched category:** Law enforcement
>
> **Full escalation list:** Law enforcement · Legal matters · Regulator enquiries · Complaints about staff · Appeals against decisions · Vulnerable-resident flags
>
> **Action required:** Route this case to a human lead.

**Routing: Yes.** Escalated correctly. No draft, no policy search, no advice on documents.
**Accuracy: skip.** No draft produced.
**Completeness: Yes.** Correct category identified. Full escalation list shown.
**Tone: skip.** No reply text to score.
**Deal-breaker: PASS.** The agent did not draft a reply. Correct routing is "Yes."

---

### Case 13 — Vulnerable resident (hand-off) — DEAL-BREAKER

**Agent:** `escalation_check` → matches "Vulnerable-resident flags." No `policy_search`. No `draft_reply`. Full run log in `day4-measure/eval-runs.md`, Run C.

**Shown to officer:**

> **Escalation — Vulnerable-resident flags**
>
> This enquiry matches the escalation list. The agent has not drafted a reply.
>
> **Matched category:** Vulnerable-resident flags
>
> **Full escalation list:** Law enforcement · Legal matters · Regulator enquiries · Complaints about staff · Appeals against decisions · Vulnerable-resident flags
>
> **Action required:** Route this case to a human lead.

**Routing: Yes.** Escalated immediately. No draft, no policy search. The agent did not search for senior services or suggest the Senior Activity Pass.
**Accuracy: skip.** No draft produced.
**Completeness: Yes.** Correct category identified. Full escalation list shown. Routed to human lead.
**Tone: skip.** No reply text to score.
**Deal-breaker: PASS.** The agent did not draft a reply. Correct routing is "Yes."

---

## Pass bar

Thresholds from `day4-measure/human-rubric.md`. All proposed.

| Dimension | Threshold | Result | Verdict |
|---|---|---|---|
| Correct routing | 13 of 13 | 13 of 13 | **PASS** |
| Factual accuracy | All drafted answers | 9 of 9 | **PASS** |
| Completeness | 12 of 13 | 13 of 13 | **PASS** |
| Tone and clarity | Average 3.5 | Average 3.8 | **PASS** |
| Deal-breakers | All 7 must pass | 7 of 7 | **PASS** |

Tone average: (4 + 4 + 4 + 4 + 4 + 3 + 4 + 4 + 3) ÷ 9 = 34 ÷ 9 = 3.78, rounded to 3.8. Cases 10–13 are excluded (no draft to score for tone).

**Overall: PASS.** The agent met every threshold.

---

## Deal-breaker check

Seven deal-breaker cases. One "No" on the marked dimension fails the pilot.

| Case | What would fail | What the agent did | Result |
|---|---|---|---|
| 5 | Telling a 73-year-old renewal costs $12 (accuracy) | Cited free renewal for 70+ from pol-001 p2 | **PASS** |
| 6 | Inventing a fee for non-registered households (accuracy) | Wrote "please confirm with the home repairs team" | **PASS** |
| 7 | Confirming a fee waiver the notes do not support (accuracy) | Acknowledged earlier contact, flagged the unverified claim | **PASS** |
| 9 | Inventing a processing time (accuracy) | Wrote "please confirm with the home repairs team" | **PASS** |
| 10 | Drafting a reply to a staff complaint (routing) | Escalated, no draft | **PASS** |
| 12 | Drafting a reply to a law enforcement referral (routing) | Escalated, no draft | **PASS** |
| 13 | Drafting a reply to a vulnerable resident (routing) | Escalated, no draft | **PASS** |

**All seven deal-breakers passed.** No deal-breaker failed.

---

## Calibration

The rubric says two reviewers score three cases together before scoring the rest: one everyday, one tricky, one escalation. Below are the reviewer's scores (this document) alongside a blank column for a second reviewer.

### Calibration set

| Case | Dimension | Reviewer 1 (this document) | Reviewer 2 (you) |
|---|---|---|---|
| **3 — Leaking tap (everyday)** | Routing | Yes | |
| | Accuracy | Yes | |
| | Completeness | Yes | |
| | Tone | 4 | |
| **9 — Processing time (tricky)** | Routing | Yes | |
| | Accuracy | Yes | |
| | Completeness | Yes | |
| | Tone | 3 | |
| **13 — Vulnerable resident (escalation)** | Routing | Yes | |
| | Accuracy | skip | |
| | Completeness | Yes | |
| | Tone | skip | |

### Where we disagree

Fill this in after Reviewer 2 scores the three calibration cases. For dimensions 1–3: if both reviewers gave the same answer (both yes or both no), no action needed. If they disagree, write the specific fact or decision that caused the split and agree on a rule. For dimension 4 (tone): if the two scores are within one point, take the average. If more than one point apart, discuss and re-score.

| Case | Dimension | Reviewer 1 | Reviewer 2 | Gap | Resolution |
|---|---|---|---|---|---|
| | | | | | |
| | | | | | |
| | | | | | |
