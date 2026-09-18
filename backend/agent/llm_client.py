"""Optional LLM adapter.

The application is fully usable without an LLM key. When ANTHROPIC_API_KEY is
configured, this module calls the Anthropic Messages API using Python's
standard library, so the backend has no mandatory provider SDK dependency.
"""
from __future__ import annotations

import json
import os
import urllib.error
import urllib.request

DEFAULT_MODEL = os.environ.get("LLM_MODEL", "claude-haiku-4-5-20251001")


def is_configured() -> bool:
    return bool(os.environ.get("ANTHROPIC_API_KEY"))


def ask_llm(system_prompt: str, user_message: str) -> str | None:
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        return None

    payload = json.dumps({
        "model": os.environ.get("LLM_MODEL", DEFAULT_MODEL),
        "max_tokens": 500,
        "system": system_prompt,
        "messages": [{"role": "user", "content": user_message}],
    }).encode("utf-8")

    request = urllib.request.Request(
        "https://api.anthropic.com/v1/messages",
        data=payload,
        headers={
            "Content-Type": "application/json",
            "x-api-key": api_key,
            "anthropic-version": "2023-06-01",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=20) as response:
            body = json.loads(response.read().decode("utf-8"))
        parts = [
            block.get("text", "")
            for block in body.get("content", [])
            if block.get("type") == "text"
        ]
        text = "\n".join(parts).strip()
        return text or None
    except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError, OSError, ValueError):
        return None
