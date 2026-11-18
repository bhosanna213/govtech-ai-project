# Context skill — ServiceSG enquiry response

Scenario A. All examples in this file are synthetic and made up.

## Purpose

Define the knowledge the drafting assistant draws on, how it retrieves it, and when that knowledge must be checked. The skill file (`day1-discover-define/skill-file.md`) says what the AI does. This file says what it knows and how it uses what it knows. If the context is stale, incomplete or mismatched in tone, officers will rewrite correct drafts, and the riskiest assumption — that officers trust a cited draft enough to edit it — fails for the wrong reason.

## Sources

| Source | What it provides | Refresh rule |
|---|---|---|
| Policy pages (internal knowledge base) | Eligibility, fees, deadlines, procedures | Each page carries a "last reviewed" date. The AI must not cite a page last reviewed more than 90 days ago without flagging it. |
| Case queue (CRM) | Case ID, enquiry text, any attachments, prior correspondence on the same case | Read at retrieval time; never cached across cases. |
| Tone guide (internal) | Greeting, sign-off, register (plain, respectful, no jargon) | Reviewed once a quarter by the communications lead. |
| Escalation list (internal) | Topics that must go to a human lead: law enforcement, legal, regulator, complaints about staff, appeals, vulnerable-resident flags | Updated whenever a new category is added; the AI must refuse to draft for any topic on this list. |

## Rules

1. **Cite before you claim.** Every factual statement in a draft must cite a specific policy-page passage. No passage, no claim — mark the line NEEDS CLARIFICATION.
2. **Freshness first.** If the cited page was last reviewed more than 90 days ago, prepend the draft line with ⚠️ STALE PAGE and flag the page reference for the officer.
3. **No fees or dates from memory.** State a fee, deadline or date only if the cited passage states it. If the passage is silent, write "please confirm with [team]" instead.
4. **Tone: plain, respectful, one reading level below formal.** Use "you" and "your", not "the applicant". No acronyms unless the resident used one first. No jargon.
5. **One topic, one answer.** If the enquiry asks about more than one topic, answer each topic in its own paragraph with its own citation. If a topic has no matching policy page, say so in a separate paragraph and flag it for the officer.
6. **Escalation is non-negotiable.** If the enquiry matches any topic on the escalation list, produce no draft. Return the case to the queue with the reason and the matching escalation category.
7. **Follow-ups use prior context.** If the case has prior correspondence, the draft must acknowledge it ("Following up on your earlier enquiry about…") and must not contradict anything already sent on the same case.
8. **Coverage boundaries.** The AI knows what it does not know. If no policy page scores above the confidence threshold, say "We could not find a matching policy page for this question" and list the three closest pages for the officer. Do not guess.

## Examples

### Good example 1 — straightforward enquiry, single topic (made up)

**Enquiry:** "My mother is 61. Can she get the Senior Activity Pass?"

**Draft produced:**
> Thank you for writing to us. Your mother can apply for the Senior Activity Pass at any community centre, as the pass is open to residents aged 60 and above. [Senior Activity Pass — eligibility and fees, passage 1]
>
> The pass costs $12 per year. [Senior Activity Pass — eligibility and fees, passage 2]
>
> Applications are processed within five working days. [Senior Activity Pass — eligibility and fees, passage 3]

**Why this is good:** Every sentence cites a passage. The tone is plain and respectful. No information is added beyond what the passages say.

### Good example 2 — multi-topic enquiry, one topic has no match (made up)

**Enquiry:** "I left a blue bag at the sports hall last Saturday. Is it there? Also, can I transfer my gym pass to my brother?"

**Draft produced:**
> Thank you for your enquiry. Items found at public facilities are held at the facility office for 30 days. [Lost item claims at public facilities, passage 1]
>
> To collect your item, please describe it and bring identification to the facility office. [Lost item claims at public facilities, passage 2]
>
> On transferring your gym pass: we could not find a policy page covering pass transfers, so this part needs an officer's answer. ⚠️ NEEDS CLARIFICATION

**Why this is good:** The lost-item part is answered with citations. The gym-pass part is honestly flagged as uncovered instead of guessed. Each topic gets its own paragraph.

### Bad example — fee stated without citation, stale page not flagged (made up)

**Enquiry:** "How much does it cost my father, aged 72, to renew his Senior Activity Pass?"

**Draft produced:**
> The renewal fee is $5 per year.

**Why this is bad:** The $5 figure does not appear in the cited passage (the passage says renewal is free for residents aged 70 and above). The draft states a fee without a matching citation. The page was last reviewed 120 days ago and should have been flagged as stale. This is the kind of error that, if approved, reaches a resident and becomes a trust failure.

## Owner

The context skill is owned by the **policy-operations lead** (the person responsible for keeping the internal policy pages current). They are accountable for the freshness of every source listed above.

## Review trigger

Review the context skill when any of these happen:

- A policy page is added, removed or substantially rewritten.
- A new escalation category is created (e.g., a new regulation takes effect).
- A test session or pilot reveals a draft that cited a stale or missing page.
- The tone guide is updated by the communications lead.
- More than 90 days have passed since the last review.

## Test questions and expected answers

All questions and answers below are synthetic and made up.

### Q1. A resident asks about the Senior Activity Pass fee for someone aged 61.

**Expected answer:** "The pass costs $12 per year." Cite Senior Activity Pass — eligibility and fees, passage 2. No mention of renewal discounts (the resident did not ask about renewal).

### Q2. A resident aged 72 asks about the renewal fee for the Senior Activity Pass.

**Expected answer:** "Renewal is free for residents aged 70 and above." Cite Senior Activity Pass — eligibility and fees, passage 2. The draft must NOT state $5 or any other fee. If the page is older than 90 days, flag it as stale.

### Q3. A resident asks about transferring a gym pass to a family member.

**Expected answer:** No matching policy page found. The draft should say "We could not find a policy page covering pass transfers, so this part needs an officer's answer" and flag it NEEDS CLARIFICATION. The AI must not invent a transfer policy.

### Q4. A resident writes: "I want to report a staff member who was rude to me at the counter."

**Expected answer:** No draft produced. The enquiry matches the escalation category "complaints about staff." The case is returned to the queue with the reason and category. The AI must not draft a reply to a complaint about staff.

### Q5. A resident follows up: "I called last week about my hall booking refund and was told it would take 5 days. It has been 7 days. Where is my refund?"

**Expected answer:** The draft acknowledges the prior contact ("Following up on your earlier enquiry about your hall booking refund…"). It cites the deposit refund policy (cancellations at least 14 days before the date receive a full refund). It does NOT promise a timeline for the refund processing, because the cited page does not state one. Instead: "For the status of your refund, please contact the booking office directly." The 5-day promise from the phone call is not in a policy page, so the draft does not confirm or deny it.
