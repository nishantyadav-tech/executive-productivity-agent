// Mock calendar data. In production, returned by GET /api/calendar (see services/api.js).

export const today = {
  label: "Friday, 25 September 2026",
  weekday: "Friday",
  dateNum: 25,
};

export const todayEvents = [
  {
    id: "evt-f1",
    time: "10:00 – 10:30 AM",
    title: "Facilities Check-in",
    type: "internal",
  },
  {
    id: "evt-f2",
    time: "1:00 – 2:00 PM",
    title: "Blocked",
    type: "internal",
  },
];

export const weekSchedule = [
  {
    day: "Monday",
    date: "21 Sep",
    events: [
      { id: "mon-1", time: "10:00 AM", title: "Leadership Sync" },
      { id: "mon-2", time: "2:00 PM", title: "1:1 with Neha" },
    ],
  },
  {
    day: "Tuesday",
    date: "22 Sep",
    events: [{ id: "tue-1", time: "1:00 PM", title: "Internal Budget Review" }],
  },
  {
    day: "Wednesday",
    date: "23 Sep",
    isToday: true,
    events: [
      { id: "wed-1", time: "3:00 – 3:30 PM", title: "Meridian Logistics", highlight: true },
    ],
  },
  {
    day: "Thursday",
    date: "24 Sep",
    events: [
      { id: "thu-1", time: "9:00 – 10:00 AM", title: "Board Prep" },
      { id: "thu-2", time: "4:00 – 5:00 PM", title: "Hiring Panel" },
    ],
  },
  {
    day: "Friday",
    date: "25 Sep",
    events: [{ id: "fri-1", time: "10:00 – 10:30 AM", title: "Facilities Check-in" }],
  },
];
