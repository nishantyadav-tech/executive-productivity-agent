"""
Tests covering the five "important business cases" from the assignment brief.
Run with: pytest
"""
from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def _get_task(tasks, task_id):
    return next(t for t in tasks if t["id"] == task_id)


def test_vendor_list_deduplicated_into_one_task():
    """Case 1: meeting + emails + voice note collapse into ONE task."""
    tasks = client.get("/api/tasks").json()
    vendor_tasks = [t for t in tasks if "vendor list" in t["title"].lower()]
    assert len(vendor_tasks) == 1

    task = vendor_tasks[0]
    assert task["owner"] == "Arjun Malhotra"
    assert task["recipient"] == "Raghav Sethi"
    assert task["mergedFrom"] == 3
    assert set(task["sources"]) == {"Leadership Sync", "Vendor List Email", "Voice Note 1"}
    assert task["isOverdue"] is True

    # It must also appear in "my actions" and count toward overdue stats.
    my_actions = client.get("/api/tasks/my-actions").json()
    assert any(t["id"] == task["id"] for t in my_actions)

    stats = client.get("/api/brief").json()["stats"]
    assert stats["overdue"] >= 1


def test_campaign_deck_final_time_is_thursday_930am():
    """Case 2: final review = Thursday, 24 September, 9:30 AM."""
    tasks = client.get("/api/tasks").json()
    deck_task = _get_task(tasks, "task-campaign-deck")
    assert "9:30 AM" in deck_task["deadline"]
    assert "Thursday" in deck_task["deadline"]
    assert "24 September" in deck_task["deadline"]


def test_expense_report_status_is_received():
    """Case 3: report sent Wednesday 6 PM => status RECEIVED."""
    tasks = client.get("/api/tasks").json()
    expense_task = _get_task(tasks, "task-expense-report")
    assert expense_task["status"] == "Received"


def test_meridian_call_confirmed_wed_3pm():
    """Case 4: Meridian confirmed Wednesday 23 Sep, 3:00-3:30 PM."""
    cal = client.get("/api/calendar").json()
    wed = next(d for d in cal["weekSchedule"] if d["day"] == "Wednesday")
    meridian_events = [e for e in wed["events"] if "Meridian" in e["title"]]
    assert len(meridian_events) == 1
    ev = meridian_events[0]
    assert ev["time"] == "3:00\u20133:30 PM"
    assert ev["confirmed"] is True


def test_mumbai_lease_ownership_unclear_and_not_assigned_to_facilities():
    """Case 5: deadline Friday EOD, ownership UNCLEAR, never auto-assigned."""
    attention = client.get("/api/tasks/attention").json()
    assert len(attention) == 1
    task = attention[0]
    assert task["owner"] is None
    assert task["status"] == "Unassigned"
    assert task["ownershipStatus"] == "unclear"
    assert "Friday" in task["deadline"] and "25 September" in task["deadline"]
    # Must not silently resolve to Facilities as confirmed owner.
    assert task["owner"] != "Facilities"
    assert "facilities" not in task["title"].lower()

    stats = client.get("/api/brief").json()["stats"]
    assert stats["unclearOwnership"] == 1


def test_ask_endpoint_answers_suggested_questions():
    questions = [
        "What did I promise Raghav?",
        "What needs action today?",
        "What am I waiting for?",
        "What's overdue?",
        "What's still unassigned?",
    ]
    for q in questions:
        resp = client.post("/api/ask", json={"question": q})
        assert resp.status_code == 200
        body = resp.json()
        assert body["answer"]
        assert len(body["answer"]) > 10


def test_ask_never_assigns_mumbai_lease_to_facilities():
    resp = client.post("/api/ask", json={"question": "What's still unassigned?"})
    answer = resp.json()["answer"].lower()
    assert "mumbai" in answer or "lease" in answer
    # Should not assert Facilities as the confirmed owner.
    assert "facilities is responsible" not in answer
    assert "facilities owns" not in answer


def test_brief_endpoint_shape():
    resp = client.get("/api/brief")
    assert resp.status_code == 200
    body = resp.json()
    for key in ("stats", "priorityActions", "waitingOnOthers", "unclearOwnership", "todayEvents", "today"):
        assert key in body


def test_sources_endpoint_has_all_four_types():
    sources = client.get("/api/sources").json()
    types = {s["type"] for s in sources}
    assert types == {"Emails", "Calendar", "Meeting Transcripts", "Voice Notes"}
