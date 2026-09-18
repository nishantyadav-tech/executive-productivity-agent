"""Builds the /api/sources response -- a summary of what the agent read,
with a small verbatim sample from each source type, all pulled from the
SQLite-backed data pack (no invented records)."""
from __future__ import annotations

import sqlite3

from .models import Source, SourceSample
from .tasks import NOW
from .time_utils import start_minutes

PROCESSED_LABEL = f"{NOW.strftime('%A')}, {NOW.strftime('%I:%M %p').lstrip('0')}"


def build_sources(conn: sqlite3.Connection) -> list[Source]:
    cur = conn.cursor()

    cur.execute("SELECT COUNT(*) AS n FROM emails")
    email_count = cur.fetchone()["n"]
    cur.execute("SELECT thread_subject, sender, time, date FROM emails ORDER BY date DESC")
    email_rows = sorted(cur.fetchall(), key=lambda r: (r["date"], start_minutes(r["time"])), reverse=True)[:3]
    email_samples = [
        SourceSample(subject=r["thread_subject"], **{"from": r["sender"]}, time=r["time"])
        for r in email_rows
    ]

    cur.execute("SELECT COUNT(*) AS n FROM calendar_events")
    cal_count = cur.fetchone()["n"]
    cur.execute(
        "SELECT title, day, time, date FROM calendar_events WHERE person = 'Arjun Malhotra' ORDER BY date"
    )
    cal_rows = sorted(cur.fetchall(), key=lambda r: (r["date"], start_minutes(r["time"])))[:3]
    cal_samples = [
        SourceSample(subject=r["title"], **{"from": r["day"]}, time=r["time"])
        for r in cal_rows
    ]

    cur.execute("SELECT COUNT(DISTINCT meeting_id) AS n FROM meeting_lines")
    meeting_count = cur.fetchone()["n"]
    cur.execute(
        "SELECT DISTINCT title, date FROM meeting_lines"
    )
    meeting_samples = [
        SourceSample(subject=r["title"], **{"from": "Full transcript"}, time=r["date"])
        for r in cur.fetchall()
    ]

    cur.execute("SELECT COUNT(*) AS n FROM voice_notes")
    voice_count = cur.fetchone()["n"]
    cur.execute("SELECT id, context, time FROM voice_notes")
    voice_samples = [
        SourceSample(subject=f"Voice Note \u2014 {r['context']}", **{"from": "Arjun Malhotra"}, time=r["time"])
        for r in cur.fetchall()
    ]

    return [
        Source(
            id="src-email",
            type="Emails",
            records=email_count,
            lastProcessed=PROCESSED_LABEL,
            description="Inbox threads scanned for commitments, deadlines and follow-ups.",
            sample=email_samples,
        ),
        Source(
            id="src-calendar",
            type="Calendar",
            records=cal_count,
            lastProcessed=PROCESSED_LABEL,
            description="Meetings for the current week, cross-referenced against commitments.",
            sample=cal_samples,
        ),
        Source(
            id="src-transcript",
            type="Meeting Transcripts",
            records=meeting_count,
            lastProcessed=PROCESSED_LABEL,
            description="Transcribed meetings parsed for spoken commitments and action items.",
            sample=meeting_samples,
        ),
        Source(
            id="src-voice",
            type="Voice Notes",
            records=voice_count,
            lastProcessed=PROCESSED_LABEL,
            description="Short voice memos transcribed and matched against existing threads.",
            sample=voice_samples,
        ),
    ]
