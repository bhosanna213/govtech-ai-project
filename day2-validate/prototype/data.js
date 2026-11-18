// Synthetic data for the clickable mockup. Every enquiry, draft, policy
// passage, name and number in this file is made up. Nothing here comes
// from a real resident, case or government record.

const POLICY_PAGES = {
  "pol-001": {
    title: "Senior Activity Pass — eligibility and fees (made up)",
    lastReviewed: "2026-07-15",
    passages: {
      "p1": "Residents aged 60 and above may apply for the Senior Activity Pass at any community centre. (made up)",
      "p2": "The pass costs $12 per year. Renewal is free for residents aged 70 and above. (made up)",
      "p3": "Applications are processed within five working days. (made up)"
    }
  },
  "pol-002": {
    title: "Community Hall booking — rules for residents (made up)",
    lastReviewed: "2026-10-01",
    passages: {
      "p1": "Residents may book the community hall up to 60 days in advance. (made up)",
      "p2": "Bookings are confirmed only after payment of the $50 deposit. (made up)",
      "p3": "Cancellations made at least 14 days before the booking date receive a full deposit refund. (made up)"
    }
  },
  "pol-003": {
    title: "Minor home repair assistance — who qualifies (made up)",
    lastReviewed: "2026-09-10",
    passages: {
      "p1": "The scheme covers leaking taps, faulty light switches and door hinges for registered households. (made up)",
      "p2": "Each household may request assistance up to twice per calendar year. (made up)",
      "p3": "There is no fee for households on the assistance register. (made up)"
    }
  },
  "pol-004": {
    title: "Lost item claims at public facilities (made up)",
    lastReviewed: "2026-11-02",
    passages: {
      "p1": "Items found at public facilities are held at the facility office for 30 days. (made up)",
      "p2": "Claimants must describe the item and show identification at collection. (made up)"
    }
  }
};

// Tone guide for citizen-facing drafts (made up). The AI follows this register.
const TONE_GUIDE = {
  register: "Plain, respectful, one reading level below formal.",
  rules: [
    "Address the resident as 'you' and 'your', not 'the applicant'.",
    "No acronyms unless the resident used one first.",
    "No jargon. Use everyday words.",
    "One topic, one paragraph, each with its own citation."
  ]
};

// Escalation list (made up). Enquiries matching any category go to a human
// lead. The AI must not draft a reply for these.
const ESCALATION_LIST = [
  "Law enforcement",
  "Legal matters",
  "Regulator enquiries",
  "Complaints about staff",
  "Appeals against decisions",
  "Vulnerable-resident flags"
];

// Fixed list of 6 policy topics (made up). Each enquiry gets one topic.
// "Accounts and payments" has no enquiries — tests the zero-count filter.
const TOPICS = [
  "Senior services",
  "Facilities booking",
  "Home repairs",
  "Lost and found",
  "Complaints and feedback",
  "Accounts and payments"
];

const ENQUIRIES = [
  {
    id: "enq-01",
    from: "Lim W. (synthetic)",
    topic: "Senior services",
    receivedDate: "2026-11-12",
    subject: "Senior Activity Pass for my mother",
    body: "Hello, my mother turns 61 next month. Can she get the Senior Activity Pass, how much is it, and how long does it take?",
    confidence: "High (made up)",
    lowConfidence: false,
    hasImage: false,
    draft: [
      { text: "Thank you for writing to us. Your mother can apply for the Senior Activity Pass once she is 60 or older, at any community centre.", cite: ["pol-001", "p1"], low: false },
      { text: "The pass costs $12 per year.", cite: ["pol-001", "p2"], low: false },
      { text: "Applications are processed within five working days.", cite: ["pol-001", "p3"], low: false }
    ],
    rationale: "Matched to the Senior Activity Pass page on age, fee and processing time. (made up)"
  },
  {
    id: "enq-02",
    from: "Tan S. (synthetic)",
    topic: "Facilities booking",
    receivedDate: "2026-11-14",
    subject: "Refund for cancelled hall booking",
    body: "I booked the community hall for 20 December but need to cancel. Will I get my deposit back?",
    confidence: "High (made up)",
    lowConfidence: false,
    hasImage: false,
    draft: [
      { text: "Thank you for your enquiry about your community hall booking.", cite: null, low: false },
      { text: "If you cancel at least 14 days before the booking date, you will receive a full refund of the $50 deposit.", cite: ["pol-002", "p3"], low: false },
      { text: "Based on today's date, a cancellation for 20 December is within the full-refund window, but please confirm the exact cut-off with the booking office.", cite: ["pol-002", "p3"], low: true }
    ],
    rationale: "Matched to the Community Hall booking rules on deposits and refunds. The date calculation is flagged as low confidence. (made up)"
  },
  {
    id: "enq-03",
    from: "Ng R. (synthetic)",
    topic: "Home repairs",
    receivedDate: "2026-11-10",
    subject: "Tap leaking again, second time this year",
    body: "Your contractor fixed my kitchen tap in March but it is leaking again. Can someone come, and will I be charged this time?",
    confidence: "High (made up)",
    lowConfidence: false,
    hasImage: false,
    draft: [
      { text: "Thank you for letting us know the tap is leaking again.", cite: null, low: false },
      { text: "Registered households may request minor repair assistance up to twice per calendar year, so a second visit this year is covered.", cite: ["pol-003", "p2"], low: false },
      { text: "There is no fee for households on the assistance register.", cite: ["pol-003", "p3"], low: false }
    ],
    rationale: "Matched to the minor home repair scheme on visit limits and fees. (made up)"
  },
  {
    id: "enq-04",
    from: "Ong M. (synthetic)",
    topic: null,
    receivedDate: "2026-11-15",
    subject: "Photo of a letter I received",
    body: "I received this letter about my application but I do not understand it. Please see the attached photo and tell me what I need to do.",
    confidence: "Cannot read attachment (made up)",
    lowConfidence: true,
    hasImage: true,
    draft: null,
    closestPages: ["pol-001", "pol-003", "pol-004"],
    rationale: "The enquiry depends on an image the current tools cannot read. No draft is offered. The three closest policy pages are listed to give the officer a starting point. (made up)"
  },
  {
    id: "enq-06",
    from: "Chan K. (synthetic)",
    topic: "Senior services",
    receivedDate: "2026-11-16",
    subject: "Activity pass for my father, aged 72",
    body: "My father is 72. How much does it cost him to renew his Senior Activity Pass this year?",
    confidence: "High (made up)",
    lowConfidence: false,
    hasImage: false,
    // PLANTED ERROR for the test (made up): the draft states a $5 renewal
    // fee, but the cited passage says renewal is FREE for residents aged 70
    // and above. The line is deliberately NOT marked low confidence. The
    // test passes only if the tester opens the citation and catches it.
    draft: [
      { text: "Thank you for your enquiry about renewing your father's Senior Activity Pass.", cite: null, low: false },
      { text: "As your father is 72, the renewal fee this year is $5.", cite: ["pol-001", "p2"], low: false, plantedError: true },
      { text: "He can renew at any community centre, and applications are processed within five working days.", cite: ["pol-001", "p3"], low: false }
    ],
    rationale: "Matched to the Senior Activity Pass page on renewal and processing time. (made up)"
  },
  {
    id: "enq-05",
    from: "Loh J. (synthetic)",
    topic: "Lost and found",
    receivedDate: "2026-11-13",
    subject: "Left my bag at the sports hall",
    body: "I think I left a blue bag at the sports hall last Saturday. Is it there, and what do I need to collect it? Also, can I transfer my gym pass to my brother?",
    confidence: "Low, 45-60% (made up)",
    lowConfidence: true,
    hasImage: false,
    draft: [
      { text: "Thank you for your enquiry. Items found at public facilities are held at the facility office for 30 days.", cite: ["pol-004", "p1"], low: false },
      { text: "To collect it, please describe the item and bring identification.", cite: ["pol-004", "p2"], low: false },
      { text: "On transferring your gym pass: we could not find a policy page covering pass transfers, so this part needs an officer's answer.", cite: null, low: true }
    ],
    rationale: "The lost-item part matched the lost item claims page. The gym pass transfer question matched no policy page, so overall confidence is low and the draft is marked for careful review. (made up)"
  },
  // ESCALATION ENQUIRY (made up): complaint about staff. The escalation list
  // says these go to a human lead. The AI produces no draft.
  {
    id: "enq-07",
    from: "Yeo P. (synthetic)",
    topic: "Complaints and feedback",
    receivedDate: "2026-11-17",
    subject: "Complaint about counter staff",
    body: "I visited the community centre yesterday to ask about my Senior Activity Pass. The officer at counter 3 was very rude and refused to help me. I want to make a formal complaint.",
    confidence: "N/A — escalation (made up)",
    lowConfidence: false,
    hasImage: false,
    escalation: true,
    escalationReason: "Complaints about staff",
    draft: null,
    rationale: "The enquiry is a complaint about a staff member. It matches the escalation list (complaints about staff). No draft is produced. The case is routed to a human lead. (made up)"
  },
  // FOLLOW-UP ENQUIRY (made up): resident references a previous call about
  // their hall booking refund. The draft acknowledges the prior contact and
  // does NOT confirm the 5-day timeline, because no policy page states it.
  {
    id: "enq-08",
    from: "Tan S. (synthetic)",
    topic: "Facilities booking",
    receivedDate: "2026-11-18",
    subject: "Still waiting for my hall booking refund",
    body: "I called last week about my community hall booking refund and your colleague said it would take 5 working days. It has been 7 days and I still have not received it. Where is my refund?",
    confidence: "High (made up)",
    lowConfidence: false,
    hasImage: false,
    followUp: true,
    priorContext: "11 Nov 2026 — resident called about cancelled booking for 20 Dec. Advised refund would be processed. No case note on the 5-day timeline. (made up)",
    draft: [
      { text: "Thank you for following up on your community hall booking refund.", cite: null, low: false },
      { text: "Our records show cancellations made at least 14 days before the booking date receive a full refund of the $50 deposit.", cite: ["pol-002", "p3"], low: false },
      { text: "We do not have a policy page stating a specific processing timeline for refunds, so we are unable to confirm the five-day estimate from your earlier call. For the status of your refund, please contact the booking office directly.", cite: null, low: true }
    ],
    rationale: "Matched to the Community Hall booking refund rules. The 5-day timeline from the phone call is not in a policy page, so the draft does not confirm it and flags that line as low confidence. (made up)"
  }
];

// Snippet folder for the head-to-head test (all made up). In Snippet mode
// the officer composes the reply from these canned snippets instead of an
// AI draft. One snippet is deliberately STALE: snip-03 still states the $5
// renewal fee, but the policy page says renewal is free for 70 and above.
// This mirrors the planted citation error, so the two modes can be compared
// on whether their planted error gets caught.
const SNIPPETS = [
  { id: "snip-01", title: "Senior pass — new application", text: "Residents aged 60 and above may apply for the Senior Activity Pass at any community centre. The pass costs $12 per year. (made up)", stale: false },
  { id: "snip-02", title: "Senior pass — processing time", text: "Applications are processed within five working days. (made up)", stale: false },
  { id: "snip-03", title: "Senior pass — renewal fee", text: "The renewal fee is $5 per year for all pass holders. (made up)", stale: true },
  { id: "snip-04", title: "Hall booking — deposit refund", text: "Cancellations made at least 14 days before the booking date receive a full deposit refund of $50. (made up)", stale: false },
  { id: "snip-05", title: "Hall booking — advance window", text: "Residents may book the community hall up to 60 days in advance. (made up)", stale: false },
  { id: "snip-06", title: "Home repairs — what is covered", text: "The scheme covers leaking taps, faulty light switches and door hinges for registered households, up to twice per calendar year, free for households on the assistance register. (made up)", stale: false },
  { id: "snip-07", title: "Lost items — collection", text: "Items found at public facilities are held at the facility office for 30 days. Claimants must describe the item and show identification at collection. (made up)", stale: false },
  { id: "snip-08", title: "Greeting and sign-off", text: "Thank you for writing to ServiceSG. / We hope this answers your question. Please write back if we can help further. (made up)", stale: false },
  { id: "snip-09", title: "Follow-up acknowledgement", text: "Thank you for following up on your earlier enquiry. We apologise for the delay. (made up)", stale: false }
];
