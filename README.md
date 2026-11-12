# FreeDocForge.com 📄✨
> **Free Printable & Smart Document Studio**  
> Generate, customize, and print high-quality cash memos, invoices, school marksheets, prescriptions, and planners in seconds with dual-language support (English & বাংলা) and voice typing.

---

## 🚀 Key Features

- **Instant Pixel-Perfect Printable Studio:** A4 & POS 80mm thermal receipt formats ready for instant direct print or PDF download.
- **Dual-Locale Template Engine (English & বাংলা):** Fully separate website UI language from printed document language.
- **Voice Typing Auto-Fill (Web Speech API):** Speak details in Bengali (`bn-BD`) or English (`en-US`) to auto-fill fields, with intelligent Bengali digit & number word parsing.
- **Dark Mode & Light Mode:** 100% responsive modern design with theme persistence.
- **AdSense Monetization Architecture:** Ready-to-monetize ad slots with complete review-mode gating via environment variables.
- **Role-Based Authentication (RBAC):** JWT session cookies (`jose`), password hashing (`bcryptjs`), and protected user & admin dashboards.
- **Template Management CMS:** Admin panel for managing and publishing templates with mandatory bilingual support.
- **Permanent Security Hardening:** Comprehensive security checklist covering OWASP Top 10, IDOR prevention, SQL injection prevention (Prisma), CSP, and RBAC.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16.4.6 (App Router, Turbopack)
- **UI Library:** React 19.3.0
- **Styling:** Tailwind CSS v4, Lucide Icons
- **Database & ORM:** MySQL with Prisma ORM 6.4.1
- **Auth & Crypto:** `jose` JWT, `bcryptjs`
- **Speech Engine:** Web Speech API (`webkitSpeechRecognition`)

---

## 📦 Getting Started

### 1. Prerequisites
- **Node.js:** 18.x or 20.x+
- **MySQL Database Server:** Local (Laragon, XAMPP, Docker, or native MySQL 8.0+) or remote (cPanel, Cloud MySQL).

### 2. Installation
```bash
git clone https://github.com/alimranedx/freedocforge.com.git
cd freedocforge.com
npm install
```

### 3. Environment & Database Configuration

1. **Copy the environment template:**
   ```bash
   cp .env.example .env
   ```
   *(On Windows PowerShell: `Copy-Item .env.example .env`)*

2. **Configure `DATABASE_URL` in `.env`:**
   The connection URL follows the standard format:
   `mysql://<USERNAME>:<PASSWORD>@<HOST>:<PORT>/<DATABASE_NAME>`

   * **Laragon (Default: user `root`, no password):**
     ```env
     DATABASE_URL="mysql://root:@localhost:3306/freedocforge_db"
     ```
   * **XAMPP (Default: user `root`, no password):**
     ```env
     DATABASE_URL="mysql://root:@localhost:3306/freedocforge_db"
     ```
   * **Local MySQL with password:**
     ```env
     DATABASE_URL="mysql://root:yourpassword@localhost:3306/freedocforge_db"
     ```

3. **Start your MySQL server:**
   * In Laragon / XAMPP: Click **Start All** or start the MySQL service.
   * If running as a Windows service: Ensure `MySQL` service is active in Task Manager or Services.

4. **Initialize the Database & Tables:**
   Run Prisma's schema push command:
   ```bash
   npx prisma db push
   ```
   *Prisma will automatically connect to MySQL, create the `freedocforge_db` database if it does not exist, and generate all required tables (`User`, `OrganizationProfile`, `SavedDocument`, `Template`, `AdminSetting`).*

5. **Generate the Prisma Client:**
   ```bash
   npx prisma generate
   ```

6. *(Optional)* **Inspect Database Records via GUI:**
   ```bash
   npx prisma studio
   ```
   This opens a visual browser interface at `http://localhost:5555` to view and manage database tables.

---

### 4. Running the Development Server

```bash
npm run dev
# or watch mode
npm run watch
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### 5. Authentication & First-Time Setup

* **User Accounts:** Users can sign up directly at `/register` and log in at `/login`. Passwords are encrypted with `bcryptjs` and session tokens are stored in secure, `HttpOnly` JWT cookies.
* **Admin Accounts:**
  1. Set a strong secret key in `.env` for `ADMIN_PROVISION_KEY`:
     ```env
     ADMIN_PROVISION_KEY="your-strong-provision-secret"
     ```
  2. Navigate to `/admin/register` (or send a POST to `/api/auth/admin-register`) providing your name, email, password, and the `ADMIN_PROVISION_KEY`.
  3. Log in at `/admin/login` to access the admin dashboard (`/admin/dashboard`).

---

### 6. Production Build

```bash
npm run build
npm start
```

---

## 🔒 Security Guidelines
Please refer to [SECURITY_CHECKLIST.md](SECURITY_CHECKLIST.md) and [AGENTS.md](AGENTS.md) for permanent project security policies, coding standards, and verification guidelines.

---

## 📄 License
This project is proprietary and developed for FreeDocForge.com.
