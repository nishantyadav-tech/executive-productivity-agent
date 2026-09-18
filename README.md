# Executive Productivity Agent

**AIONOS Agentic AI Factory — Assignment 1**

A full-stack prototype for Arjun Malhotra (VP Sales) that turns the supplied messy executive inputs into a grounded daily action brief and answers natural-language questions about commitments, deadlines and meetings.

## What this project demonstrates

- Commitment extraction from emails, meeting transcript and voice notes
- Deduplication of the same action across multiple sources
- Separation of **My Actions** vs **Waiting on Others**
- Deadline and overdue detection
- Latest-deadline/status resolution
- Unclear ownership flagging without inventing an owner
- Daily executive brief
- Calendar view and source traceability
- Grounded Q&A through `/api/ask`

## Tech stack

- **Frontend:** React 19, Vite, Tailwind CSS, Lucide React
- **Backend:** Python 3.11+, FastAPI, Pydantic, SQLite
- **Optional AI:** Anthropic/Claude for grounded Q&A phrasing
- **Testing:** Pytest + FastAPI TestClient

## Project structure

```text
exec-agent-fullstack/
├── backend/
│   ├── agent/
│   ├── data/datapack.json
│   ├── tests/
│   ├── main.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/exec-agent/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── .env.example
├── SUBMISSION/
│   ├── ARCHITECTURE.md
│   ├── architecture.png
│   ├── ASSUMPTIONS.md
│   ├── AI_TOOLS_USED.md
│   ├── DEMO_SCRIPT.md
│   ├── SUBMISSION_CHECKLIST.md
│   └── AIONOS_Executive_Productivity_Agent_10_Slides.pptx
├── start.bat
├── setup_backend.bat
└── setup_frontend.bat
```

## Run locally on Windows

### First-time backend setup

```powershell
cd backend
python -m venv venv
venv\Scripts\activate
python -m pip install -r requirements.txt
python -m pytest -q
uvicorn main:app --reload --port 8000
```

Backend: `http://localhost:8000`  
Swagger: `http://localhost:8000/docs`

### First-time frontend setup

Open a second terminal:

```powershell
cd frontend\exec-agent
npm install
npm run dev
```

Frontend: `http://localhost:5173`

The frontend calls `http://localhost:8000` by default. If needed, copy `.env.example` to `.env` and set `VITE_API_BASE_URL`.

### One-click launcher

After first-time dependency setup, run `start.bat` from the project root. It opens the backend and frontend in separate terminals.

## Validation

The reviewed backend test suite passes **9/9 tests**. The tests cover the five required business cases and API/Q&A behaviour.

The five key outcomes are:

1. **Vendor list:** meeting + email + voice note are deduplicated into one overdue task.
2. **Campaign deck:** final review time is Thursday, 24 September, 9:30 AM.
3. **Expense report:** report is marked `Received` after Wednesday 6 PM delivery.
4. **Meridian Logistics:** call is confirmed for Wednesday, 23 September, 3:00–3:30 PM.
5. **Mumbai lease:** Friday EOD deadline remains unassigned/unclear; the agent does not assume Facilities owns it.

## Data and grounding

The supplied Assignment 1 Data Pack is the source of truth. The prototype does not connect to real inboxes or calendars and does not invent information outside the pack.

The agent uses a fixed snapshot of **Friday, 25 September 2026 at 9:00 AM**, after all supplied source material is available.

## Optional Claude Q&A

The application works without an API key using a deterministic grounded fallback. To enable optional Claude phrasing, create `backend/.env` from `backend/.env.example` and set:

```text
ANTHROPIC_API_KEY=your_key_here
LLM_MODEL=claude-haiku-4-5-20251001
```

Never commit `.env` or an API key. `.gitignore` excludes it.

## Submission materials

See the `SUBMISSION/` folder for:

- architecture and process flow
- inputs/sources/assumptions
- AI tools used
- 15-minute demo/defence script
- submission checklist
- 10-slide presentation

The only item that must be created outside the repository is the **demo video**: record the working prototype, upload it to Google Drive, and set sharing so the evaluator can open it.
