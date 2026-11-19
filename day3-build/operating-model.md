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
| **Incident** | Kill-switch response, wrong-reply investigation, accountability table | Supervisor (immediate response), Frontline director (threshold changes) | Engineering lead, Policy team lead | Executive sponsor, Enquiry officers |
| **Retire** | Decision to stop the agent — kill switch pattern, fail line breached, sponsor decision | Executive sponsor | Frontline director, Engineering lead | Enquiry officers, Policy team lead, Supervisor |
