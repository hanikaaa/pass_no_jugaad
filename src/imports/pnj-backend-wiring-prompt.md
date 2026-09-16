# Pass No Jugaad — Backend Wiring Prompt (Auth + Schema + Data Flow + APIs)

## Context
Pass No Jugaad is a React 19 + Vite + Tailwind v4 app currently running on a mock data layer, with a demo Role Switcher (Buyer / Organiser / Admin) standing in for real auth. Replace the mock layer with real Supabase (Postgres + Auth + RLS), without changing any existing UI/visual design. Remove the Demo Role Switcher once real auth is wired in.

---

## 1. Authentication

- Use **Supabase Auth** (email/password + magic link) for all users — Buyers and Organisers sign up the same way; role is assigned in the `profiles` table, not at sign-up.
- On first sign-up, auto-create a row in `profiles` with `role = 'buyer'` by default.
- Organiser role is granted the moment someone submits the Organiser Form for the first time (set `role = 'organiser'` on that profile, or add a `is_organiser` flag if a person can be both a buyer and an organiser).
- `super_admin` role is set manually, once, only on Hanika's account directly in the Supabase dashboard — never exposed as a selectable role anywhere in the UI.
- Auth gate applies only to: **Request a Pass**, **Find Your Jugaad**, **My Jugaad panel**, **Organiser Form/Dashboard**. Browsing Events, Calendar, Radar, Drops, Gallery stays public/no-login.
- Session: use Supabase's client-side session (JWT in local storage via supabase-js), read `role` from the `profiles` table on load to decide which dashboard shell (Buyer / Organiser / Admin) to render — this replaces the Demo Role Switcher.

---

## 2. Schema (Postgres tables)

**`profiles`**
- `id` (uuid, references `auth.users`), `email`, `role` (`buyer | organiser | super_admin`), `name`, `phone` (optional), `created_at`

**`events`**
- `id`, `organiser_id` (FK → profiles), `name`, `venue`, `date`, `time`, `price_min`, `price_max`, `type_tags[]`, `artist`, `description`, `instagram_link`, `contact_email`, `status` (`pending_review | approved | rejected`), `rejection_reason`, `reviewed_by`, `reviewed_at`, `created_at`, `updated_at`

**`pass_requests`**
- `id`, `event_id` (FK → events), `buyer_id` (FK → profiles), `quantity`, `budget_min`, `budget_max`, `priority_note`, `status` (`request_received | looking_for_options | match_found | offer_available | completed | closed`), `offer_details` (text/jsonb, shown when `offer_available`), `created_at`, `updated_at`

**`jugaad_signals`**
- `id`, `buyer_id` (FK → profiles), `preferred_dates[]`, `num_passes`, `budget_min`, `budget_max`, `event_types[]`, `artist_preference`, `specific_event` (nullable text or FK), `readiness` (enum/int scale), `created_at`

---

## 3. Row Level Security

- `profiles`: user can `SELECT`/`UPDATE` own row only; super_admin full access.
- `events`: public `SELECT` where `status = 'approved'`; organiser `SELECT`/`UPDATE`/`DELETE` where `organiser_id = auth.uid()` regardless of status; super_admin full access to all rows and all actions.
- `pass_requests`: buyer `SELECT`/`INSERT` where `buyer_id = auth.uid()`; organiser `SELECT`/`UPDATE` where `event_id` is in their own events; super_admin full access.
- `jugaad_signals`: buyer `SELECT`/`INSERT` where `buyer_id = auth.uid()`; super_admin full access; organisers have no access by default.

---

## 4. Data Flow — Screen by Screen

| Screen | Read | Write |
|---|---|---|
| Events grid | `events` where `status = approved` | — |
| Event Detail | single `events` row | — |
| Request a Pass | pre-fill event from `events` | insert into `pass_requests` |
| Find Your Jugaad | — | insert into `jugaad_signals` |
| Radar | aggregate query over `jugaad_signals` (group by date/type, counts, avg budget) | — |
| My Jugaad → Pass Requests | `pass_requests` where `buyer_id = auth.uid()`, join `events` for display | — |
| My Jugaad → My Signals | `jugaad_signals` where `buyer_id = auth.uid()` | insert (via "+ Add new response") |
| Organiser Form | — | insert into `events` (`status = pending_review`) |
| Organiser Dashboard → My Events | `events` where `organiser_id = auth.uid()` | update own event fields |
| Organiser Dashboard → Pass Requests | `pass_requests` joined to `events` where `organiser_id = auth.uid()` | update `status`, `offer_details` |
| Admin → Pending Review | `events` where `status = pending_review` | update `status` to approved/rejected + `rejection_reason` |
| Admin → All Events | all `events` | update/delete any row |
| Admin → All Requests | all `pass_requests` joined to `events` + `profiles` | update `status` on any row |
| Admin → Radar/Signals | all `jugaad_signals` raw + aggregated | — |
| Admin → Organisers | `profiles` where `role = organiser`, joined to their `events` count | — |

---

## 5. API Layer (Supabase client calls to implement)

Wrap these as functions in a `lib/api.ts` (or equivalent) so components call a clean function, not raw Supabase queries:

- `signUp(email, password)`, `signIn(email, password)`, `signOut()`, `getCurrentProfile()`
- `getApprovedEvents(filters)`, `getEventById(id)`
- `submitEvent(eventData)`, `updateEvent(id, fields)`, `deleteEvent(id)` — RLS enforces organiser/admin scope
- `submitPassRequest(eventId, formData)`, `getMyPassRequests()`, `getRequestsForMyEvents()` (organiser), `getAllPassRequests()` (admin), `updateRequestStatus(id, status, offerDetails?)`
- `submitJugaadSignal(formData)`, `getMySignals()`, `getRadarAggregates()` (public-safe aggregate view or RPC function), `getAllSignals()` (admin only)
- `approveEvent(id)`, `rejectEvent(id, reason)` — admin only, enforced by RLS checking `role = super_admin`
- `getOrganisers()` — admin only

For `getRadarAggregates()`, use a Postgres **view** or **RPC function** that pre-aggregates `jugaad_signals` (counts per date, avg budget, top types) so the public Radar page never queries raw signal rows directly — keeps buyer data private while the aggregate stays public.

---

## 6. Migration Notes
- Keep every existing component's props/shape identical where possible — swap the mock data source for the real API function, don't restructure components.
- Once real auth + role from `profiles` is wired in, delete the Demo Role Switcher component and any mock-data fixtures.
- No payment/ticketing logic — this wiring only covers accounts, listings, requests, and demand signals.
