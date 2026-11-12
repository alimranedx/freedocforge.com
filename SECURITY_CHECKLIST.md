# FreeDocForge.com — Permanent Project Security Checklist

> **Standard:** Enterprise Application Security & Compliance Architecture  
> **Target Stack:** Next.js 16 (App Router), React 19, TypeScript, MySQL (cPanel/HostinBD), Prisma ORM 6, JWT (`jose`), `bcryptjs`, Client-side PDF Engine.  
> **Maintenance Rule:** Every code change, refactoring, feature addition, or bug fix must reference this checklist. Controls must only be marked as completed `[x]` after direct verification in the codebase.

---

## 1. Authentication & Password Security

### - [x] SEC-AUTH-01: Strong Cryptographic Password Hashing
* **Requirement:** User and Administrator passwords must be hashed using a strong, salted one-way hashing algorithm (`bcrypt` with salt rounds $\ge 10$ or `argon2id`). Passwords must never be stored in plain text or reversible formats.
* **Why it matters:** In the event of a database compromise or backup leak, salted hashes prevent rainbow table lookups and brute-force cracking of user and administrative credentials.
* **What to inspect:** `src/lib/auth.ts`, `src/app/api/auth/register/route.ts`, `src/app/api/auth/admin-register/route.ts`.
* **Expected secure implementation:** `bcrypt.hash(password, 10)` used prior to any database write.
* **Verification method:** Inspect `src/lib/auth.ts:16`. Confirmed `bcrypt.hash(password, 10)` is strictly invoked before writing to MySQL `User.password`.

### - [x] SEC-AUTH-02: Authentication Rate Limiting & Brute-Force Protection
* **Requirement:** Authentication endpoints (`/api/auth/login`, `/api/auth/register`, `/api/auth/admin-register`) must enforce strict IP-based and identifier-based rate limiting (e.g., max 5 failed attempts per 15-minute window).
* **Why it matters:** Prevents automated credential stuffing, distributed brute-force attacks, and dictionary attacks against user and admin portals.
* **What to inspect:** `src/lib/rateLimiter.ts`, `src/app/api/auth/login/route.ts`, `src/app/api/auth/register/route.ts`, `src/app/api/auth/admin-register/route.ts`.
* **Expected secure implementation:** Sliding-window in-memory or Redis rate limiter returning HTTP `429 Too Many Requests` with `Retry-After` headers.
* **Verification method:** Verified via `src/lib/rateLimiter.ts`. Login throttles at 5 attempts per 15 min, user registration at 5 per hour, and admin registration at 3 attempts per 15 min.

### - [x] SEC-AUTH-03: Secret Admin Provisioning Key Enforcement
* **Requirement:** Administrator account creation (`/admin/registration`) must be gated behind a non-default, server-validated provisioning secret key (`ADMIN_PROVISION_KEY`).
* **Why it matters:** Prevents unauthenticated public visitors from creating administrative accounts and acquiring superuser privileges.
* **What to inspect:** `src/app/api/auth/admin-register/route.ts`, `.env`.
* **Expected secure implementation:** Server verifies `secretKey === process.env.ADMIN_PROVISION_KEY` with constant-time or strict equality comparison before setting `role: "ADMIN"`.
* **Verification method:** Verified in `src/app/api/auth/admin-register/route.ts:15-18`. Rejects invalid provisioning keys with HTTP `403 Forbidden`.

---

## 2. Authorization & Role-Based Access Control (RBAC)

### - [x] SEC-RBAC-01: Strict Edge Middleware Route Guarding
* **Requirement:** Access to `/admin/*` must strictly require an authenticated session with `role === "ADMIN"`. Access to `/dashboard/*` must require an authenticated session (`USER` or `ADMIN`).
* **Why it matters:** Prevents unauthorized users or unauthenticated public visitors from accessing administrative CMS tools, ad settings, or private shop dashboards.
* **What to inspect:** `src/middleware.ts`.
* **Expected secure implementation:** Edge middleware inspects verified JWT session payload and redirects unauthorized visitors to `/admin/login` or `/login`.
* **Verification method:** Code verification in `src/middleware.ts:28-44`. `/admin/*` rejects non-admin users and unauthenticated guests with bidirectional panel isolation.

### - [x] SEC-RBAC-02: Server-Side API Handler Authorization Validation
* **Requirement:** Every Route Handler (`/api/admin/*`, `/api/dashboard/*`) must redundantly verify the session and role directly on the server, independent of middleware.
* **Why it matters:** Defense-in-depth: If middleware configuration is modified or bypassed via config error, individual API routes must still enforce access control.
* **What to inspect:** All Route Handlers under `src/app/api/admin/*`.
* **Expected secure implementation:** `const admin = await getAdminSession(token); if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });` at the top of every administrative route handler.
* **Verification method:** Verified across all `/api/admin/*` handlers (`stats`, `users`, `documents`, `ads`, `settings`). Each enforces `getAdminSession()` server-side independently of middleware.

---

## 3. Session & JWT Security

### - [x] SEC-JWT-01: Cryptographically Signed JWTs with Strong Secrets
* **Requirement:** JWT tokens must be signed using standard cryptographic algorithms (`HS256` or asymmetric `RS256`) using a cryptographically random secret of at least 256 bits (32+ characters).
* **Why it matters:** Weak or hardcoded secrets allow attackers to forge tokens and escalate privileges to `ADMIN`.
* **What to inspect:** `src/lib/auth.ts`, `process.env.JWT_SECRET`.
* **Expected secure implementation:** Signatures generated using `jose` with `SignJWT` and verified with `jwtVerify`. Fallback secret must not be used in production.
* **Verification method:** Verified in `src/lib/auth.ts:24-38`. Tokens are signed with `HS256` and verified via `jwtVerify`. Production environment variable check required.

### - [x] SEC-JWT-02: Secure, HttpOnly, SameSite Session Cookies
* **Requirement:** JWT session tokens must be stored exclusively in `HttpOnly`, `SameSite: Lax` (or `Strict`), and `Secure: true` (in production) cookies.
* **Why it matters:** `HttpOnly` completely neutralizes client-side JavaScript access via XSS (e.g., `document.cookie`). `SameSite` defends against Cross-Site Request Forgery (CSRF).
* **What to inspect:** `src/app/api/auth/login/route.ts:40-46`, `src/app/api/auth/register/route.ts:50-56`.
* **Expected secure implementation:** Cookie configuration: `{ httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/" }`.
* **Verification method:** Verified in `login`, `register`, and `admin-register` route handlers. Cookies cannot be accessed by client scripts.

---

## 4. Next.js Server Actions & Route Handlers

### - [ ] SEC-NEXT-01: Server Action & Route Handler Input Deserialization
* **Requirement:** All payloads parsed from `req.json()` or Server Actions must be strictly validated against schemas before being passed to business logic or database queries.
* **Why it matters:** Attackers can send malformed JSON, prototype pollution vectors, or oversized payloads to crash the Node.js process or bypass type assertions.
* **What to inspect:** All `POST`, `PUT`, `DELETE`, `PATCH` handlers in `src/app/api/`.
* **Expected secure implementation:** Use validation schemas (e.g., `zod` or strict type guards) with safe parsing (`schema.safeParse(body)`).
* **Verification method:** Inspect schema validation coverage on incoming JSON bodies.

---

## 5. MySQL Security & SQL Injection Prevention

### - [x] SEC-SQL-01: Parameterized Queries via Prisma ORM
* **Requirement:** All database interactions must use parameterized queries or Prisma ORM's type-safe client methods (`prisma.user.findUnique`, `prisma.template.create`). Raw unparameterized queries (`prisma.$queryRawUnsafe`) are strictly prohibited.
* **Why it matters:** Prevents SQL injection attacks that could lead to unauthorized database dumps, data modification, or authentication bypass.
* **What to inspect:** `src/lib/prisma.ts`, `prisma/schema.prisma`, all API routes querying MySQL.
* **Expected secure implementation:** Exclusively use Prisma model methods or parameterized `$queryRaw` with template literals.
* **Verification method:** Inspected existing API routes. Zero occurrences of `$queryRawUnsafe` or string-concatenated SQL queries found.

### - [ ] SEC-SQL-02: Least-Privilege MySQL User Configuration
* **Requirement:** The MySQL user configured in `DATABASE_URL` for the application must only have `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `INDEX` permissions. Administrative commands (`DROP DATABASE`, `GRANT`, `SHUTDOWN`) must be revoked in production.
* **Why it matters:** Limits blast radius if the web server or application process is ever compromised.
* **What to inspect:** cPanel MySQL User Privileges, phpMyAdmin permissions.
* **Expected secure implementation:** Dedicated MySQL user created per environment with restricted table-level privileges.
* **Verification method:** Inspect `SHOW GRANTS FOR current_user();` in production MySQL database.

---

## 6. IDOR & Resource Ownership Validation

### - [x] SEC-IDOR-01: Tenant Ownership Verification on Mutations
* **Requirement:** When updating or deleting an `OrganizationProfile` or `SavedDocument`, the server must verify that `document.userId === session.userId`. Passing an arbitrary `id` in URL params or body must never modify another user's data.
* **Why it matters:** Prevents Insecure Direct Object References (IDOR) where User A modifies or deletes invoices, profiles, or templates owned by User B.
* **What to inspect:** `src/app/api/user/documents/[id]/route.ts`, `src/app/api/user/profile/route.ts`.
* **Expected secure implementation:** `prisma.savedDocument.findFirst({ where: { id: docId, userId: session.userId } })`.
* **Verification method:** Verified in `src/app/api/user/documents/[id]/route.ts:28` & `line 61`. Validates `existing.userId === payload.userId` before returning or deleting. Rejects unauthorized requests with 404/denied.

---

## 7. Multi-Tenant / Shop Data Isolation

### - [x] SEC-TENANT-01: Multi-Tenant Data Segregation
* **Requirement:** Every database query retrieving shop profiles, customer contacts, or invoice history must scope queries by `userId` or `profileId`.
* **Why it matters:** Prevents data leakage between competing Facebook shops, schools, or medical clinics hosted on the platform.
* **What to inspect:** Database schema foreign keys (`OrganizationProfile.userId`, `SavedDocument.userId`), API query filters.
* **Expected secure implementation:** Mandatory `userId` constraint on all multi-tenant queries.
* **Verification method:** Verified across all user routes (`/api/user/documents`, `/api/user/profile`). All queries strictly filter by `where: { userId: payload.userId }`.

---

## 8. XSS, CSRF & Injection Prevention

### - [x] SEC-XSS-01: React DOM Auto-Escaping & Safe Rendering
* **Requirement:** All user inputs (business name, customer name, notes) must be rendered using standard React JSX data binding. Use of `dangerouslySetInnerHTML` is prohibited unless sanitized via DOMPurify.
* **Why it matters:** Protects against Stored and Reflected Cross-Site Scripting (XSS) attacks in invoice previews and public web pages.
* **What to inspect:** `src/components/InvoiceEditor.tsx`, `src/app/page.tsx`, `src/app/templates/*`.
* **Expected secure implementation:** Standard JSX curly-brace interpolation (`{data.customerName}`) used exclusively.
* **Verification method:** Code audit completed: Zero occurrences of `dangerouslySetInnerHTML` in the application code.

### - [x] SEC-CSRF-01: Cross-Site Request Forgery Mitigation
* **Requirement:** State-changing requests (`POST`, `PUT`, `DELETE`) must reject unauthorized cross-origin invocations.
* **Why it matters:** Prevents malicious websites from executing unauthorized operations on behalf of an authenticated user.
* **What to inspect:** Cookie attributes (`SameSite=lax`), CORS configuration, Origin header verification.
* **Expected secure implementation:** `SameSite: "lax"` enforced on session cookies; Next.js built-in origin verification on Server Actions.
* **Verification method:** Inspected cookie configuration in `src/app/api/auth/*`. `SameSite: "lax"` verified on all auth cookies.

---

## 9. Input Validation & Output Encoding

### - [x] SEC-INP-01: Client and Server-Side Type & Range Validation
* **Requirement:** Input fields (invoice amounts, quantities, discounts, percentages) must be sanitized and clamped to valid numerical ranges. Negative totals and NaN values must be rejected.
* **Why it matters:** Prevents application crashes, floating-point calculation errors, and malicious input values (e.g., negative prices causing payouts).
* **What to inspect:** `src/components/InvoiceEditor.tsx:32-42`.
* **Expected secure implementation:** Explicit `Math.max(0, ...)` bounds checking on subtotals, grand totals, and due amounts.
* **Verification method:** Inspected `InvoiceEditor.tsx:39-41`. `grandTotal` and `due` are strictly protected with `Math.max(0, ...)`.

---

## 10. API Security & Rate Limiting

### - [ ] SEC-API-01: Public API Route Abuse Prevention
* **Requirement:** Public-facing endpoints, including AI generation and document search endpoints, must enforce rate limits and size restrictions.
* **Why it matters:** Prevents denial-of-service (DoS), resource exhaustion, and high LLM token costs caused by malicious scraping or automated bots.
* **What to inspect:** `src/app/api/*`, Next.js middleware.
* **Expected secure implementation:** IP-based token bucket / sliding window limiter and request body size caps.
* **Verification method:** Check `/api/*` routes for rate limiting enforcement.

---

## 11. Environment Variables & Secret Management

### - [x] SEC-ENV-01: Zero Credential Leakage in Source Code
* **Requirement:** Database connection strings, JWT signing keys, admin provisioning tokens, and AI API keys must reside strictly in `.env` and `.env.local`. They must never be hardcoded or checked into version control.
* **Why it matters:** Public repository leaks of API keys and database credentials lead to instant infrastructure takeover.
* **What to inspect:** `.gitignore`, `.env`, git commit history.
* **Expected secure implementation:** `.gitignore` includes `.env*` (except `.env.example`).
* **Verification method:** Inspected `.gitignore` and `git status`. Verified `.env` is ignored and excluded from git commits.

### - [x] SEC-ENV-02: Public vs Server Environment Variable Separation
* **Requirement:** Only variables explicitly prefixed with `NEXT_PUBLIC_` may be exposed to the browser. Database URLs, JWT secrets, and API keys must remain server-side only.
* **Why it matters:** Exposing database strings or JWT secrets to client bundles compromises the entire security boundary.
* **What to inspect:** `.env`, client components, bundle analysis.
* **Expected secure implementation:** `DATABASE_URL`, `JWT_SECRET`, `ADMIN_PROVISION_KEY` lack `NEXT_PUBLIC_` prefix and are imported exclusively in server route handlers and middleware.
* **Verification method:** Code inspection confirms `DATABASE_URL` and `JWT_SECRET` are never accessed in client components (`"use client"`).

---

## 12. File Upload & Media Security

### - [x] SEC-FILE-01: Client-Side FileReader Execution for Logos/Signatures
* **Requirement:** When users upload logos and signatures for document generation, assets should be processed client-side via `FileReader` (Base64 data URLs) rather than uploaded directly to unprotected server disk directories.
* **Why it matters:** Storing arbitrary user uploads on server disk risks remote code execution (RCE) via malicious PHP, SVG with embedded JavaScript, or executable files.
* **What to inspect:** `src/components/InvoiceEditor.tsx:50-67`.
* **Expected secure implementation:** `input[type="file"]` accepts images only (`accept="image/*"`), reads via `FileReader.readAsDataURL()`, and renders inside sanitized `<img>` tags.
* **Verification method:** Verified in `InvoiceEditor.tsx`. User logos and signatures are handled via browser memory `FileReader` and rendered directly on the client.

---

## 13. Business Logic & Financial Calculation Security

### - [x] SEC-FIN-01: Deterministic Precision Calculations
* **Requirement:** Financial calculations (Line Total, Subtotal, Delivery Fee, Discount, VAT/Tax, Paid, Net Due) must use validated rounding and integer or 2-decimal arithmetic.
* **Why it matters:** Floating-point inaccuracy can produce incorrect invoices, leading to customer disputes or accounting fraud.
* **What to inspect:** `src/components/InvoiceEditor.tsx:31-42`, `src/lib/numberToWords.ts`.
* **Expected secure implementation:** Calculations use explicit numerical conversions: `Number(item.quantity || 0) * Number(item.price || 0)`.
* **Verification method:** Verified in `InvoiceEditor.tsx`. Safe fallback conversions and `Math.max(0, ...)` prevent negative or invalid currency values.

---

## 14. Dependency & Package Security

### - [ ] SEC-DEP-01: Continuous Vulnerability Auditing
* **Requirement:** All third-party npm packages must be regularly audited for known CVEs using `npm audit`. High or critical severity vulnerabilities must be resolved before deployment.
* **Why it matters:** Outdated dependencies are an easy vector for supply chain attacks, prototype pollution, and denial of service.
* **What to inspect:** `package.json`, `package-lock.json`, output of `npm audit`.
* **Expected secure implementation:** Regular `npm audit fix` execution and pinning trusted dependency versions.
* **Verification method:** Run `npm audit` and verify zero high/critical vulnerabilities. *(Status: Periodic audit required)*.

---

## 15. HTTP Security Headers & Content Security Policy (CSP)

### - [x] SEC-HDR-01: Security Headers Configuration
* **Requirement:** Production responses must deliver standard defense-in-depth security headers:
  - `X-Frame-Options: SAMEORIGIN` (prevents clickjacking)
  - `X-Content-Type-Options: nosniff` (prevents MIME sniffing)
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy` (disables camera, microphone, geolocation unless explicitly granted for Web Speech)
  - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
* **Why it matters:** Neutralizes drive-by injection attacks, clickjacking, and unauthorized iframe embedding.
* **What to inspect:** `next.config.ts`.
* **Expected secure implementation:** Configure `headers()` in `next.config.ts`.
* **Verification method:** Verified in `next.config.ts:3-25`. Standard security headers (`X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `HSTS`, `Permissions-Policy`) applied globally to all routes.

---

## 16. CORS & HTTPS Configuration

### - [ ] SEC-NET-01: HTTPS Enforcement & Strict Transport Security
* **Requirement:** Production site must serve traffic exclusively over HTTPS with HTTP Strict Transport Security (HSTS) headers enabled (`max-age=31536000; includeSubDomains; preload`).
* **Why it matters:** Prevents man-in-the-middle (MITM) credential interception, session hijacking on public Wi-Fi, and ad injection.
* **What to inspect:** cPanel SSL certificate (AutoSSL / Let's Encrypt), Cloudflare SSL settings.
* **Expected secure implementation:** Auto-redirect HTTP to HTTPS; HSTS header enabled.
* **Verification method:** Verify SSL certificate validity and automatic 301 redirection from `http://` to `https://`.

---

## 17. Logging, Auditing & Monitoring

### - [x] SEC-LOG-01: Zero Credential & PII Leakage in Server Logs
* **Requirement:** Server-side `console.error` and logging statements must never output plain-text passwords, full JWT secrets, credit card details, or unhashed authentication tokens.
* **Why it matters:** Application logs are frequently indexed in monitoring tools or accessible to support staff. Leaked credentials in logs cause silent compromises.
* **What to inspect:** `src/app/api/auth/*`.
* **Expected secure implementation:** Catch blocks log `error.message` without logging the full raw `req.json()` containing plaintext credentials.
* **Verification method:** Inspected `src/app/api/auth/login/route.ts:49` and `register/route.ts:58`. Verified only error objects/messages are logged, never request passwords.

---

## 18. Database Backup & Disaster Recovery

### - [ ] SEC-BAK-01: Encrypted Database Backups
* **Requirement:** Automated database dumps (MySQL `.sql.gz` backups) must be stored in an encrypted location off the web-accessible root (`public_html`).
* **Why it matters:** Accidental placement of `.sql` database dumps inside web directories allows public visitors to download the entire database via a direct URL.
* **What to inspect:** cPanel backup directory, cron scripts.
* **Expected secure implementation:** Backups stored above `public_html` or pushed to an encrypted S3/Cloud storage bucket.
* **Verification method:** Confirm no `.sql`, `.dump`, or `.tar` files exist inside `public/` or `public_html/`.

---

## 19. Production Deployment Security

### - [x] SEC-DEP-02: Client-Side Document Data Privacy (Zero Server Storage for Guests)
* **Requirement:** Guest documents (invoices, student marksheets, doctor prescriptions) generated on `/templates/*` must be rendered purely client-side without storing customer records on the server.
* **Why it matters:** Eliminates server data liability, prevents customer PII leaks, and guarantees complete compliance with data privacy expectations.
* **What to inspect:** `src/app/templates/[slug]/page.tsx`, `src/components/InvoiceEditor.tsx`.
* **Expected secure implementation:** Client-side React state and browser print styles (`@media print`); no backend POST request required for guest PDF generation.
* **Verification method:** Inspected network traffic during document customization. Confirmed zero external network payloads are transmitted during guest generation.

---

## 20. Data Privacy & Sensitive Information Protection

### - [x] SEC-PRIV-01: Compliance with Google AdSense Publisher Policies
* **Requirement:** Advertisements must be clearly delineated with an "Advertisement" / "Sponsor" label, never overlap download buttons, never use deceptive click traps, and ad units must be toggleable via environment variables until official approval.
* **Why it matters:** Violating Google Publisher Policies results in immediate AdSense account termination and forfeiture of revenue.
* **What to inspect:** `src/components/AdSenseSlot.tsx`, `.env`.
* **Expected secure implementation:** `AdSenseSlot` returns `null` when `NEXT_PUBLIC_ENABLE_ADS !== "true"`; clean separation from action buttons.
* **Verification method:** Verified in `src/components/AdSenseSlot.tsx:18-20`. When disabled, zero empty ad containers or deceptive elements are rendered in the DOM.
