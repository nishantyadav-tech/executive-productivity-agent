// Mock task data for the Executive Productivity Agent.
// In production, this shape is returned by GET /api/tasks (see services/api.js).

export const TASK_STATUS = {
  PENDING: "Pending",
  WAITING: "Waiting",
  SCHEDULED: "Scheduled",
  RECEIVED: "Received",
  UNASSIGNED: "Unassigned",
  COMPLETED: "Completed",
};

export const PRIORITY = {
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
};

export const myActions = [
  {
    id: "task-001",
    title: "Send updated vendor list to Raghav",
    description:
      "Commitment made during the Leadership Sync and reiterated by email and voice note. Raghav followed up Wednesday at 8:45 AM asking for status.",
    owner: "Arjun Malhotra",
    recipient: "Raghav Sethi",
    deadline: "Wednesday morning",
    dueBucket: "today",
    status: TASK_STATUS.PENDING,
    priority: PRIORITY.HIGH,
    isOverdue: true,
    mergedFrom: 3,
    sources: ["Leadership Sync", "Vendor List Email", "Voice Note"],
  },
  {
    id: "task-002",
    title: "Review July Expense Variance Report",
    description:
      "Divya committed to sending the July variance report by Wednesday evening. The report arrived Wednesday at 6:00 PM and is ready for your review.",
    owner: "Arjun Malhotra",
    recipient: "Divya Kapoor",
    deadline: "Wednesday evening",
    dueBucket: "today",
    status: TASK_STATUS.RECEIVED,
    priority: PRIORITY.MEDIUM,
    sources: ["Email"],
  },
  {
    id: "task-003",
    title: "Prep talking points for Board meeting",
    description:
      "Board prep session is on Thursday morning. Draft the three key talking points on pipeline health before the session.",
    owner: "Arjun Malhotra",
    recipient: null,
    deadline: "Thursday, 9:00 AM",
    dueBucket: "upcoming",
    status: TASK_STATUS.PENDING,
    priority: PRIORITY.MEDIUM,
    sources: ["Calendar"],
  },
  {
    id: "task-004",
    title: "Confirm hiring panel questions",
    description:
      "Hiring panel is scheduled for Thursday afternoon. Confirm the interview scorecard with HR beforehand.",
    owner: "Arjun Malhotra",
    recipient: "HR Team",
    deadline: "Thursday, 3:30 PM",
    dueBucket: "upcoming",
    status: TASK_STATUS.PENDING,
    priority: PRIORITY.LOW,
    sources: ["Calendar", "Email"],
  },
];

export const waitingOnOthers = [
  {
    id: "wait-001",
    title: "Review Q3 Campaign Deck",
    description:
      "Neha is preparing the campaign deck. The review slot moved from Wednesday to Thursday at 9:30 AM after a scheduling conflict.",
    owner: "Arjun Malhotra",
    waitingOn: "Neha Iyer",
    deadline: "Thursday, 9:30 AM",
    dueBucket: "upcoming",
    status: TASK_STATUS.SCHEDULED,
    priority: PRIORITY.MEDIUM,
    sources: ["Email", "Calendar"],
  },
  {
    id: "wait-002",
    title: "Vendor contract redlines",
    description:
      "Legal is reviewing the redlined vendor contract before it goes back to procurement. No response since Monday.",
    owner: "Arjun Malhotra",
    waitingOn: "Legal Team",
    deadline: "No date given",
    dueBucket: "none",
    status: TASK_STATUS.WAITING,
    priority: PRIORITY.LOW,
    sources: ["Email"],
  },
];

export const unclearOwnership = [
  {
    id: "unclear-001",
    title: "Confirm who is handling Mumbai office lease renewal",
    description:
      "The lease renewal deadline is approaching and no owner has been confirmed in any email, meeting, or voice note. Ownership must be confirmed before the deadline — the agent will not assume Facilities is responsible.",
    owner: null,
    deadline: "Friday, 25 September, EOD",
    dueBucket: "this-week",
    status: TASK_STATUS.UNASSIGNED,
    priority: PRIORITY.HIGH,
    flagged: true,
    sources: ["Email", "Meeting Transcript"],
  },
];

export const allTasks = [...myActions, ...waitingOnOthers, ...unclearOwnership];

export const summaryStats = {
  myActions: myActions.filter((t) => t.status !== TASK_STATUS.COMPLETED).length,
  waitingOnOthers: waitingOnOthers.length,
  overdue: allTasks.filter((t) => t.isOverdue).length,
  unclearOwnership: unclearOwnership.length,
};
