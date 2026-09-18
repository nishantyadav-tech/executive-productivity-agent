// ---------------------------------------------------------------------------
// Service layer — Executive Productivity Agent
// ---------------------------------------------------------------------------
// This is the ONLY file that changed to connect the existing UI to the real
// FastAPI backend. Every page/component still imports exclusively from this
// file, so no component or page needed to change — only the implementation
// of each function below, which now performs a real `fetch` instead of
// resolving mock data.
// ---------------------------------------------------------------------------

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

async function request(path, options) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`Request to ${path} failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function getDailyBrief() {
  return request("/api/brief");
}

export async function getTasks() {
  return request("/api/tasks/my-actions");
}

export async function getWaitingOnOthers() {
  return request("/api/tasks/waiting");
}

export async function getUnclearOwnership() {
  return request("/api/tasks/attention");
}

export async function getCalendar() {
  return request("/api/calendar");
}

export async function getSources() {
  return request("/api/sources");
}

export async function askAgent(question) {
  return request("/api/ask", {
    method: "POST",
    body: JSON.stringify({ question }),
  });
}
