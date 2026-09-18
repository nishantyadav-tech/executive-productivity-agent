"""
Executive Productivity Agent -- FastAPI backend.

Pipeline:
  Emails + Calendar + Meeting + Voice Notes   (data/datapack.json)
    -> Data Processing                        (agent/db.py -> SQLite)
    -> Extraction / Reasoning + Dedup          (agent/tasks.py)
    -> My Actions / Waiting / Attention        (agent/tasks.py)
    -> Daily Brief + Q&A                       (agent/calendar.py, agent/sources.py, agent/qa.py)
    -> FastAPI                                 (this file)
    -> Existing React Frontend

Run:
  uvicorn main:app --reload --port 8000
Swagger:
  http://localhost:8000/docs
"""

from __future__ import annotations

from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI  # noqa: E402
from fastapi.middleware.cors import CORSMiddleware  # noqa: E402

from agent import calendar as calendar_engine  # noqa: E402
from agent import qa as qa_engine  # noqa: E402
from agent import sources as sources_engine  # noqa: E402
from agent import tasks as task_engine  # noqa: E402
from agent.db import build_db  # noqa: E402
from agent.models import (
    AskRequest,
    AskResponse,
    BriefResponse,
    CalendarResponse,
    Source,
    Task,
)  # noqa: E402


app = FastAPI(
    title="Executive Productivity Agent API",
    description="Backend for Arjun Malhotra's executive productivity agent.",
    version="1.0.0",
)

# CORS configuration
# Allows both the local React frontend and the deployed Vercel frontend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://executive-productivity-agent-theta.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# One in-memory SQLite connection, built once at startup from the grounded
# data pack, reused by every request.
_db_conn = build_db()


@app.get("/api/brief", response_model=BriefResponse)
def get_brief():
    cal = calendar_engine.build_calendar(_db_conn)
    return BriefResponse(
        stats=task_engine.get_summary_stats(),
        priorityActions=task_engine.get_priority_actions(),
        waitingOnOthers=task_engine.get_waiting_on_others(),
        unclearOwnership=task_engine.get_unclear_ownership(),
        todayEvents=cal.todayEvents,
        today=cal.today,
    )


@app.get("/api/tasks", response_model=list[Task])
def get_all_tasks():
    """All tasks the agent has extracted, across every bucket."""
    return task_engine.get_all_tasks()


@app.get("/api/tasks/my-actions", response_model=list[Task])
def get_my_actions():
    return task_engine.get_my_actions()


@app.get("/api/tasks/waiting", response_model=list[Task])
def get_waiting():
    return task_engine.get_waiting_on_others()


@app.get("/api/tasks/attention", response_model=list[Task])
def get_attention():
    """Unclear-ownership items needing attention -- never auto-assigned."""
    return task_engine.get_unclear_ownership()


@app.get("/api/calendar", response_model=CalendarResponse)
def get_calendar():
    return calendar_engine.build_calendar(_db_conn)


@app.get("/api/sources", response_model=list[Source])
def get_sources():
    return sources_engine.build_sources(_db_conn)


@app.post("/api/ask", response_model=AskResponse)
def ask(payload: AskRequest):
    return qa_engine.answer_question(_db_conn, payload.question)


@app.get("/api/health")
def health():
    return {"status": "ok"}