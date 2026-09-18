# Executive Productivity Agent — Backend

FastAPI backend for Arjun Malhotra's (VP Sales) executive productivity agent,
built against the Assignment 1 Data Pack. Connects directly to the existing
React + Vite + Tailwind frontend with **no changes to any UI file** — only
`src/services/api.js` was rewired to call these endpoints instead of
resolving mock data.

## Pipeline

```
Emails + Calendar + Meeting + Voice Notes   (data/datapack.json — verbatim from the Data Pack)
        ↓
Data Processing                             (agent/db.py → in-memory SQLite)
        ↓
Extraction + Deduplication + Reasoning      (agent/tasks.py — deterministic, rule-based)
        ↓
My Actions / Waiting on Others / Attention  (agent/tasks.py)
        ↓
Daily Brief + Q&A                           (agent/calendar.py, agent/sources.py, agent/qa.py — LLM-grounded)
        ↓
FastAPI                                     (main.py)
        ↓
Existing React Frontend                     (src/services/api.js — only file changed)
```

## Why deterministic task extraction, LLM for Q&A

The Data Pack is small and fixed, and the assignment specifies **exact**
required outcomes for five business cases (vendor list dedup, deck review
time, expense report status, Meridian confirmation, Mumbai lease ownership).
A rule-based pass over the SQLite-backed sources (`agent/tasks.py`) is
auditable and guaranteed not to hallucinate a resolution the source data
doesn't support — every task carries its exact `sources` list back to the
transcript/email/voice-note it came from.

The LLM is used where open-ended reasoning actually helps: `POST /api/ask`
(`agent/qa.py`) builds a full grounded context from the same task objects and
raw sources, and asks the model to *phrase* an answer strictly from that
context — never to introduce outside facts. **If no `ANTHROPIC_API_KEY` is
set, `/api/ask` automatically falls back to a deterministic keyword-matching
answer engine**, so the whole app works end-to-end with zero configuration;
adding a key upgrades Q&A to real LLM reasoning without any other change.

## "Now"

The agent's snapshot moment is **Friday, 25 September 2026, 9:00 AM** — the
last day of the week, with the Mumbai lease due that same day at end of day.
This is the latest point at which every source in the Data Pack has already
arrived, which is what makes the Mumbai lease genuinely urgent and the
vendor list genuinely overdue. It's a constant (`NOW`) at the top of
`agent/tasks.py` if you want to change it.

## Business case outcomes (verified in `tests/test_business_cases.py`)

| # | Case | Outcome |
|---|------|---------|
| 1 | Vendor List | Meeting + email thread + voice note **merged into one task** (`mergedFrom: 3`), overdue, owner Arjun → Raghav |
| 2 | Q3 Campaign Deck | Final review time resolved to **Thursday, 24 Sep, 9:30 AM** (the last-stated time, overriding earlier "Wednesday"/generic "Thursday morning" mentions) |
| 3 | Expense Variance Report | Delivered Wed 6 PM → status **`Received`** |
| 4 | Meridian Logistics | Shown as a **confirmed calendar event**, Wed 23 Sep, 3:00–3:30 PM |
| 5 | Mumbai Office Lease | Deadline Fri 25 Sep EOD, **ownership `Unassigned`/unclear** — never auto-resolved to Facilities, even though one email speculates it "typically sits with Facilities" |

## Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

pip install -r requirements.txt
cp .env.example .env         # optional — see below
uvicorn main:app --reload --port 8000
```

Swagger UI: http://localhost:8000/docs

### Optional: real LLM-powered Q&A

By default `/api/ask` works with **no API key** via the deterministic
fallback. To use a real Claude model for Q&A, put a key in `.env`:

```
ANTHROPIC_API_KEY=your_key_here
LLM_MODEL=claude-haiku-4-5-20251001   # optional, this is the default
```

## API

| Method | Path | Description |
|---|---|---|
| GET | `/api/brief` | Daily brief: stats, priority actions, waiting-on-others, unclear ownership, today's calendar |
| GET | `/api/tasks` | All extracted tasks, every bucket |
| GET | `/api/tasks/my-actions` | Tasks owned by Arjun (pending / received / completed) |
| GET | `/api/tasks/waiting` | Tasks genuinely blocked on someone else right now |
| GET | `/api/tasks/attention` | Unclear-ownership items — never auto-assigned |
| GET | `/api/calendar` | Full week schedule + today's events |
| GET | `/api/sources` | Summary of what the agent read (emails, calendar, transcripts, voice notes) |
| POST | `/api/ask` | `{ "question": "..." }` → `{ "answer": "...", "sources": [...] }` |
| GET | `/api/health` | Health check |

CORS is enabled for `http://localhost:5173` (the Vite dev server default).

## Tests

```bash
pytest
```

Covers each of the five business cases plus the six suggested `/api/ask`
questions from the assignment brief.

## Frontend integration

The frontend at `frontend/exec-agent` needs no changes beyond what's already
been made: `src/services/api.js` now calls this backend instead of resolving
mock data (its function signatures and return shapes are unchanged, so every
page/component works as-is). To run both together:

```bash
# Terminal 1
cd backend && uvicorn main:app --reload --port 8000

# Terminal 2
cd frontend/exec-agent && npm install && npm run dev
```

Open http://localhost:5173 — it talks to the backend at
`http://localhost:8000` by default (override with `VITE_API_BASE_URL` in a
`.env` file, see `.env.example`).

## Project structure

```
backend/
├── main.py                       # FastAPI app + routes
├── requirements.txt
├── .env.example
├── data/
│   └── datapack.json             # grounded Data Pack, verbatim
├── agent/
│   ├── db.py                     # loads datapack.json into in-memory SQLite
│   ├── models.py                 # Pydantic schemas (match the frontend's data contract)
│   ├── tasks.py                  # deterministic extraction/dedup/reasoning (5 business cases)
│   ├── calendar.py               # /api/calendar + brief calendar section
│   ├── sources.py                # /api/sources
│   ├── llm_client.py             # Anthropic API wrapper, graceful no-key fallback
│   ├── qa.py                     # /api/ask — LLM-grounded, deterministic fallback
│   └── time_utils.py             # chronological sort for "9:00–9:35 AM"-style strings
└── tests/
    └── test_business_cases.py
```
