# Architecture & Process Flow

## High-level flow

``` text
Assignment Data Pack
   |
   +--> Emails
   +--> Calendar
   +--> Leadership Sync transcript
   +--> Voice notes
             |
             v
      Ingestion / Parsing
             |
             v
     Grounded Data Store
       (SQLite in memory)
             |
             v
   Commitment + Reasoning Layer
   - extract action / owner / deadline
   - deduplicate repeated actions
   - resolve latest deadline/status
   - separate my actions / waiting
   - flag unclear ownership
             |
             v
       Structured Tasks
             |
       +-----+-----+
       |           |
       v           v
 Daily Brief     Q&A Agent
       |           |
       +-----+-----+
             |
             v
        FastAPI REST API
             |
             v
      React + Vite UI
```

## Key design decision

The supplied Data Pack is fixed and the assignment defines five
important business cases. Therefore, task extraction is deterministic
and auditable rather than a free-form LLM extraction step. The Q&A
endpoint can optionally use Claude for natural-language phrasing while
receiving only grounded context from the same task/source data. With no
API key, a deterministic fallback keeps the prototype runnable.

## API

-   `GET /api/brief`
-   `GET /api/tasks`
-   `GET /api/tasks/my-actions`
-   `GET /api/tasks/waiting`
-   `GET /api/tasks/attention`
-   `GET /api/calendar`
-   `GET /api/sources`
-   `POST /api/ask`
-   `GET /api/health`
