"""
Pydantic schemas for the Executive Productivity Agent API.

Field names intentionally match the existing React frontend's data contract
(src/data/mockTasks.js, mockCalendar.js, mockSources.js, mockChat.js and
src/services/api.js) so that the UI components need zero changes — only
src/services/api.js is rewired to call these endpoints instead of resolving
mock data.

Task also carries two extra fields (category, ownershipStatus) beyond what
the frontend currently reads. These make the underlying reasoning ("why is
this task classified this way") explicit and inspectable in Swagger without
touching any frontend component, since unknown JSON fields are simply
ignored by the React components.
"""
from __future__ import annotations

from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class Task(BaseModel):
    id: str
    title: str
    description: str
    owner: Optional[str] = None
    recipient: Optional[str] = None
    waitingOn: Optional[str] = None
    deadline: str
    dueBucket: str  # "today" | "upcoming" | "this-week" | "past" | "none"
    status: str  # Pending | Waiting | Scheduled | Received | Unassigned | Completed
    priority: str  # High | Medium | Low
    isOverdue: bool = False
    mergedFrom: Optional[int] = None
    flagged: bool = False
    sources: list[str] = Field(default_factory=list)
    # Extra reasoning metadata (not required by the current UI, harmless if unused)
    category: str = "task"
    ownershipStatus: str = "confirmed"  # "confirmed" | "unclear"


class SummaryStats(BaseModel):
    myActions: int
    waitingOnOthers: int
    overdue: int
    unclearOwnership: int


class CalendarEvent(BaseModel):
    id: str
    time: str
    title: str
    type: str = "internal"  # internal | 1:1 | external
    confirmed: Optional[bool] = None


class DaySchedule(BaseModel):
    day: str
    date: str
    isToday: Optional[bool] = None
    events: list[CalendarEvent] = Field(default_factory=list)


class TodayInfo(BaseModel):
    label: str
    weekday: str
    dateNum: int


class CalendarResponse(BaseModel):
    today: TodayInfo
    todayEvents: list[CalendarEvent]
    weekSchedule: list[DaySchedule]


class BriefResponse(BaseModel):
    stats: SummaryStats
    priorityActions: list[Task]
    waitingOnOthers: list[Task]
    unclearOwnership: list[Task]
    todayEvents: list[CalendarEvent]
    today: TodayInfo


class SourceSample(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    subject: str
    from_: str = Field(alias="from")
    time: str


class Source(BaseModel):
    id: str
    type: str
    records: int
    lastProcessed: str
    description: str
    sample: list[SourceSample]


class AskRequest(BaseModel):
    question: str


class AskResponse(BaseModel):
    answer: str
    sources: list[str] = Field(default_factory=list)
