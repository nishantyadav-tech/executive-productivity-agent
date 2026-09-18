"""
Loads the grounded Data Pack (data/datapack.json) into an in-memory SQLite
database. This is the "Data Processing" step of the pipeline:

    Emails + Calendar + Meeting + Voice Notes -> Data Processing (this file)

Nothing here invents data — every row is copied verbatim from the JSON file
that was built directly from the Assignment 1 Data Pack. Downstream modules
(agent/tasks.py, agent/qa.py) query this database rather than re-parsing the
JSON, so there is a single, inspectable source of truth for "what the agent
actually read."
"""
from __future__ import annotations

import json
import sqlite3
from pathlib import Path
from typing import Any

DATAPACK_PATH = Path(__file__).resolve().parent.parent / "data" / "datapack.json"


def load_datapack() -> dict[str, Any]:
    with open(DATAPACK_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def build_db(datapack: dict[str, Any] | None = None) -> sqlite3.Connection:
    """Builds and returns an in-memory SQLite connection populated with the
    data pack. Row factory is sqlite3.Row so callers can access columns by
    name."""
    data = datapack or load_datapack()
    conn = sqlite3.connect(":memory:", check_same_thread=False)
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()

    cur.execute(
        """CREATE TABLE people (
            name TEXT PRIMARY KEY, role TEXT, email TEXT
        )"""
    )
    cur.executemany(
        "INSERT INTO people (name, role, email) VALUES (:name, :role, :email)",
        data["people"],
    )

    cur.execute(
        """CREATE TABLE meeting_lines (
            meeting_id TEXT, title TEXT, date TEXT, time TEXT,
            line_no INTEGER, speaker TEXT, text TEXT
        )"""
    )
    for meeting in data["meeting_transcripts"]:
        for i, line in enumerate(meeting["lines"]):
            cur.execute(
                """INSERT INTO meeting_lines
                   (meeting_id, title, date, time, line_no, speaker, text)
                   VALUES (?, ?, ?, ?, ?, ?, ?)""",
                (meeting["id"], meeting["title"], meeting["date"], meeting["time"],
                 i, line["speaker"], line["text"]),
            )

    cur.execute(
        """CREATE TABLE calendar_events (
            person TEXT, day TEXT, date TEXT, time TEXT, title TEXT
        )"""
    )
    for person, events in data["calendars"].items():
        for e in events:
            cur.execute(
                "INSERT INTO calendar_events (person, day, date, time, title) VALUES (?, ?, ?, ?, ?)",
                (person, e["day"], e["date"], e["time"], e["title"]),
            )

    cur.execute(
        """CREATE TABLE emails (
            thread_subject TEXT, seq INTEGER, date TEXT, time TEXT,
            sender TEXT, recipient TEXT, text TEXT
        )"""
    )
    for thread in data["email_threads"]:
        for i, e in enumerate(thread["emails"]):
            cur.execute(
                """INSERT INTO emails
                   (thread_subject, seq, date, time, sender, recipient, text)
                   VALUES (?, ?, ?, ?, ?, ?, ?)""",
                (thread["subject"], i, e["date"], e["time"], e["from"], e["to"], e["text"]),
            )

    cur.execute(
        """CREATE TABLE voice_notes (
            id TEXT, date TEXT, time TEXT, context TEXT, text TEXT
        )"""
    )
    for vn in data["voice_notes"]:
        cur.execute(
            "INSERT INTO voice_notes (id, date, time, context, text) VALUES (?, ?, ?, ?, ?)",
            (vn["id"], vn["date"], vn["time"], vn["context"], vn["text"]),
        )

    conn.commit()
    return conn


def rows_to_dicts(rows: list[sqlite3.Row]) -> list[dict[str, Any]]:
    return [dict(r) for r in rows]
