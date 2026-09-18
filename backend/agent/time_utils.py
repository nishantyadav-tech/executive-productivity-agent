"""Helper for sorting the data pack's time-range strings (e.g.
"9:00\u20139:35 AM", "11:00 AM\u201312:00 PM") chronologically. Plain SQL/string
ordering sorts these lexically, which is wrong (e.g. "2:00 PM" < "9:00 AM").
"""
from __future__ import annotations

import re

_TIME_RE = re.compile(r"(\d{1,2}):(\d{2})\s*(AM|PM)?")


def start_minutes(time_range: str) -> int:
    """Returns minutes-since-midnight for the *start* of a time range string,
    inferring AM/PM from whichever part of the string states it when the
    start itself omits it (e.g. "9:00\u20139:35 AM" -> start is AM)."""
    matches = _TIME_RE.findall(time_range)
    if not matches:
        return 0
    hour, minute, meridiem = matches[0]
    if not meridiem:
        for _, _, m in matches[1:]:
            if m:
                meridiem = m
                break
    hour = int(hour)
    minute = int(minute)
    if meridiem == "PM" and hour != 12:
        hour += 12
    if meridiem == "AM" and hour == 12:
        hour = 0
    return hour * 60 + minute
