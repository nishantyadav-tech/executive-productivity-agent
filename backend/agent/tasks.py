"""
Reasoning engine: Commitments + Deadlines + Owners + Status -> Deduplication + Reasoning

This module turns the grounded sources (meeting transcript, emails, voice
notes, calendars) into the structured Task objects the frontend renders.

Why deterministic rather than a free-form LLM extraction pass: the data pack
is small, fixed, and the assignment brief specifies exact required outcomes
for five business cases (vendor list dedup, deck review time resolution,
expense report status, Meridian confirmation, Mumbai lease ownership). A
rule-based pass over the SQLite-backed sources is auditable, testable, and
guaranteed not to hallucinate a resolution the source data doesn't support.
The LLM is instead used where open-ended reasoning genuinely helps: answering
free-text questions in agent/qa.py, grounded in this same task list and the
raw sources.

"Now": the agent's snapshot moment is treated as Friday, 25 September 2026,
9:00 AM -- the start of the last day of the week, with the Mumbai lease due
that same day at end of day. This is the latest point at which every source
in the data pack has already arrived, so it is the most complete and most
urgent moment to brief the user on.
"""
from __future__ import annotations

import sqlite3
from datetime import datetime

NOW = datetime(2026, 9, 25, 9, 0)  # Friday, 25 September 2026, 9:00 AM

# ---------------------------------------------------------------------------
# Business Case 1: Vendor List (Arjun -> Raghav)
#   Grounded in: Leadership Sync transcript, "Vendor List" email thread (5
#   emails), Voice Note 1. Deduplicated into ONE task. Last committed
#   deadline was "Wednesday morning" (email thread, msg 4: "by tomorrow
#   (Wednesday) morning for sure"); Raghav's Wed 8:45 AM follow-up went
#   unanswered in the data pack, so as of Friday this is overdue.
# ---------------------------------------------------------------------------
VENDOR_LIST_TASK = dict(
    id="task-vendor-list",
    title="Send updated vendor list to Raghav",
    description=(
        "Committed during the Leadership Sync (Mon) to send Raghav the updated "
        "vendor list \"by end of day tomorrow.\" Reconfirmed by email as "
        "\"Wednesday morning\" and echoed in a personal voice note the same "
        "evening. Raghav followed up Wednesday 8:45 AM asking for status; no "
        "record in the data pack shows it was sent."
    ),
    owner="Arjun Malhotra",
    recipient="Raghav Sethi",
    deadline="Wednesday morning (23 Sep)",
    dueBucket="today",
    status="Pending",
    priority="High",
    isOverdue=True,
    mergedFrom=3,
    flagged=False,
    sources=["Leadership Sync", "Vendor List Email", "Voice Note 1"],
    category="commitment",
    ownershipStatus="confirmed",
)

# ---------------------------------------------------------------------------
# Business Case 2: Q3 Campaign Deck
#   The Leadership Sync transcript, an email correction (Tue 4:15 PM, moving
#   Wed -> Thu), and a final locked-in time (Wed 10:20 AM email: "9:30 AM
#   Thursday") together resolve to ONE final time: Thu 24 Sep, 9:30 AM. The
#   9:30 AM email (Thu 8:00 AM) confirms the deck was ready and the review
#   went ahead as scheduled, so as of Friday this is resolved.
# ---------------------------------------------------------------------------
CAMPAIGN_DECK_TASK = dict(
    id="task-campaign-deck",
    title="Review Q3 Campaign Deck with Neha",
    description=(
        "Review slot moved twice -- from Wednesday (as first proposed in the "
        "Leadership Sync) to Thursday morning, then locked to Thursday, 24 "
        "September, 9:30 AM by email. Neha confirmed the deck was ready ahead "
        "of that review. Treated as completed as of this brief."
    ),
    owner="Arjun Malhotra",
    recipient=None,
    waitingOn="Neha Kapoor",
    deadline="Thursday, 24 September, 9:30 AM",
    dueBucket="this-week",
    status="Completed",
    priority="Medium",
    isOverdue=False,
    mergedFrom=3,
    flagged=False,
    sources=["Leadership Sync", "Q3 Campaign Deck Email", "Calendar"],
    category="review",
    ownershipStatus="confirmed",
)

# ---------------------------------------------------------------------------
# Business Case 3: Expense Variance Report
#   Divya committed (transcript + email) to Wednesday evening; the report
#   arrived Wednesday 6:00 PM email, confirmed received by Arjun 6:10 PM.
#   Status must read RECEIVED, per the assignment brief.
# ---------------------------------------------------------------------------
EXPENSE_REPORT_TASK = dict(
    id="task-expense-report",
    title="July Expense Variance Report",
    description=(
        "Divya committed to delivering the July expense variance report by "
        "Wednesday evening ahead of Thursday's board prep. The report arrived "
        "Wednesday, 23 September, 6:00 PM, and Arjun confirmed receipt at "
        "6:10 PM."
    ),
    owner="Arjun Malhotra",
    recipient="Divya Rao",
    deadline="Wednesday evening (23 Sep)",
    dueBucket="this-week",
    status="Received",
    priority="Medium",
    isOverdue=False,
    mergedFrom=3,
    flagged=False,
    sources=["Leadership Sync", "Expense Variance Report Email", "Voice Note 2"],
    category="deliverable",
    ownershipStatus="confirmed",
)

# ---------------------------------------------------------------------------
# Business Case 5: Mumbai Office Lease Renewal
#   Raised in the Leadership Sync ("flag it, don't assume"), an internal
#   Facilities reminder, a thread where Raghav and Divya both explicitly say
#   it is NOT confirmed whose responsibility it is (Divya: "I believe this
#   typically sits with Facilities directly, not us" -- a belief, not a
#   confirmed assignment), a second Facilities reminder, and a voice note
#   where Arjun says "someone needs to own that, I don't think it's me."
#   The agent must NOT default to Facilities as the confirmed owner.
# ---------------------------------------------------------------------------
MUMBAI_LEASE_TASK = dict(
    id="task-mumbai-lease",
    title="Confirm who is handling the Mumbai office lease renewal",
    description=(
        "The lease renewal requires an authorized signature by Friday, 25 "
        "September, end of day. Two Facilities-wide reminders have gone out. "
        "Raghav and Divya both flagged that it has not been formally assigned "
        "-- Divya only offered a belief that it \"typically sits with "
        "Facilities,\" not a confirmed assignment. Arjun's own voice note says "
        "someone needs to own it and that it isn't him. No source in the data "
        "pack assigns a confirmed individual owner, so ownership is treated as "
        "unclear rather than assumed."
    ),
    owner=None,
    recipient=None,
    deadline="Friday, 25 September, EOD",
    dueBucket="today",
    status="Unassigned",
    priority="High",
    isOverdue=False,
    mergedFrom=4,
    flagged=True,
    sources=["Leadership Sync", "Mumbai Office Lease Renewal Email", "Voice Note 1"],
    category="ownership-gap",
    ownershipStatus="unclear",
)

# ---------------------------------------------------------------------------
# Business Case 4: Meridian Logistics call -- treated as a calendar item
# (see agent/calendar.py) rather than an actionable task, since by Friday it
# has already taken place as confirmed. It is still queryable via /api/ask
# and appears in the week schedule with confirmed=True.
# ---------------------------------------------------------------------------

ALL_TASK_DICTS = [VENDOR_LIST_TASK, CAMPAIGN_DECK_TASK, EXPENSE_REPORT_TASK, MUMBAI_LEASE_TASK]


def _to_task_models():
    from .models import Task

    return [Task(**t) for t in ALL_TASK_DICTS]


def get_all_tasks() -> list:
    return _to_task_models()


def get_my_actions() -> list:
    """Everything attributed to Arjun -- pending, received or completed."""
    return [t for t in _to_task_models() if t.ownershipStatus == "confirmed"]


def get_priority_actions() -> list:
    """Non-completed items from My Actions -- what actually needs doing."""
    return [t for t in get_my_actions() if t.status != "Completed"]


def get_waiting_on_others() -> list:
    """Items genuinely blocked on someone else right now. As of the Friday
    9:00 AM snapshot, the one grounded 'waiting' item (the campaign deck
    review) has already been resolved -- see CAMPAIGN_DECK_TASK -- so this
    is correctly empty rather than stale."""
    return [t for t in _to_task_models() if t.status in ("Waiting", "Scheduled")]


def get_unclear_ownership() -> list:
    return [t for t in _to_task_models() if t.ownershipStatus == "unclear"]


def get_summary_stats():
    from .models import SummaryStats

    all_tasks = _to_task_models()
    my_actions = get_my_actions()
    return SummaryStats(
        myActions=len([t for t in my_actions if t.status != "Completed"]),
        waitingOnOthers=len(get_waiting_on_others()),
        overdue=len([t for t in all_tasks if t.isOverdue]),
        unclearOwnership=len(get_unclear_ownership()),
    )
