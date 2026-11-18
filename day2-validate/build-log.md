# Build log

What changed in the prototype, newest first. One entry per change.

## Three leaders

Pushback exercise: three leaders challenge the prototype, one at a time. Their objections, my replies, and what the prototype must prove. The leaders are role-played; the exchange is part of Day 2 validation.

### 1. Director who runs the frontline work

**Objection:** The prototype tests the happy moment only. The inbox is busiest in the week after a policy change, which is when the cited policy pages are most likely stale or contradictory — a confidently cited draft from a stale page is worse than no draft, because the citation buys trust exactly when it shouldn't. And the 8-in-10 pass line can be hit by officers approving without reading; the prototype cannot tell a light edit from a rubber stamp.

**My reply:** Accepted both points. Before asking for more officer time: (1) seed the synthetic policy pages with deliberate staleness — a changed fee, a moved date — and pass only if officers catch the error using the side-by-side citation; (2) measure reading, not just editing — time on draft before Approve, and whether at least one cited passage was opened; approved-without-reading counts as a failure even when the draft was right; (3) run at least one session under mild time pressure, several enquiries and a clock. Asked her for one experienced officer for a 30-minute session and a realistic (synthetic) stale-page test case. If officers cannot catch a planted error under light pressure, that is the kill switch.

**What the prototype must prove:** Officers catch a planted stale-page error using the citations, under mild time pressure, without rubber-stamping.

### 2. Head of product

**Objection:** The baseline and the goal contradict each other: the one-pager's status quo says 90% within SLA and a 1-day average first reply, while the goal is a correct first reply within one working day — by those numbers the goal is already met. The real value is the 10 minutes of policy search per enquiry, but it is unsized (enquiries per day, officers, value of recovered minutes). Citation-grounded drafting is the hardest version of the feature, 1 in 5 enquiries has an unreadable image capping coverage at 80%, and a cheap text-expander with canned snippets might do the job for a tenth of the cost.

**My reply:** Accepted the contradiction; the one-pager will be fixed — either correct the baseline numbers or rebuild the case honestly on search minutes saved, sized as enquiries per day x minutes x officer time, with labelled synthetic values. On the text-expander: snippets solve the writing but leave the finding, and stale snippets after a policy change are harder to catch than stale citations — but that is a hypothesis, so the test session will run a head-to-head: the same synthetic enquiries answered with the cited draft versus a snippet folder, measuring time to an approved correct reply and errors caught. If the cited draft does not win on time or error rate, the recommendation will be to fund the snippets. On images: those enquiries already take the slow path today; the prototype routes them to the officer with no draft, so the ROI case rests on the 80% and image handling is deliberately out of scope.

**What the prototype must prove:** The cited draft beats canned snippets on time to an approved correct reply, or on errors caught, in a like-for-like test.

### 3. Chief executive sponsor

**Objection:** The others asked whether it works; her question is who answers when it fails. At volume, an 8-in-10 pass rate means failures carry her name: a wrong fee approved by an officer becomes "government AI gives resident wrong information" — a headline, a parliamentary question, and a freeze on every AI initiative. The design has guardrails for the officer but no accountability: if an approved-but-wrong reply defaults to the officer who clicked Approve, the tool transfers blame downward, officers will protect themselves by rewriting everything, and the kill-switch condition arrives on schedule. Also: the one-pager's success signal date of 20 November is this Friday.

**My reply:** The error belongs to the cause, not the click. Before the pilot: (1) a one-page accountability note, agreed with the frontline director, tracing a wrong reply to its source — stale page, bad draft, or rushed approval — each with its own owner and fix; if the note cannot be agreed, the pilot does not start. (2) Prove the incident path in the test session: plant one error end-to-end and watch it get caught, the resident corrected, the lesson logged; if it is not caught, the pilot does not proceed. (3) Translate the pilot thresholds into wrong-but-sent replies per week at synthetic volume, and bring her that number to accept or reject before the pilot. (4) The 20 November date is an honest error, set early and never revisited; the one-pager will get a realistic date once test sessions are scheduled. The ask is not approval to ship but approval to run the test that produces the note, the incident-path proof and the real numbers.

**What the prototype must prove:** A planted error is caught, corrected and logged end-to-end in the test session, under an accountability design agreed with the frontline director.

## 18 Nov 2026

Redesigned the user experience to make it more seamless for the user and feel modern. Only the styling in `prototype/index.html` changed; the behaviour and the synthetic data did not.
