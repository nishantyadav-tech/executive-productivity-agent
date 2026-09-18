"""
Builds the /api/calendar and /api/brief calendar sections from Arjun
Malhotra's calendar row in the data pack, cross-referenced with the emails
that confirm the Meridian Logistics call (Business Case 4).
"""
from __future__ import annotations

import sqlite3

from .models import CalendarEvent, CalendarResponse, DaySchedule, TodayInfo
from .tasks import NOW
from .time_utils import start_minutes

DAY_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
DAY_LABEL = {
    "Monday": "21 Sep",
    "Tuesday": "22 Sep",
    "Wednesday": "23 Sep",
    "Thursday": "24 Sep",
    "Friday": "25 Sep",
}
TODAY_WEEKDAY = "Friday"  # matches NOW = 25 Sep 2026

CONFIRMED_TITLES = {"Call \u2014 Meridian Logistics"}


def _event_type(title: str) -> str:
    if "Meridian" in title:
        return "external"
    if "1:1" in title:
        return "1:1"
    return "internal"


def build_calendar(conn: sqlite3.Connection) -> CalendarResponse:
    cur = conn.cursor()
    cur.execute(
        "SELECT day, date, time, title FROM calendar_events WHERE person = 'Arjun Malhotra' ORDER BY date"
    )
    rows = sorted(cur.fetchall(), key=lambda r: (r["date"], start_minutes(r["time"])))

    by_day: dict[str, list[CalendarEvent]] = {d: [] for d in DAY_ORDER}
    for i, r in enumerate(rows):
        ev = CalendarEvent(
            id=f"evt-{i}",
            time=r["time"],
            title=r["title"],
            type=_event_type(r["title"]),
            confirmed=True if r["title"] in CONFIRMED_TITLES else None,
        )
        by_day[r["day"]].append(ev)

    week_schedule = [
        DaySchedule(
            day=day,
            date=DAY_LABEL[day],
            isToday=(day == TODAY_WEEKDAY),
            events=by_day[day],
        )
        for day in DAY_ORDER
    ]

    today_events = by_day[TODAY_WEEKDAY]

    today_info = TodayInfo(
        label=f"{TODAY_WEEKDAY}, {NOW.day} September {NOW.year}",
        weekday=TODAY_WEEKDAY,
        dateNum=NOW.day,
    )

    return CalendarResponse(today=today_info, todayEvents=today_events, weekSchedule=week_schedule)
