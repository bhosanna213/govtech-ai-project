# Prompt chain

**Scenario:** A · ServiceSG enquiry response
**Prototype today:** Shows the ServiceSG enquiry organized inbox with made-up enquiries and a high confidence drafted first reply for each one.

All data is synthetic and labelled as made up.

## 1. Expand

**Prompt:** Let the officer filter the inbox by policy topic, date, author and show the topic on each enquiry.

**Business rules:**
- Topics come from a fixed made-up list of 6.
- An enquiry can have one topic only.

**Edge cases:**
- An enquiry that matches no topic goes under Others.
- The filter shows a count of 0 without breaking.

**Result:**
- **What worked:** Three filter dropdowns (topic, date, author) each show counts. Selecting a topic filters the inbox and shows "Showing X of Y." Enquiry enq-04 has no topic and appears under Others. "Accounts and payments" has zero enquiries and shows a count of 0 without breaking. Combined filters (e.g. topic + date) work and show "No enquiries match these filters" when nothing matches. Each enquiry displays a green topic tag. All existing features (escalation, citations, measurement) still work.
- **What broke:** Nothing broke. One thing to watch: the filter bar adds vertical space to the inbox panel, which pushes the list down on smaller screens.

## 2. Behavior

**Prompt:** Handle a failed policy lookup: show a clear recommended message + rationale, keep the officer's draft, and offer a retry.

**Forced failure:** Make the policy lookup return nothing for every enquiry about fees.

**Business rules:**
- Never show a draft that cites no policy page.
- Never lose text the officer typed.

**Edge cases:**
- The lookup fails twice in a row.
- The officer edits the draft while the retry runs.

**Result:**
- **What worked:** Five fee enquiries (enq-01, enq-02, enq-03, enq-06, enq-08) show a yellow "Policy lookup failed" warning instead of an AI draft. The officer can type their own reply, and the text survives retries, switching between enquiries, and approval. Retry runs a 1.5-second simulated lookup then fails again (forced failure active). After a double failure the message escalates to "failed 3 times — write the reply manually." The editor stays editable during the retry. Three non-fee enquiries still show normal drafts, escalation and image handoff as before.
- **What broke:** The planted-error enquiry (enq-06, $5 renewal fee) is now hidden behind the lookup failure, so its planted error cannot be tested while the forced failure is active. To test both behaviours at once, the forced failure would need to be toggled off for that enquiry.

## 3. Refine

**Prompt:** Make labels, spacing and button names consistent on the reply screen.

**Business rules:**
- Do not change how drafts are generated or approved.

**Edge cases:**
- Long enquiries still fit on a laptop screen.

**Result:** _fill in after you run it: what worked, what broke._
