# AI Tools Used

## Development assistance

-   **ChatGPT** --- used to interpret the assignment requirements, plan
    the architecture, review the implementation, identify edge cases,
    and prepare submission documentation.
-   **Claude** --- used during development to help generate/review
    frontend and backend code while keeping the supplied assignment data
    as the source of truth.

## Runtime AI

The backend includes an optional Anthropic/Claude integration for the
`/api/ask` endpoint. The LLM receives grounded context assembled from
the project's task and source data and is instructed not to introduce
unsupported facts.

If no `ANTHROPIC_API_KEY` is configured, the prototype uses a
deterministic grounded Q&A fallback so the complete application remains
runnable without external API credentials.

## Responsible use

AI-generated code was reviewed against the five required business cases.
The project includes automated tests covering those cases.
