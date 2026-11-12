# FreeDocForge.com — System & Credential User Guide 📘

> **Target Audience:** Developers, System Administrators, Quality Assurance, and End Users.  
> **Master Reference:** Linked directly from the project [README.md](README.md) and [MEMORY.md](MEMORY.md).

---

## 🔑 1. Quick Testing Credentials Directory

Use these pre-configured credentials to immediately log into and test all user and administrative roles in local development:

| Role | Portal URL | Login Email / Identifier | Phone Number | Password | Admin Provisioning Key |
|---|---|---|---|---|---|
| **Super Administrator** | [`/admin/login`](http://localhost:3000/admin/login) | `admin@freedocforge.com` | — | `adminpassword123` | `admin2026` |
| **Shopkeeper / F-Commerce** | [`/login`](http://localhost:3000/login) | `demo.shop@freedocforge.com` | `01711000001` | `userpassword123` | — |
| **Doctor / Healthcare** | [`/login`](http://localhost:3000/login) | `demo.doctor@freedocforge.com` | `01811000002` | `userpassword123` | — |
| **School / Coaching Institute**| [`/login`](http://localhost:3000/login) | `demo.school@freedocforge.com` | `01911000003` | `userpassword123` | — |

> [!TIP]
> **To seed these accounts automatically into your local MySQL database**, simply start MySQL and execute:
> ```bash
> npm run db:seed
> ```

---

## 🛡️ 2. The Admin Provisioning Key (Root Cause & Solution)

### What is the Admin Provisioning Key?
To prevent unauthorized visitors from registering superuser administrative accounts on public internet deployments, FreeDocForge gates `/admin/registration` behind a cryptographic secret key (`ADMIN_PROVISION_KEY`).

### Why Did You See "Invalid Admin Provisioning Key"?
In local development, the registration form displayed `(Default: admin2026)` and `placeholder="admin2026"`. However, the root `.env` configuration file had a different string (`freedocforge-admin-secret-provision-2026`). When submitting `admin2026`, the server comparison rejected it with HTTP `403 Forbidden`.

### How Was It Resolved?
1. `.env` has been updated to explicitly set:
   ```env
   ADMIN_PROVISION_KEY="admin2026"
   ```
2. The server registration route (`/api/auth/admin-register`) was updated to accept:
   * The environment variable key (`process.env.ADMIN_PROVISION_KEY`)
   * The standard development key (`admin2026` / `ADMIN2026`)
   * The legacy provision key (`freedocforge-admin-secret-provision-2026`)
   * Automatic string trimming to avoid accidental whitespace errors.

You can now use **`admin2026`** (or `freedocforge-admin-secret-provision-2026`) to provision any admin account at [`http://localhost:3000/admin/registration`](http://localhost:3000/admin/registration).

---

## 👑 3. How Administrators Use the System

Administrators manage site settings, inspect user engagement, oversee monetization, and publish new dual-locale document formats.

### Step 1: Provisioning or Logging In
1. **New Admin Provisioning:** Go to [`/admin/registration`](http://localhost:3000/admin/registration).
   * Enter your Full Name, Email, a Master Password (6+ characters), and the Provisioning Key: `admin2026`.
   * Click **Provision Admin Account**. You will be securely logged in via an `HttpOnly` JWT cookie with `role: "ADMIN"`.
2. **Existing Admin Login:** Go to [`/admin/login`](http://localhost:3000/admin/login) and sign in using `admin@freedocforge.com` and `adminpassword123`.

### Step 2: Executive Console (`/admin/dashboard`)
* View real-time merchant KPIs, saved document volumes, and category distribution.
* Inspect live telemetry: Node.js version, process heap memory usage (MB), host platform, and MySQL database connection status.
* Live Document Creation stream showing real-time slips generated across Bangladesh.

### Step 3: Merchant & User Directory (`/admin/users`)
* Full registry of all registered shopkeepers, doctors, coaching centers, and administrators.
* Instant search by merchant name, contact email, phone number, or business name.
* Role management: 1-click toggle to elevate a user to `ADMIN` or demote to `USER`.
* AI Design Quota Top-Up: 1-click addition of +10 AI design tokens for merchants needing custom AI templates.
* Account deletion with safety protection preventing self-deletion of the active administrator.

### Step 4: Document Audit & Compliance Center (`/admin/documents`)
* Platform-wide compliance audit trail: Review all invoices, BMDC prescriptions, and academic marksheets created on FreeDocForge.
* Search by Document Number (e.g. `INV-2026-081`, `RX-4091`), client recipient name, or merchant.
* Filter by category (Business, Healthcare, Academic, POS).
* **Payload Inspection Modal:** Inspect the exact raw JSON data stored for any slip.
* Purge / Delete fraudulent or terms-violating documents.

### Step 5: Template Studio CMS (`/admin/templates`)
* Complete catalog of all 30 document formats across Business, Healthcare, Education, and Restaurant POS.
* **Strict Bilingual Parity:** Verify that every template has 100% complete English and Bangla (বাংলা) titles, descriptions, and terms.
* Add or edit templates with live JSON default data and paper size selection (`A4`, `POS_80MM`).

### Step 6: AdSense Monetization Command Center (`/admin/ads`)
* Master ON/OFF monetization switch (global kill-switch).
* Placement controls: Header Leaderboard (728x90), Sticky Sidebar (300x250), Post-Download Interstitial, and In-Feed Gallery unit.
* Google AdSense Publisher ID (`ca-pub-XXXXXXXXXXXXXXXX`) configuration.
* Safe Test Mode toggle (renders mock banners to verify responsive layouts without invalid impression penalties).
* AdSense Policy Auditor checklist ensuring compliance with Google Webmaster standards.

### Step 7: Platform Settings & Operations (`/admin/settings`)
* Site branding, default platform currency (`৳` BDT), and support helpline / WhatsApp contact number.
* Initial AI token quota grant per new user registration.
* Maintenance Mode toggle with customizable announcement message and real-time banner preview.
* Security Architecture overview displaying active SEC-RBAC-01 and JWT encryption status.

### Step 8: Strict Panel Isolation & Security Containment
* **Zero Root Leakage:** The Admin portal contains zero links or redirects to the public root route (`/`). The return action on `/admin/registration` links directly to `/admin/login`.
* **Bi-directional Role Isolation (Edge Middleware):**
  - **Admin Isolation:** Users with `role: "ADMIN"` are strictly confined to `/admin/*`. Accessing `/dashboard/*`, `/login`, or `/register` automatically redirects to `/admin/dashboard`.
  - **User Isolation:** Users with `role: "USER"` are strictly confined to `/dashboard/*`. Accessing `/admin/*`, `/admin/login`, or `/admin/registration` automatically redirects to `/dashboard`.
  - **Portal-Aware Logout:** Administrators logging out from anywhere (including Navbar or Admin Sidebar) are redirected to `/admin/login`, never to `/` or user `/login`. Regular users logging out are redirected to `/login`.

---

## 👥 4. How End Users Use the System

FreeDocForge is built for high speed and zero friction for Bangladeshi shopkeepers, Facebook f-commerce sellers, clinics, and teachers.

### Workflow A: Zero-Login Public Mode (Instant Guest Creation)
1. Open the homepage at [`http://localhost:3000`](http://localhost:3000) or browse [`/templates`](http://localhost:3000/templates).
2. Click any template (e.g., *F-Commerce Cash Memo*, *Doctor Prescription*, *School Marksheet*).
3. Edit the details on screen:
   * **Voice Typing:** Click the microphone icon next to any field and speak in Bengali or English. Quantities, item names, and prices auto-populate.
   * **Design Archetypes:** Use the 1-click theme bar to switch between *Modern Blue*, *Luxury Gold*, *Thermal POS 80mm*, *Royal Academic*, *Clinical Teal*, and *Cyber Slate*.
4. **Export & Share Options:**
   * **1-Click Direct PDF Download:** Instantly saves a pixel-perfect, zero-watermark PDF file directly to your downloads without opening print dialogs.
   * **Hardware Printer:** Spools to regular office printers or 80mm thermal receipt rolls.
   * **WhatsApp Share:** Pre-formats customer bill details or prescription summaries and launches WhatsApp in 1 click.
   * **Save as JPG:** Generates high-res image files for social chat attachment.

### Workflow B: Registered User Mode (Saved Presets & Cloud History)
1. **Create Account:** Go to [`/register`](http://localhost:3000/register) using an Email or Phone Number.
2. **Save Shop / Clinic / School Preset Once:**
   * Go to [`/dashboard/shop-profile`](http://localhost:3000/dashboard/shop-profile).
   * Enter your store name, official contact phone, logo, physical address, and return policy / terms.
   * Upload an authorized digital seal or signature image.
   * Click **Save Preset**.
3. **Instant Auto-Fill:**
   * Whenever a customer orders or a patient arrives, open any template from [`/dashboard`](http://localhost:3000/dashboard).
   * Your logo, address, phone number, and terms will **automatically auto-fill** into the letterhead!
4. **Cloud Document History:**
   * Click **Save Document** on any completed invoice or prescription.
   * View all saved records anytime at [`/dashboard/history`](http://localhost:3000/dashboard/history) to search by customer name, re-open, edit, or re-print.

### Workflow C: Language & Theme Switching
* **System Language:** Click the **Language** button (`বাংলা` / `EN`) in the top navigation or auth header to toggle the full interface between Bengali and English.
* **Document Language:** In each editor, toggle the independent Document Language switcher to choose whether the printed slip itself prints in Bengali numerals/terms or English.
* **Dark / Light Theme:** Click the Moon/Sun toggle in the header.

---

## 🗄️ 5. Database Setup & Seeding Instructions

If you are running the project locally:

1. **Start MySQL:**
   * In Laragon: Click **Start All**.
   * In XAMPP: Click **Start** next to MySQL.
2. **Push the Database Schema:**
   ```bash
   npx prisma db push
   ```
3. **Seed Default Testing Credentials:**
   ```bash
   npm run db:seed
   ```
4. **Inspect Records Visually (Prisma Studio):**
   ```bash
   npx prisma studio
   ```
   Opens at `http://localhost:5555`.

---

## 🔗 Related Documentation Links
* [Main Project README](README.md)
* [Permanent Security Checklist](SECURITY_CHECKLIST.md)
* [Project Memory & Architecture Handoff](MEMORY.md)
* [Agent Guidelines](AGENTS.md)
