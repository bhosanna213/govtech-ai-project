# Operating model — ServiceSG enquiry drafting assistant

Scenario A. All data is synthetic. This file says who decides what about the AI harness, who is consulted before the decision, and who is told after.

---

## Roles

Six roles govern the agent. These are roles, not people — one person may hold more than one role.

| Role | What they do |
|---|---|
| Enquiry officer | Uses the agent daily. Reviews drafts, opens citations, edits and approves replies. Cannot send without approving. |
| Supervisor | Oversees a team of officers. Gets notified when a kill switch fires. Reviews session logs and decides next steps with the officer. |
| Policy team lead | Owns the policy pages the agent cites. Sets the confidence threshold (0.70 for the pilot). Maintains the escalation list. Reviews pages on a 90-day cycle. |
| Frontline director | Sets operational parameters: kill-switch thresholds, session clock, escalation list sign-off. Agreed the three kill-switch thresholds. |
| Engineering lead | Builds and maintains the system. Chooses the AI model, retrieval pipeline, backend architecture. Implements thresholds and config as code. |
| Executive sponsor | Approves the pilot, the accountability table and the go-live decision. Required accountability design before the pilot can start. |

---

## Decision rights

One row per decision area. Columns say who decides, who is consulted before the decision, and who is told after.

| Decision area | Harness part | Who decides | Who is consulted | Who is told |
|---|---|---|---|---|
| **Scope** | Which enquiry types the agent handles, coverage floor, image and language exclusions | Frontline director | Policy team lead, Engineering lead | Enquiry officers, Executive sponsor |
| **Permissions** | The 30 actions in the read / draft / write / send tiers and their auto / confirm / block settings | Frontline director | Policy team lead, Engineering lead | Enquiry officers, Supervisor |
| **Vendor and model** | AI model, retrieval pipeline, embedding strategy, confidence threshold value | Engineering lead (model and pipeline), Policy team lead (threshold value) | Frontline director | Executive sponsor |
| **Go-live** | Pilot start, production rollout, fail-line sign-off | Executive sponsor | Frontline director, Engineering lead, Policy team lead | Enquiry officers, Supervisor |
| **Incident** | Kill-switch response, wrong-reply investigation, accountability table, manual emergency pause | Supervisor (immediate response), Frontline director (threshold changes) | Engineering lead, Policy team lead | Executive sponsor, Enquiry officers |
| **Retire** | Decision to stop the agent — kill switch pattern, fail line breached, sponsor decision | Executive sponsor | Frontline director, Engineering lead | Enquiry officers, Policy team lead, Supervisor |

---

## Incident response

What happens when a wrong answer reaches a resident. Walked through a made-up incident: at 08:00 on Monday the agent drafts a reply with a wrong fee, the officer approves it, and the reply goes out.

### Manual emergency pause

The three kill switches are automatic, but they only fire on specific patterns (planted error approved, zero citations opened, >60% rewrite). If none fires — for example, the officer opened one citation but not the one with the error — the agent keeps drafting. The operating model had no way for a person to stop it.

**Added:** The supervisor can pause the agent manually. Pausing stops all new drafts immediately. Officers can still approve or reject drafts already on screen. Only the frontline director or the supervisor can unpause.

### Steps

| Step | Who acts | What they do | When |
|---|---|---|---|
| 1 | Enquiry officer | Notices the error (or a resident reports it). Tells the supervisor. | As soon as the error is found |
| 2 | Supervisor | Pauses the agent (manual emergency pause). No new drafts until unpaused. | Within 15 minutes of being told |
| 3 | Supervisor | Pulls the session log for the enquiry. Identifies the cause using the accountability table (see below). | Same day |
| 4 | Enquiry officer | Sends a corrected reply to the resident, approved by the supervisor. | Same day |
| 5 | Supervisor | Tells the frontline director: what went wrong, which accountability row, whether the agent should stay paused. | Same day |
| 6 | Frontline director | Tells the executive sponsor. Decides whether to change a threshold or keep the agent paused. | Within 24 hours |
| 7 | Engineering lead or Policy team lead | Fixes the root cause (stale page republished, model investigated, or officer retrained). | Agreed with frontline director |
| 8 | Frontline director | Unpauses the agent, or escalates to the executive sponsor for a retire decision. | After the fix is confirmed |

### Accountability table

Which row applies depends on what caused the wrong answer. From the AI PRD (decision 1).

| Wrong reply cause | Owner | How it is detected | Fix path |
|---|---|---|---|
| Stale policy page | Policy team lead | The page was last reviewed more than 90 days ago; the stale-page warning was shown but the officer approved anyway, or the page was just under 90 days and no warning appeared | Policy team lead reviews and republishes the page |
| Bad AI draft | Engineering lead | The draft stated something the cited passage does not say, or the retrieval returned the wrong page | Engineering lead investigates the model output or retrieval pipeline |
| Rushed officer approval | Enquiry officer | The officer approved without opening the cited passage (rubber-stamping), or opened it but did not read carefully enough to catch the error | Supervisor reviews the session log with the officer |

### What was missing before this section

1. No incident steps — the supervisor knew they were responsible but not what to do or in what order.
2. No manual emergency pause — the only way to stop the agent was a permanent retire decision by the executive sponsor, or waiting for an automatic kill switch that might not fire.
3. No resident correction step — a wrong reply went out but no role was responsible for sending the correction.
4. No timeline — no expectation of how fast each step should happen.
