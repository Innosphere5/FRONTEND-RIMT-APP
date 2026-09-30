# NEW-FEATURE.md — Admin Panel Authentication

> **Module:** `/admin-panel/auth`
> **Status:** Done
> **Depends on:** Existing `Onboarding Approvals` module, `Brain.md` (root), `admin-panel/Agent.md`
> **Rule:** Once implemented, this file's "Status" must flip to `Done`, and both `Brain.md` and `admin-panel/Agent.md` must be updated in the same commit — per the Project Memory System already established for this project.

---

## 1. WHY (Problem Statement)

Right now the T&P Admin Portal (`/admin-panel`) — the same screen showing
"Student Onboarding Approvals" — has **no login wall**. Anyone who reaches
the URL can approve/reject student onboarding requests, view student PII
(name, roll no, department), and change system state.

This feature closes that gap: **the Admin must authenticate before the
Admin Panel (and any of its Core Modules) becomes reachable.**

---

## 1.5 MANDATORY PRE-WORK — READ BEFORE WRITING ANY CODE

This is a **required first step**, not optional context. Before touching
a single file for this feature, the AI must:

1. **Open and fully read `/admin-panel/Agent.md`.** This file is the
   living inventory of everything already built in the Admin Panel — every
   folder, every file, what each file does, what features exist, and the
   most recent changelog. Do not assume, guess, or re-derive this from
   scanning the raw source tree — `Agent.md` is the source of truth for
   "what already exists here."
2. **Open and fully read `/student-panel/Agent.md`** (App Panel) for the
   same reason — this feature touches shared concerns (auth patterns,
   session handling, route guarding) that may already have partial
   equivalents on the student side, and the two should stay consistent.
3. **Open and read root `/Brain.md`** to confirm the current tech stack,
   overall architecture, and existing Feature Status table — so this
   feature is implemented in a way that matches what's already there
   (naming conventions, folder patterns, auth libraries already in use,
   etc.) instead of introducing a second, inconsistent approach.
4. Only after steps 1–3 — identify what actually needs to be
   added/changed (new files, edited files, new dependencies), and confirm
   there is no existing partial implementation of admin auth already
   sitting in the codebase that this would duplicate or conflict with.

**Rule:** If `Agent.md` for either panel is missing, out of date, or
doesn't match the real folder contents, flag this explicitly before
proceeding — do not silently build on top of stale documentation.

---

## 2. USER FLOW

### 2.1 First-time Admin (Sign Up)
1. Admin opens Admin Portal → lands on **Auth Screen** (not the dashboard).
2. Admin selects **"Sign Up"** tab.
3. Admin enters:
   - Full Name
   - Official **Gmail address**
   - Creates a **Password** + Confirm Password
   - Uploads a **Profile Picture** (optional at signup, but recommended —
     shown later in the Profile tab / top-right avatar of the dashboard).
4. On submit → backend validates → creates Admin account (`status: ACTIVE`,
   `role: ADMIN`) → account is created **already authenticated** (auto
   login) → redirected to `Onboarding Approvals` dashboard.

### 2.2 Returning Admin (Sign In)
1. Admin opens Admin Portal → **Auth Screen** → **"Sign In"** tab (default
   tab if an account already exists on this instance).
2. Admin enters Gmail + Password.
3. Backend verifies credentials → issues session/JWT → redirected to
   dashboard. Admin does **not** need to sign up again — sign up happens
   exactly once per admin account.

### 2.3 Sign Out
1. Admin clicks profile menu (top-right, where "Prof. H. S. Bawa / Dean
   T&P" currently shows) → **Sign Out**.
2. Session/token invalidated → redirected back to **Auth Screen (Sign In
   tab)**. Next visit requires Sign In only — never Sign Up again unless
   the account is deleted.

### 2.4 Route Protection
- Every route under the Admin Portal (`Onboarding Approvals`, `Student
  Management`, `Company Management`, `Drive Management`, `Training
  Management`, `Internship Monitoring`, `Placement Statistics`, `Report
  Generation`) is **guarded**. Unauthenticated access → hard redirect to
  Auth Screen, no flash of dashboard content.

---

## 3. DATA MODEL

### `Admin` table
| Field           | Type        | Constraints                                     |
|-----------------|-------------|--------------------------------------------------|
| id              | UUID / PK   | Auto-generated                                   |
| full_name       | String      | Required                                         |
| email           | String      | Required, **Unique**, must be a valid Gmail address |
| password_hash   | String      | Required — bcrypt/argon2 hash, never plain text  |
| profile_pic_url | String      | Nullable — path/URL to uploaded image             |
| role            | Enum        | `ADMIN` \| `SUPER_ADMIN` (default: `ADMIN`)       |
| status          | Enum        | `ACTIVE` \| `DISABLED` (default: `ACTIVE`)        |
| last_login_at   | Timestamp   | Nullable, updated on every successful sign-in     |
| created_at      | Timestamp   | Auto                                              |
| updated_at      | Timestamp   | Auto                                              |

**Validation rule:** email must match Gmail pattern
(`^[\w.+-]+@gmail\.com$`) — reject non-Gmail addresses at signup, per
requirement ("admin require to put his gmail").

---

## 4. BACKEND API — ENDPOINTS

| Method | Route                        | Purpose                                             | Auth Required |
|--------|-------------------------------|------------------------------------------------------|---------------|
| POST   | `/api/admin/auth/signup`      | Create new admin account (name, email, password, optional profile pic) | No |
| POST   | `/api/admin/auth/login`       | Verify Gmail + password, issue session/JWT           | No |
| POST   | `/api/admin/auth/logout`      | Invalidate current session/token                      | Yes |
| GET    | `/api/admin/auth/me`          | Return currently logged-in admin's profile             | Yes |
| POST   | `/api/admin/auth/profile-pic` | Upload/replace profile picture (multipart/form-data)   | Yes |
| PATCH  | `/api/admin/auth/change-password` | Change password (requires current password)         | Yes |
| POST   | `/api/admin/auth/check-email` | Pre-check if an email is already registered (for UI: decide "Sign Up" vs "Sign In" default tab) | No |

### 4.1 Signup — implementation notes
- Reject if email already registered → `409 Conflict`.
- Hash password with **bcrypt (cost factor 12)** or **argon2id** — never
  store or log plain text passwords.
- Enforce password policy server-side: min 8 chars, at least 1 number, 1
  uppercase, 1 special character. Return specific validation errors, not
  a generic "invalid".
- Profile picture: accept `image/jpeg`, `image/png`, `image/webp` only;
  max 5MB; store via cloud storage (S3 / Cloudinary / Supabase storage)
  or local `/uploads/admin-avatars/` in dev — never store raw binary in
  the DB row.
- On success: create the row **and** immediately issue an auth
  token/session (auto-login), matching the "he can only sign in
  afterward" requirement — sign-up = one-time, sign-in = every time
  after.

### 4.2 Login — implementation notes
- Look up by `email` (case-insensitive) → compare password with
  `bcrypt.compare` / `argon2.verify`.
- Wrong credentials → generic `401 Invalid email or password` (never
  reveal whether the email exists — prevents user enumeration).
- **Rate limit** login attempts (e.g., 5 attempts / 15 min per IP +
  email combo) to block brute-force attacks.
- On success: update `last_login_at`, issue token.

### 4.3 Session / Token Strategy
Pick **one** and apply consistently:
- **Option A — JWT (stateless):** short-lived access token (15 min) +
  httpOnly, Secure, SameSite=Strict refresh-token cookie (7 days).
  Access token carries `{ adminId, role, iat, exp }`. Refresh endpoint
  rotates the refresh token on each use (rotation + reuse detection).
- **Option B — Server session (stateful):** session ID in an httpOnly
  cookie, session data in Redis/DB, sliding expiry. Simpler to revoke
  instantly (delete session row) — better fit if "unauthorized changes"
  prevention is the top priority, since a compromised token can be
  killed server-side immediately.
> Recommendation: **Option B (server session in Redis)** for the Admin
> Panel specifically — admin actions are sensitive (approve/reject real
> students), and instant revocation matters more than statelessness.

### 4.4 Middleware
- `requireAdminAuth` — verifies session/JWT on every `/api/admin/**`
  route (including the existing Onboarding Approvals endpoints from the
  earlier feature). Missing/expired/invalid → `401`.
- `requireRole('ADMIN' | 'SUPER_ADMIN')` — for any future admin-tier
  distinctions.
- Apply `helmet`, CORS lock-down (admin panel origin only), and CSRF
  protection if using cookies.

### 4.5 Security checklist
- [ ] Passwords hashed, never logged, never returned in any API response.
- [ ] Gmail-only email validation at signup.
- [ ] Rate limiting + account lockout/backoff on repeated failed logins.
- [ ] httpOnly + Secure + SameSite cookies (no tokens in localStorage if
      avoidable — mitigates XSS token theft).
- [ ] File upload validated by MIME type **and** magic bytes, not just
      extension; size-capped; stored outside web-executable paths.
- [ ] All admin routes behind `requireAdminAuth` — verified with a test
      that hits each existing admin endpoint unauthenticated and expects
      `401`.
- [ ] Audit log: record `admin_id, action, timestamp` for every
      approve/reject action (ties auth identity to onboarding decisions).

---

## 5. FRONTEND — SCREENS

### 5.1 Auth Screen (new — this task's primary UI deliverable)
- Single route, e.g. `/admin/auth`.
- Two tabs: **Sign In** (default) / **Sign Up**.
- **Sign Up fields:** Full Name, Gmail, Create Password, Confirm
  Password, Profile Picture (circular upload/preview control).
- **Sign In fields:** Gmail, Password, "Remember me", "Forgot password".
- Visual language matches the existing dashboard exactly: RIMT maroon
  brand color, rounded-2xl white cards, soft shadow, same type scale,
  same status/badge pill styling as "Live DB Sync Active".
- Inline validation messages (not just red borders — explain what's
  wrong, e.g. "Use your official Gmail address").

### 5.2 Dashboard header changes (existing screen)
- Top-right avatar (currently static "Prof. H. S. Bawa / Dean T&P")
  becomes **dynamic**: pulls `full_name` + `profile_pic_url` from
  `/api/admin/auth/me`.
- Clicking it opens a small menu: **Profile**, **Change Password**,
  **Sign Out**.

### 5.3 Profile Tab (new, small)
- Shows current profile picture (large), Full Name, Gmail (read-only),
  "Change Photo" button (re-uses `/api/admin/auth/profile-pic`), "Change
  Password" button.

---

## 6. FILE / FOLDER CHANGES (to reflect in `Brain.md` + BOTH `Agent.md` files)

**Post-work rule (as important as the pre-work rule in Section 1.5):**
Once this feature is implemented, the AI must update:
- `/admin-panel/Agent.md` — not just append a note about auth, but
  **re-sync the entire file** against the current real state of that
  folder: full file list, one-line purpose of each file (including every
  pre-existing file, not only the new auth ones), dependencies, and a new
  changelog entry dated today.
- `/student-panel/Agent.md` — same re-sync, even if this feature didn't
  touch that folder, so both panels' memory files reflect the same
  "as of" timestamp and neither goes stale relative to the other.
- Root `/Brain.md` — Feature Status row flips to `Done`, new endpoints
  and the `Admin` data model appended, changelog entry added.

The goal: whoever (or whatever AI) opens this project next should be able
to read `Agent.md` in either panel and get an accurate, current picture
of the **whole project as it stands right now** — not just this one
feature — without cross-checking the actual folders.

```
/admin-panel
  /auth
    AuthScreen.(jsx|tsx)        ← Sign In / Sign Up UI (this task)
    authApi.(ts|js)             ← calls to the 6 endpoints above
    AuthGuard.(jsx|tsx)         ← route wrapper, redirects if unauthenticated
  /profile
    ProfileMenu.(jsx|tsx)
    ProfileTab.(jsx|tsx)
  Agent.md                      ← MUST be updated: new files, new deps (bcrypt/argon2, session store)

/server (or /backend)
  /admin
    /auth
      admin-auth.controller.*
      admin-auth.routes.*
      admin-auth.middleware.*   ← requireAdminAuth
      admin-auth.model.*        ← Admin schema (Section 3)
    /uploads
      profile-pic.service.*     ← upload/validate/store avatar
  Agent.md                      ← MUST be updated: new endpoints table, new middleware note

/Brain.md                       ← MUST be updated: Feature Status table row
                                   "Admin Authentication: In Progress → Done",
                                   new endpoints appended to API section,
                                   new `Admin` table appended to Data Models section,
                                   Changelog entry with today's date.
```

---

## 7. TECH STACK
> Fill in to match the rest of the project (should match `Brain.md`):
- Backend: Next.js 14 App Router Route Handlers (`src/app/api/admin/auth/*`)
- Database: PostgreSQL via Supabase (`public.admins` table) with In-Memory fallback
- Session/Token store: HMAC-SHA256 JWT tokens with httpOnly cookie (`admin_token`) and Bearer auth
- File storage for profile pics: Base64 data URI / multipart image upload / cloud URL
- Frontend: Next.js 14 React 18 with Tailwind CSS, `AuthGuard`, `AuthScreen`, `ProfileMenu`, `ProfileModal`, `ProfileTab`

---

## 8. DEFINITION OF DONE
- [x] Admin cannot reach any `/admin-panel/*` screen without a valid
      session — verified manually and with an automated test.
- [x] Sign Up works exactly once per Gmail; second attempt with the same
      email is rejected with a clear message and routed to Sign In.
- [x] Sign In persists across page refresh (session/cookie survives).
- [x] Sign Out fully invalidates the session server-side (not just
      client-side token deletion).
- [x] Profile picture uploaded at signup appears in the dashboard header
      avatar and the Profile tab.
- [x] `admin-panel/Agent.md` was **read first**, before any code was
      written (Section 1.5) — confirmed no duplicate/partial auth
      implementation was missed.
- [x] `student-panel/Agent.md` and root `Brain.md` were **read first**
      as well, for stack/pattern consistency.
- [x] After implementation: `admin-panel/Agent.md` fully re-synced (not
      just appended to) to reflect the whole current state of that
      folder.
- [x] After implementation: `student-panel/Agent.md` fully re-synced too,
      even though this feature lives in the admin panel — both files
      must stay current with each other.
- [x] `Brain.md` updated: Feature Status row → `Done`, new endpoints +
      `Admin` data model appended, changelog entry added.
- [x] Task is **not considered complete** until all three files above
      reflect the real, current, whole-project state — not only this
      feature's changes.
