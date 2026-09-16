# Pass No Jugaad — Master Prompt: Admin Layer & Panel Update

## Context
Pass No Jugaad is a live event discovery / demand-aggregation platform (not ticketing) for Ahmedabad Navratri 2026. Current flows: buyer "Find Your Jugaad" form, event browsing, organiser listing form, Radar, Calendar, Jugaad Drops, auth-gated My Requests. This prompt adds the missing **role layer**: Super Admin, Organiser-as-Admin, and a proper Buyer panel, plus the data plumbing between them.

Backend: Supabase (Postgres + Auth + Row Level Security + Storage).

---

## 1. Roles

| Role | Who | Scope |
|---|---|---|
| **Super Admin** | Platform owner (Hanika) — one fixed account | Sees and controls everything: all events, all statuses, all buyer requests, all Find-Your-Jugaad radar data |
| **Admin (Organiser)** | Whoever submits an event listing, once approved | Sees and manages only their own event(s) and the pass requests tied to their own event(s) |
| **Buyer** | Anyone who signs up to request passes or submit Find Your Jugaad | Sees and manages only their own submissions/requests |

Use Supabase Row Level Security policies keyed on `user_id` / `organiser_id` so Admins can never query another organiser's requests, and only Super Admin bypasses RLS (via a `role = 'super_admin'` claim or service-role dashboard).

---

## 2. Data Model Additions

**`events` table** (extend existing)
- `status`: enum `pending_review | approved | rejected` (default `pending_review`)
- `organiser_id`: FK to the organiser's auth user
- `reviewed_by`, `reviewed_at`, `rejection_reason` (nullable)

**`pass_requests` table** (new — captures the "Request Passes" submissions from EventDetail)
- `id`, `event_id` (FK), `buyer_id` (FK), `quantity`, `status` (`request_received | looking_for_options | match_found | offer_available | completed | closed`), `created_at`, `updated_at`

**`jugaad_signals` table** (new — captures "Find Your Jugaad" homepage form submissions, feeds the Radar)
- `id`, `buyer_id`, `preferred_dates[]`, `num_passes`, `budget_min`, `budget_max`, `event_type`, `artist_preference`, `specific_event` (nullable), `readiness` (priority scale), `created_at`

---

## 3. Flow Updates

### 3.1 Organiser Submission → Review → Listing
1. Organiser fills `OrganiserForm` → on submit, insert into `events` with `status = pending_review`.
2. Organiser sees confirmation ("We've got your event — under review").
3. Super Admin Dashboard shows a **Pending Review** queue.
4. Super Admin can: **Approve** (status → `approved`, event goes live) / **Reject** (status → `rejected`, optional reason sent back to organiser) / **Edit** any field before or after approval / **Delete** the event entirely.
5. On approval, organiser is granted Admin access scoped to that `event_id`.

### 3.2 Buyer Requests Passes
1. Buyer clicks "Request Passes" on `EventDetail` → hits `AuthModal` if not logged in (existing gate) → submits `RequestPass` form → insert into `pass_requests`.
2. This request becomes visible to:
   - **That event's Admin (organiser)** — filtered to their `event_id` only.
   - **Super Admin** — visible in the global requests table.
3. Admin/Super Admin update `status` through the existing lifecycle (`Request received → Looking for options → Match found → Offer available → Completed/Closed`); status changes reflect live in the buyer's **My Requests** panel.

### 3.3 Find Your Jugaad → Radar
1. Homepage "Find Your Jugaad" form submits into `jugaad_signals`.
2. Radar tab aggregates this table live: per-night demand cards (count of signals per date, avg group size, budget spread, top vibe/type chips) plus the top-line aggregate stats (total seekers, avg group size, "hot nights" count).
3. This data is **Super Admin visible in full** (raw signal list + export); Admins do **not** see this data unless it's tied to their specific event via `specific_event`.

### 3.4 Buyer Panel (new)
Add a "Mine" panel (already auth-gated) with two sections:
- **My Requests** — existing status-tracked list of `pass_requests`, tabbed Active / Completed / Closed.
- **My Jugaad Signals** — list of their Find Your Jugaad submissions, with a **"+ Add New Response"** action that reopens the FindJugaad form (pre-fillable) to submit another date/budget/type combination without re-entering name/email.

### 3.5 Super Admin Dashboard (new)
Sections:
- **Pending Review** — organiser event submissions awaiting approve/reject.
- **All Events** — every event regardless of status, with inline edit/delete.
- **All Requests** — every `pass_request` across every event, filterable by event/status/date.
- **Radar / Jugaad Signals** — full raw `jugaad_signals` table, sortable/filterable, mirrors what feeds the public Radar tab.
- **Organisers** — list of organiser accounts and which events they manage.

### 3.6 Admin (Organiser) Dashboard (new)
Scoped view of the same shell, restricted to:
- Their own event(s) — edit details (not approve themselves; edits after approval can optionally re-enter `pending_review` if you want re-moderation).
- `pass_requests` tied only to their own `event_id`(s), with the same status-update controls as Super Admin but scoped.
- No visibility into other organisers' events or the global Radar/signals data.

---

## 4. Auth & Access Control
- Use Supabase Auth for all three roles; add a `role` field on the `profiles` table (`buyer | organiser | super_admin`), set `super_admin` manually only on your own account.
- RLS policies:
  - `pass_requests`: buyer can `SELECT`/`INSERT` their own rows; organiser can `SELECT`/`UPDATE` rows where `event_id` is in their owned events; super_admin bypasses via service role or a `is_super_admin()` policy function.
  - `events`: public `SELECT` where `status = 'approved'`; organiser `SELECT`/`UPDATE` own rows regardless of status; super_admin full access.
  - `jugaad_signals`: buyer `SELECT`/`INSERT` own rows; super_admin full access; organisers no access unless explicitly linked via `specific_event`.

## 5. Non-Goals / Keep As-Is
- No WhatsApp integration anywhere — Instagram + Email only.
- Not a payment/ticketing flow — no checkout, no ticket generation.
- Ivory/Fraunces+DM Sans/vermillion design system stays unchanged across all new admin/panel screens — reuse existing component styles, don't introduce a separate "admin UI kit" look.
