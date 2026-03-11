# GoForIt — Task Management Web App

A full-stack, multi-user task management application with real-time status tracking, session-based authentication, and a relational data model. Built end-to-end without scaffolded boilerplate beyond the core framework.

---

## What It Does

Users register, log in, and manage tasks organized into named categories. Each task carries a name, description, start/end datetimes, and a computed status — **Soon**, **Ongoing**, or **Missed** — that updates automatically based on the current time. Users can mark tasks complete, bulk-delete finished tasks, and rename or delete categories.

---

## Technical Highlights

### Data Modeling & SQL
Designed a normalized relational schema across four tables (`users`, `category`, `tasks`, `sessions`) with foreign key relationships enforcing per-user data ownership. All queries explicitly scope results to `users_id` — no user can read or mutate another user's data. Cascade deletes on category removal are handled at the application layer, keeping dependent tasks consistent.

### Backend Architecture
Built a RESTful API in **Node.js + Express** with route-level session authentication guards. Every mutation endpoint returns a fresh server-side snapshot of the affected data, avoiding stale client state without a separate polling layer. Used **MySQL connection pooling** to handle concurrent requests efficiently.

### Authentication & Security
Passwords are hashed with **bcryptjs** (cost factor 8) before storage. Sessions are persisted server-side in MySQL via `express-mysql-session`, with configurable expiration and automatic cleanup — avoiding the security risks of purely client-side JWTs for this use case.

### Timezone-Aware Datetime Handling
Wrote a custom time utility module that converts between UTC (storage), local browser time (display), and HTML datetime-input format. The `CheckTimeStatus` function computes task urgency relative to the client's local clock, not the server's — a deliberate design choice to correctly handle users across timezones.

### Frontend & Custom Hooks
Built the UI in **React + Next.js** (SSR). Authored a suite of custom React hooks — `useUpdateEffect`, `useEffectInterval`, `useUpdateEffectInterval`, `useUpdateOnceEffect`, `useUpdateEffectIf` — to give fine-grained control over when effects re-run, avoiding the "run on mount" behavior of the standard `useEffect` where it was undesirable.

### Custom DOM Utility Library
Authored `animation.js`, a jQuery-inspired DOM abstraction built on the Web Animations API. It supports CSS property setting, transform shorthand, keyframe animation, scroll manipulation, and element dimension utilities — written from scratch to understand what abstraction layers like jQuery actually do under the hood.

---

## Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Server | Express.js |
| Frontend | React 18, Next.js 12 |
| Database | MySQL (via `mysql` connection pool) |
| Auth | `express-session` + `bcryptjs` |
| Session Store | `express-mysql-session` |
| Deployment | Heroku |

---

## What This Demonstrates

- Ability to **own a full system** — from schema design to UI rendering — without splitting the problem into pre-solved parts
- Practical understanding of **relational data ownership and query scoping**
- Deliberate decisions around **data freshness, timezone correctness, and auth persistence** — not just wiring libraries together
- Comfort writing **low-level utilities** (time conversion, DOM animation) rather than defaulting to dependencies
