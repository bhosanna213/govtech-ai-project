# Agent control panel — ServiceSG enquiry drafting assistant

Scenario A. All data is synthetic. This file maps each tool the agent uses to a permission tier and a proposed setting. The full 30-action permissions table is in `day3-build/ai-prd.md`.

---

## Permissions

One row per tool. All settings are proposed, not decided — review the stress test evidence and confirm or change each one.

**Tiers:**
- **read** — retrieves or looks up information. No content created.
- **draft** — creates text that an officer will review. Nothing reaches the resident.
- **write** — changes internal state or logs.
- **send** — communicates with residents or external systems.

**Settings:**
- **auto** — the agent calls the tool without asking.
- **confirm** — the agent calls the tool, but the result takes effect only after the officer confirms.
- **block** — the agent never calls this tool.

| Tool | Tier | Setting (Proposed) | Stress test evidence |
|---|---|---|---|
| `policy_search` | read | auto | Run 4: searched on an empty body, got noise results (0.15–0.22). Run 6: returned nothing 3 times, triggered stop condition 4. Run 7 (rerun): the must-not rule blocked the empty-body search. Without the rule, auto lets the agent search on meaningless input and show noise to the officer. |
| `page_fetch` | read | auto | Run 5: the resident cited POL-099 (does not exist). The agent did not fetch it because `policy_search` did not return it. The must-not rule now blocks `page_fetch` on pages not in the search results. Without the rule, nothing stops the agent from fetching a page ID the resident names. |
| `draft_reply` | draft | auto | Run 1: drafted correctly, officer edited lightly and approved. Run 5: drafted from the real page, did not confirm the resident's false refund claim. The draft goes to the officer for review (checkpoint 1) — the officer is the confirm gate. |
| `stale_check` | read | auto | Run 5: caught pol-001 as stale (127 days). The stale-page warning appeared and the officer reviewed it. No stress test broke this tool. |
| `escalation_check` | read | auto | Run 2: correctly caught "Appeals against decisions" and routed to a human lead. Runs 4–7: correctly returned no match on non-escalation inputs. No stress test broke this tool. |
| `prior_context_fetch` | read | **not decided** | Not exercised in any run — no inputs had prior correspondence. No evidence on how it handles edge cases (e.g. a resident claims prior contact that did not happen). The business owner would not sign auto without a stress test. See open decision 14 in `ai-prd.md`. |

No tools are in the **write** or **send** tier. Logging (write) and reply delivery (send) are system actions, not agent tools. The agent has no tool that sends, posts or publishes content — this is a hard block in `CLAUDE.md`.
