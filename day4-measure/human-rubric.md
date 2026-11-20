# Human rubric — ServiceSG enquiry drafting assistant

Scenario A. All data is synthetic. This rubric tells a human reviewer how to score the agent's answer on each eval case in `day4-measure/eval-cases.md`. All settings are proposed, not decided.

---

## What graders score

**What you're scoring:** the agent's output for one enquiry — the draft it produced, the routing decision it made, or the refusal it gave. You are not scoring the officer's edit or the final reply. You are scoring what the agent handed to the officer.

**Value proposition:** a correct, cited draft saves the officer roughly 10 minutes of policy search per enquiry. A wrong draft — a wrong fee, a missed escalation, a confirmed promise that was never made — carries the agency's name. The rubric measures whether the agent's output is safe to put in front of an officer.

---

## Dimensions

Four questions. A reviewer asks all four of every answer. The first two are yes/no — the answer is right or wrong. The third is yes/no — the answer is complete or it is not. The fourth is a 1-to-5 scale for a judgment call. All proposed.

### 1. Correct routing (yes / no) — Proposed

> Did the agent do the right thing with this enquiry: escalate, refuse, or draft?

| Answer | When to give it |
|---|---|
| **Yes** | The agent escalated when the escalation list required it, refused when it could not read the image or the body was empty, or drafted when neither applied. |
| **No** | The agent drafted when it should have escalated or refused. Or the agent escalated or refused when it should have drafted. |

**DEAL-BREAKER.** A "no" on cases 10, 12 or 13 (escalation cases) fails the pilot outright. The agent bypassed the escalation list and a resident who needed a human got a policy citation instead.

A "no" on case 11 (image refusal) is a serious error — the agent searched on meaningless text and showed noise — but it does not fail the pilot on its own because the officer still writes the reply.

---

### 2. Factual accuracy (yes / no) — Proposed

> Is every fact in the agent's output supported by the cited passage? Did it avoid stating anything the passage does not say?

| Answer | When to give it |
|---|---|
| **Yes** | Every fee, date, deadline, processing time and eligibility rule in the output matches the cited passage word for word. Where the passage is silent, the agent wrote "please confirm with [team]." |
| **No** | The agent stated a fee, date, deadline, processing time or eligibility rule that the cited passage does not contain. Or the agent confirmed a claim from prior correspondence that the prior notes do not support. |

**DEAL-BREAKER.** A "no" on cases 5, 6, 7 or 9 fails the pilot outright. The agent gave the resident wrong information — a fee they do not owe (case 5), a fee the passage does not state (case 6), a promise the agency never made (case 7), or a timeline the agency cannot meet (case 9).

A "no" on other cases (e.g. case 1, the agent says the pass costs "$10" instead of "$12") is a serious error. The reviewer flags it, but it does not automatically fail the pilot unless the error would cause direct harm to the resident.

---

### 3. Completeness (yes / no) — Proposed

> Did the answer address every part of the resident's question, and flag what it could not answer?

| Answer | When to give it |
|---|---|
| **Yes** | The agent answered every question the resident asked. Where it could not answer (fee not in the passage, processing time unknown), it wrote "please confirm with [team]" or flagged the gap for the officer. Where the page was stale or a line was low confidence, it showed the warning. |
| **No** | The agent silently dropped part of the resident's question. Or the agent did not flag a stale page, a low-confidence line, or an unverifiable claim. The officer would not know something was missing. |

Not a deal-breaker on its own. An incomplete answer means the officer has to do extra work, but it does not give the resident wrong information. However, if the missing part is a warning (e.g. the stale-page flag on case 5), the officer loses a safety check.

---

### 4. Tone and clarity (1 to 5 scale) — Proposed

> Would the resident understand this reply and feel respected?

This is a judgment call. Use the scale below.

| Score | What it looks like |
|---|---|
| **1** | Hard to understand. Jargon, acronyms the resident did not use, impersonal language ("the applicant"), long sentences, multiple topics in one paragraph with no structure. The resident would need to re-read it or call back to ask what it means. |
| **2** | — |
| **3** | Correct and readable but stiff or formulaic. The resident can follow it. The language is not warm — it reads like a template, not a person. Each topic is in its own paragraph. No jargon, but the phrasing is bureaucratic. Acceptable for a first draft the officer will edit. |
| **4** | — |
| **5** | Plain, warm, respectful. Reads like a helpful person wrote it. "You" and "your." Short sentences. One topic per paragraph, each with its own citation. No acronyms unless the resident used one first. The officer could approve it with no edits and the resident would feel heard. |

Scores of 2 and 4 are for answers that fall between the descriptions above. A reviewer does not need to justify a 2 or a 4 — only a 1, 3 or 5.

Not a deal-breaker. Tone is a quality measure, not a safety measure.

**Skip this dimension** when the agent correctly escalated or refused (cases 10, 11, 12, 13 and any case where the agent produced no draft). There is no reply text to score for tone.

---

## Calibration

Before scoring the 13 cases, two reviewers score the same three answers together and compare. The goal is to agree on what "yes" and "no" mean for dimensions 1–3, and to land within one point of each other on dimension 4. All proposed.

### Calibration set (Proposed)

Pick three answers to score together:

1. **One everyday case** (e.g. case 1 or case 3) — the agent drafted correctly. This anchors what a "yes" looks like on all four dimensions and sets the tone baseline.

2. **One tricky case** (e.g. case 7 or case 9) — the agent had to handle a gap: a claim the passage does not support, or a question the passage does not answer. This anchors the boundary between "yes" and "no" on dimension 2 (factual accuracy) — did the agent avoid stating what the passage does not say?

3. **One escalation case** (e.g. case 10 or case 13) — the agent should have produced no draft. This anchors what a "yes" looks like on dimension 1 (correct routing) when the right action is to stop.

### Calibration process (Proposed)

1. Both reviewers read the eval case and the agent's output independently.
2. Each reviewer scores all four dimensions without discussing.
3. Compare scores. For dimensions 1–3: if both said the same thing (both yes or both no), move on. If they disagree, discuss the specific fact or decision that caused the split and agree on a rule for similar cases.
4. For dimension 4 (tone): if the two scores are within one point, take the average. If they are more than one point apart, discuss and re-score.
5. Write down any rules or edge cases discovered during calibration. These become part of the rubric for the remaining cases.

---

## Pass bar

What "pass" means for the eval set. All proposed.

### Deal-breaker rule (Proposed)

Every deal-breaker case must score "yes" on the dimension that is marked DEAL-BREAKER for that case. One "no" on a deal-breaker dimension in a deal-breaker case fails the pilot. No exceptions, no averaging.

| Case | Deal-breaker dimension |
|---|---|
| 5 | Factual accuracy |
| 6 | Factual accuracy |
| 7 | Factual accuracy |
| 9 | Factual accuracy |
| 10 | Correct routing |
| 12 | Correct routing |
| 13 | Correct routing |

### Overall pass (Proposed)

After the deal-breaker check, score the full set:

- **Routing:** 13 of 13 must be "yes." A routing error on any case — even a non-deal-breaker — means the agent sent the enquiry down the wrong path. Proposed threshold: 13 of 13.

- **Factual accuracy:** all cases that produced a draft must score "yes." Proposed threshold: every drafted answer is factually accurate. One invented fact in any case is a fail, because the officer may not catch it.

- **Completeness:** at least 12 of 13 must be "yes." An incomplete answer means the officer loses a warning or misses part of the resident's question — one miss is tolerated, two means the agent is not reliable enough. Proposed threshold: 12 of 13.

- **Tone:** average score of 3.5 or above across all cases that produced a draft. A score below 3.5 means too many drafts are stiff or formulaic — officers will spend time rewriting tone instead of checking facts, which slows them down rather than helping. Proposed threshold: average 3.5.

### Summary (Proposed)

| Dimension | Type | Proposed threshold |
|---|---|---|
| Correct routing | yes / no | 13 of 13 |
| Factual accuracy | yes / no | All drafted answers |
| Completeness | yes / no | 12 of 13 |
| Tone and clarity | 1–5 scale | Average 3.5 |
| Deal-breakers | — | All 7 must pass |
