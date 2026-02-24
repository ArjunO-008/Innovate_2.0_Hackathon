# 🚀 ProMag — AI-Powered Project Management

> **⚠️ Hackathon Project **
> Built under time pressure. Some features are half-baked, some are hardcoded, and a few things are held together with duct tape. You've been warned.

---

## What is this?

**ProMag** is an AI-assisted project and product management tool that tries to take you from *"I have an idea"* to *"here's your sprint"* with minimal manual setup.

You describe your project — the problem, the purpose, the expected output — and an AI analyzes it, generates a project evaluation, scaffolds tasks, and monitors progress through integrations (or at least, it will eventually).

Think Jira + Notion + an AI PM that doesn't sleep.

---

## Current State (Honest Edition)

| Feature | Status |
|---|---|
| Auth (Email/Password via Firebase) | ✅ Working |
| Multi-step project creation form | ✅ Working |
| AI project evaluation modal | ✅ Working |
| Task generation via backend | ✅ Working |
| Task panel (view, add, edit, delete) | ✅ Working |
| Project dashboard with tabs | ✅ Working |
| Overview tab (milestone, progress, timeline, calendar) | ⚠️ Hardcoded mock data |
| AI Reports panel | ⚠️ Hardcoded mock data |
| Results tab | 🚧 Placeholder only |
| Dashboard project list | ⚠️ Hardcoded mock projects |
| Real Firestore project persistence | ❌ Not implemented |
| GitHub / Jira / Standup integrations | ❌ Not implemented |
| Responsive mobile layout | 🤷 Mostly fine |

---

## Tech Stack

- **React 19** + **Vite 7**
- **Tailwind CSS v4**
- **Firebase Auth** (email/password)
- **React Router v7**
- **Axios** (via a custom `apiFetch` wrapper with fallback)
- Backend: external API (not included in this repo)

---

## How It Works (the happy path)

1. **Sign up / Log in** on the homepage
2. Hit **Create Project** from the dashboard
3. Fill in the 6-step form: project name, problem statement, purpose, expected output, target audience, and optional extras
4. AI analyzes the submission and shows a **Project Evaluation modal** with structured feedback
5. Click **Proceed** → the backend creates a workspace and generates initial tasks
6. You land on the **Project Dashboard** with tasks pre-populated
7. Manage tasks, check the overview, read AI reports

---

## Project Structure

```
src/
├── assets/
├── components/
│   ├── AIReportsPanel.jsx     # hardcoded reports (for now)
│   ├── AuthCard.jsx           # login/signup form
│   ├── DecisionModal.jsx      # AI evaluation + confirm flow
│   ├── Navbar.jsx
│   ├── ProtectedRoute.jsx
│   ├── PublicRoute.jsx
│   ├── Spinner.jsx
│   └── TaskPanel.jsx          # full CRUD task management
├── context/
│   └── AuthContext.jsx
├── pages/
│   ├── CreateProject.jsx      # multi-step project form
│   ├── Dashboard.jsx          # project list (hardcoded)
│   ├── HomePage.jsx           # landing + auth
│   └── ProjectDashboard.jsx   # overview / tasks / reports / results
└── services/
    ├── apiFetch.js            # fetch wrapper with /webhook fallback
    └── firebase.js
```

---

## Known Issues / Cut Corners

- **Dashboard projects are hardcoded** — `MOCK_PROJECTS` in `Dashboard.jsx`. Firestore integration was planned but didn't make the cut.
- **Overview data is hardcoded** — `MOCK_OVERVIEW` in `ProjectDashboard.jsx`. The real API shape is TBD.
- **AI Reports are static** — the report cards in `AIReportsPanel.jsx` are demo data. Real integration with GitHub, Jira, and standup notes is the vision, not the reality.
- **`VITE_STORAGEBUCKRT` typo** — it's a typo in `firebase.js`. Changing it breaks the env. Left as-is.
- **`apiFetch` fallback** — the fetch utility tries `/api/webhook/{path}` first, then falls back to `/api/webhook-test/{path}`. This was a dev convenience that made it into the demo.
- **No error boundaries** — if something explodes, you get a blank screen. Good luck.
- **Tab state via `window.location.hash`** — not the cleanest approach but it gives deep-linkable tabs without extra state.

---

## Team

Built at **[Innovate 2.0]** in **[48 Hours]**.

---
