// Mock Q&A responses. In production, returned by POST /api/ask (see services/api.js).

export const suggestedQuestions = [
  "What did I promise Raghav?",
  "What needs action today?",
  "What am I waiting for?",
  "What's overdue?",
  "What's still unassigned?",
  "What meetings do I have today?",
];

export const mockResponses = {
  "What did I promise Raghav?": {
    answer:
      "You committed to sending Raghav the updated vendor list. The latest commitment is Wednesday morning, and Raghav followed up Wednesday at 8:45 AM. The task is currently pending.",
    sources: ["Leadership Sync", "Vendor List Email", "Voice Note 1"],
  },
  "What needs action today?": {
    answer:
      "Two items need action today: sending the updated vendor list to Raghav (high priority, pending since this morning), and reviewing the July expense variance report Divya sent yesterday evening.",
    sources: ["Vendor List Email", "Voice Note", "Expense Report Email"],
  },
  "What am I waiting for?": {
    answer:
      "You're waiting on Neha for the Q3 campaign deck — the review slot moved from Wednesday to Thursday at 9:30 AM. You're also waiting on Legal for redlines on the vendor contract, with no response since Monday.",
    sources: ["Email", "Calendar"],
  },
  "What's overdue?": {
    answer:
      "Nothing is formally overdue right now, but the vendor list for Raghav is at risk — it was due this morning and hasn't been sent yet.",
    sources: ["Vendor List Email", "Leadership Sync"],
  },
  "What's still unassigned?": {
    answer:
      "The Mumbai office lease renewal has no confirmed owner. The deadline is Friday, 25 September, end of day. No email, meeting or voice note assigns this to a specific person or team — this needs to be confirmed rather than assumed.",
    sources: ["Email", "Meeting Transcript"],
  },
  "What meetings do I have today?": {
    answer:
      "Today you have the sales ops standup at 9:00 AM, a 1:1 with Neha at 11:00 AM, the confirmed Meridian Logistics call from 3:00–3:30 PM, and an end-of-day sync with Raghav at 5:00 PM.",
    sources: ["Calendar"],
  },
};

export const defaultResponse = {
  answer:
    "I don't have enough information from your emails, calendar, meeting transcripts or voice notes to answer that confidently yet. Try one of the suggested questions, or rephrase your question.",
  sources: [],
};
