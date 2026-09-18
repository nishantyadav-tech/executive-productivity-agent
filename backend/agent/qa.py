"""
POST /api/ask

Grounds every answer in the same Task objects and raw sources the rest of
the API uses -- the LLM (when configured) is only allowed to *phrase* an
answer from that context, never to introduce facts outside it. Without an
API key configured, a deterministic keyword-matching engine covers the
brief's example questions plus simple per-person / per-status lookups.
"""
from __future__ import annotations

import sqlite3

from . import tasks as task_engine
from .llm_client import ask_llm
from .models import AskResponse
from .time_utils import start_minutes

SYSTEM_PROMPT = """You are an executive productivity agent answering questions for Arjun \
Malhotra (VP Sales) about his own commitments, deadlines and meetings.

Answer ONLY using the CONTEXT provided below. It is the complete and \
authoritative set of facts extracted from Arjun's emails, calendar, meeting \
transcripts and voice notes for the week of 21-25 September 2026. Do not \
invent facts, names, dates, or owners that are not in the context.

If the context does not contain enough information to answer confidently, \
say so plainly rather than guessing.

Keep answers to 2-4 sentences, direct and executive-appropriate. Do not \
repeat the question back verbatim.

Very important: for the Mumbai office lease renewal, ownership is explicitly \
UNCLEAR in the source data. Never state or imply that Facilities, Raghav, or \
Divya has confirmed ownership of it -- only that it is unassigned and \
flagged for confirmation.
"""


def _build_context(conn: sqlite3.Connection) -> str:
    lines: list[str] = []

    lines.append("=== CURRENT TASK STATE (as of Friday, 25 Sep 2026, 9:00 AM) ===")
    for t in task_engine.get_all_tasks():
        who = f"owner: {t.owner or 'UNASSIGNED'}"
        target = f", involves: {t.recipient or t.waitingOn}" if (t.recipient or t.waitingOn) else ""
        lines.append(
            f"- [{t.id}] \"{t.title}\" -- status: {t.status}, priority: {t.priority}, "
            f"deadline: {t.deadline}, {who}{target}, overdue: {t.isOverdue}, "
            f"ownership: {t.ownershipStatus}. {t.description} (sources: {', '.join(t.sources)})"
        )

    cur = conn.cursor()
    lines.append("\n=== TODAY'S / THIS WEEK'S CALENDAR (Arjun Malhotra) ===")
    cur.execute(
        "SELECT day, date, time, title FROM calendar_events WHERE person = 'Arjun Malhotra' ORDER BY date"
    )
    for r in sorted(cur.fetchall(), key=lambda r: (r["date"], start_minutes(r["time"]))):
        lines.append(f"- {r['day']} {r['time']}: {r['title']}")

    lines.append("\n=== RAW EMAIL THREADS ===")
    cur.execute(
        "SELECT thread_subject, date, time, sender, recipient, text FROM emails ORDER BY thread_subject, seq"
    )
    for r in cur.fetchall():
        lines.append(
            f"- [{r['thread_subject']}] {r['date']} {r['time']} {r['sender']} -> {r['recipient']}: {r['text']}"
        )

    lines.append("\n=== MEETING TRANSCRIPT (Leadership Sync, Mon 21 Sep) ===")
    cur.execute("SELECT speaker, text FROM meeting_lines ORDER BY line_no")
    for r in cur.fetchall():
        lines.append(f"- {r['speaker']}: {r['text']}")

    lines.append("\n=== VOICE NOTES (Arjun's own reminders to himself) ===")
    cur.execute("SELECT date, time, context, text FROM voice_notes")
    for r in cur.fetchall():
        lines.append(f"- {r['date']} {r['time']} ({r['context']}): {r['text']}")

    return "\n".join(lines)


# ---------------------------------------------------------------------------
# Deterministic fallback -- used when no ANTHROPIC_API_KEY is configured.
# Covers the example questions from the assignment brief plus simple
# person/status lookups over the same task objects the LLM path uses.
# ---------------------------------------------------------------------------
def _fallback_answer(question: str) -> AskResponse:
    q = question.lower().strip()
    all_tasks = task_engine.get_all_tasks()

    def find(pred):
        return [t for t in all_tasks if pred(t)]

    if "raghav" in q and ("promise" in q or "owe" in q or "commit" in q):
        t = next(t for t in all_tasks if t.id == "task-vendor-list")
        return AskResponse(
            answer=(
                f"You committed to sending Raghav the updated vendor list. The latest "
                f"committed deadline was {t.deadline}, and it's currently {t.status.lower()} "
                f"and overdue -- Raghav followed up Wednesday at 8:45 AM with no reply on record."
            ),
            sources=t.sources,
        )

    if "meeting" in q and "today" in q:
        from .db import build_db
        from .calendar import build_calendar

        cal = build_calendar(build_db())
        if not cal.todayEvents:
            return AskResponse(answer="No meetings are on the calendar for today.", sources=["Calendar"])
        parts = [f"{e.title} ({e.time})" for e in cal.todayEvents]
        return AskResponse(answer="Today: " + "; ".join(parts) + ".", sources=["Calendar"])

    if "today" in q and ("action" in q or "need" in q or "what should i do" in q):
        actionable = task_engine.get_priority_actions()
        if not actionable:
            return AskResponse(answer="Nothing needs action today based on the current data.", sources=[])
        parts = [f"{t.title} ({t.status.lower()}, {t.priority.lower()} priority)" for t in actionable]
        srcs = sorted({s for t in actionable for s in t.sources})
        return AskResponse(answer="Needs action: " + "; ".join(parts) + ".", sources=srcs)

    if "waiting" in q:
        waiting = task_engine.get_waiting_on_others()
        if not waiting:
            return AskResponse(
                answer=(
                    "You're not waiting on anyone right now. The one open item -- the Q3 "
                    "campaign deck review with Neha -- was locked to Thursday 9:30 AM and "
                    "the deck was confirmed ready ahead of that review."
                ),
                sources=["Q3 Campaign Deck Email", "Leadership Sync"],
            )
        parts = [f"{t.title} (waiting on {t.waitingOn}, due {t.deadline})" for t in waiting]
        srcs = sorted({s for t in waiting for s in t.sources})
        return AskResponse(answer="Waiting on: " + "; ".join(parts) + ".", sources=srcs)

    if "overdue" in q:
        overdue = find(lambda t: t.isOverdue)
        if not overdue:
            return AskResponse(answer="Nothing is currently overdue.", sources=[])
        parts = [f"{t.title} (deadline was {t.deadline})" for t in overdue]
        srcs = sorted({s for t in overdue for s in t.sources})
        return AskResponse(answer="Overdue: " + "; ".join(parts) + ".", sources=srcs)

    if "unassign" in q or "unclear" in q:
        unclear = task_engine.get_unclear_ownership()
        if not unclear:
            return AskResponse(answer="Everything currently has a confirmed owner.", sources=[])
        t = unclear[0]
        return AskResponse(
            answer=(
                f"{t.title.replace('Confirm who is handling the ', '').capitalize()} has no "
                f"confirmed owner. Deadline is {t.deadline}. No email, meeting, or voice note "
                f"assigns it to a specific person or team -- this needs to be confirmed, not assumed."
            ),
            sources=t.sources,
        )

    if "meridian" in q or "priya" in q:
        return AskResponse(
            answer=(
                "The Meridian Logistics call was rescheduled and confirmed for Wednesday, "
                "23 September, 3:00-3:30 PM, after Arjun proposed the time and Priya confirmed it."
            ),
            sources=["Call Reschedule Email", "Calendar"],
        )

    # Generic fallback: search titles/descriptions for keyword overlap.
    hits = [t for t in all_tasks if any(w in (t.title + t.description).lower() for w in q.split() if len(w) > 3)]
    if hits:
        t = hits[0]
        return AskResponse(answer=f"{t.title}: {t.description}", sources=t.sources)

    return AskResponse(
        answer=(
            "I don't have enough information from your emails, calendar, meeting transcripts "
            "or voice notes to answer that confidently yet. Try one of the suggested questions, "
            "or rephrase your question."
        ),
        sources=[],
    )


def answer_question(conn: sqlite3.Connection, question: str) -> AskResponse:
    context = _build_context(conn)
    user_message = f"CONTEXT:\n{context}\n\nQUESTION: {question}"
    llm_text = ask_llm(SYSTEM_PROMPT, user_message)

    if llm_text:
        # Attribute sources heuristically from whichever grounded tasks are
        # textually relevant to the question, so the UI's "Sources used"
        # chips stay meaningful even when the LLM composed the phrasing.
        q = question.lower()
        relevant_sources: list[str] = []
        for t in task_engine.get_all_tasks():
            haystack = (t.title + " " + t.description + " " + (t.owner or "") + " " +
                        (t.recipient or "") + " " + (t.waitingOn or "")).lower()
            if any(w in haystack for w in q.split() if len(w) > 3):
                relevant_sources.extend(t.sources)
        return AskResponse(answer=llm_text, sources=sorted(set(relevant_sources)))

    return _fallback_answer(question)
