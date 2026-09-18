// Mock source data. In production, returned by GET /api/sources (see services/api.js).

export const sources = [
  {
    id: "src-email",
    type: "Emails",
    records: 128,
    lastProcessed: "Today, 8:52 AM",
    description: "Inbox threads scanned for commitments, deadlines and follow-ups.",
    sample: [
      { subject: "Re: Updated vendor list", from: "Raghav Sethi", time: "8:45 AM" },
      { subject: "July expense variance report", from: "Divya Kapoor", time: "6:00 PM (Tue)" },
      { subject: "Q3 campaign deck — review moved", from: "Neha Iyer", time: "Yesterday" },
    ],
  },
  {
    id: "src-calendar",
    type: "Calendar",
    records: 9,
    lastProcessed: "Today, 7:00 AM",
    description: "Meetings for the current week, cross-referenced against commitments.",
    sample: [
      { subject: "Meridian Logistics call", from: "3:00 – 3:30 PM", time: "Today" },
      { subject: "Board Prep", from: "9:00 – 10:00 AM", time: "Thu" },
      { subject: "Hiring Panel", from: "4:00 – 5:00 PM", time: "Thu" },
    ],
  },
  {
    id: "src-transcript",
    type: "Meeting Transcripts",
    records: 4,
    lastProcessed: "Yesterday, 6:10 PM",
    description: "Transcribed meetings parsed for spoken commitments and action items.",
    sample: [
      { subject: "Leadership Sync", from: "Full transcript", time: "Mon" },
      { subject: "Vendor Review", from: "Full transcript", time: "Tue" },
    ],
  },
  {
    id: "src-voice",
    type: "Voice Notes",
    records: 3,
    lastProcessed: "Today, 9:10 AM",
    description: "Short voice memos transcribed and matched against existing threads.",
    sample: [
      { subject: "Voice Note — vendor list reminder", from: "Arjun Malhotra", time: "Today" },
    ],
  },
];
