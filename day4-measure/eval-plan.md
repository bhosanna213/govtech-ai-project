# Eval plan — ServiceSG enquiry drafting assistant

Scenario A. All data is synthetic. This file says who runs the eval, when, how to tell whether it is working, and what happens in the first 30 days. All settings are proposed, not decided.

---

## Who owns what (Proposed)

| Responsibility | Role | What they do |
|---|---|---|
| **Signs the pass bar** | Frontline director | Reviews the eval results, confirms the thresholds are met, and signs off before the pilot starts or after any re-run. The executive sponsor sees the signed results but does not score cases. |
| **Writes and refreshes test cases** | Engineering lead | Writes new eval cases when the agent's scope changes (new policy pages, new enquiry types, new tools). Reviews existing cases when policy pages are updated. Removes cases that no longer apply. The policy team lead is consulted on whether a case still reflects real enquiry patterns. |
| **Runs the eval** | Engineering lead | Runs every case through the agent, records the output, and prepares the scorecard. Follows the run procedure in `day4-measure/human-rubric.md`. |
| **Scores the eval** | Engineering lead + one other reviewer | Two reviewers score independently using the rubric. The second reviewer should be someone who understands the policy pages — the policy team lead or a senior enquiry officer. Calibrate before the first run and when reviewers change (see `day4-measure/human-rubric.md`, Calibration). |
| **Reviews a weekly sample** | Supervisor | Each week during the pilot, the supervisor reviews a sample of 10 live agent drafts (approved, edited and rejected) against the same rubric dimensions. This is not the full eval — it is a spot check to catch drift between eval runs. The supervisor flags any draft that would score "No" on routing or accuracy, and reports to the engineering lead. |

---

## When it runs (Proposed)

### Before go-live

Run the full eval (all cases) and pass every threshold before the pilot starts. The frontline director signs the results. This is the gate — if the eval does not pass, the pilot does not start. See `day4-measure/human-rubric.md`, What happens on fail.

### Before every change

Re-run the full eval after any change to:

- **Agent instructions** (`day3-build/CLAUDE.md`) — a prompt edit, a new tool, a changed permission, a new stop condition.
- **Retrieval pipeline** — a different model, a new embedding strategy, a changed confidence threshold.
- **Escalation list** — a category added, removed or redefined.

The re-run uses the same cases and rubric. Record the commit hash of the changed file (see `day4-measure/human-rubric.md`, Version tracking). If the agent instructions and the policy pages both changed, treat the re-run as a new baseline — do not compare scores to the previous run.

### Every week (during the pilot)

The supervisor's weekly sample (10 live drafts) is not a full eval run. It is a spot check. If the supervisor flags a draft that would fail on routing or accuracy:

1. The engineering lead investigates the case.
2. If the failure would have been caught by an existing eval case, the eval is still valid — the issue is in the live agent, not the eval.
3. If no existing case covers the failure, the engineering lead writes a new case and re-runs the full eval.

### When policy pages change

The policy team lead reviews each policy page on a 90-day cycle. When a page changes:

1. The engineering lead checks whether any eval case depends on the changed passage.
2. If yes, update the case's expected answer and the policy page reference table in the rubric.
3. Re-run the full eval. Record the policy page change in version tracking.

If the change is a correction (the old passage was wrong), also check whether any live drafts cited the old passage during the period it was stale.

---

## How I'll know it's working (Proposed)

### Goal

The agent produces drafts that officers can send after a light edit — correct facts, correct routing, no deal-breaker failures — so officers spend less time searching policy pages and more time helping residents.

### Baseline

The first eval run scored:

| Dimension | Baseline score |
|---|---|
| Correct routing | All cases passed |
| Factual accuracy | All drafted answers passed |
| Completeness | All cases passed |
| Tone and clarity | Average 3.9 out of 5 |
| Deal-breakers | All 7 passed |

Full results in `day4-measure/eval-results.md`.

### Target and review date (Proposed)

| Metric | Target | Review date |
|---|---|---|
| Eval pass bar | Meet all thresholds on every run | Every run |
| Pilot accept rate | 8 in 10 drafts sent after a light edit by the end of the two-week pilot | End of pilot |
| Weekly sample | No routing or accuracy failures in the supervisor's 10-draft sample | Weekly during pilot |
| Tone | Average 4.0 or above (improvement from 3.9 baseline) | 30 days after pilot start |

The pilot accept rate target (8 in 10) is from `one-pager.md`. If the rate is below 5 in 10, the pilot fails and the team decides whether to fix or retire the agent.

### Usage metric (Proposed)

**Accept-as-is rate:** the share of drafts the officer approves without editing. Checked weekly. Target: 8 in 10 by end of pilot. This measures trust — if officers rewrite most drafts, the agent is not saving time.

Track alongside:

- **Time to decision:** seconds from opening the enquiry to approving, editing or rejecting the draft. A drop means the agent is helping; a rise means officers are spending time checking or rewriting.
- **Citations opened:** how many cited passages the officer clicks before approving. Zero is a warning (rubber-stamping kill switch). One or more means the officer is checking.

### Pattern to watch first (Proposed)

**Tone scores of 3 on cases where the agent's main answer is "please confirm with [team]."** Cases 6 and 9 both scored 3 — the agent is correct but stiff when it cannot give a straight answer. If this pattern appears in the weekly sample (the supervisor sees redirect drafts that officers always rewrite), the tone guide in `day3-build/CLAUDE.md` needs adjusting. This is not a safety issue, but it determines whether officers trust the drafts enough to use them.

### Stop line (Proposed)

The pilot stops if:

1. **Any deal-breaker fails** on a full eval run. The agent broke a business rule that protects residents. Report to the frontline director. Do not re-run until the agent instructions or retrieval pipeline are fixed.
2. **Accept rate below 5 in 10** at the end of the pilot. Officers do not trust the drafts enough to use them.
3. **A kill switch fires during the pilot** — planted error approved, rubber-stamping detected, or full rewrite. The supervisor pauses the agent immediately (see `day3-build/operating-model.md`, Incident response).
4. **The supervisor's weekly sample finds a routing or accuracy failure not covered by an existing eval case**, and the engineering lead cannot write a case and re-pass the eval within one week. The eval set has a gap.

---

## First 30 days (Proposed)

A week-by-week plan for the first month. All dates are relative to pilot start.

### Before day 1

- [ ] Run the full eval. All thresholds must pass.
- [ ] Frontline director signs the eval results.
- [ ] Confirm the second reviewer for ongoing runs (policy team lead or senior enquiry officer).
- [ ] Confirm the supervisor who will do the weekly sample.
- [ ] Executive sponsor approves the pilot start.

### Week 1 (days 1–7)

- [ ] Pilot starts. The agent drafts replies for live enquiries. Officers approve, edit or reject.
- [ ] Supervisor reviews the first weekly sample (10 drafts). Report any routing or accuracy flags to the engineering lead.
- [ ] Engineering lead checks the agent logs: time to decision, citations opened, accept-as-is rate.
- [ ] If any kill switch fires, follow incident response steps in `day3-build/operating-model.md`.

### Week 2 (days 8–14)

- [ ] Supervisor reviews the second weekly sample.
- [ ] Engineering lead checks whether the tone-3 pattern (redirect drafts officers always rewrite) is appearing in live data.
- [ ] End of pilot window. Calculate the accept rate. If 8 in 10 or above, the pilot passes. If below 5 in 10, the pilot fails.
- [ ] If any policy page was updated during the pilot, re-run the full eval with the updated page.

### Week 3 (days 15–21)

- [ ] If the pilot passed, the frontline director and executive sponsor decide whether to continue or expand.
- [ ] Engineering lead writes new eval cases for any enquiry pattern that appeared in live data but is not covered by the existing 13 cases.
- [ ] If new cases were added, re-run the full eval and re-calibrate if needed.

### Week 4 (days 22–30)

- [ ] Supervisor reviews the fourth weekly sample.
- [ ] Engineering lead compiles a 30-day report: eval pass history, accept rate trend, time-to-decision trend, any kill switches or incidents, any new cases added.
- [ ] Policy team lead confirms all cited pages are within the 90-day review window.
- [ ] Frontline director reviews the 30-day report and decides: continue as-is, adjust thresholds, or escalate to the executive sponsor for a retire decision.
- [ ] If the tone target (average 4.0) is not met, review the tone guide in `day3-build/CLAUDE.md` and plan an adjustment.
