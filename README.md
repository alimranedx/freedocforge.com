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
- Node.js 18+ or 20+
- MySQL Database (Local, cPanel, or Cloud)

### 2. Installation
```bash
git clone https://github.com/alimranedx/freedocforge.com.git
cd freedocforge.com
npm install
```

### 3. Environment Setup
Copy the example environment file and configure your credentials:
```bash
cp .env.example .env
```

Generate Prisma client:
```bash
npx prisma generate
```

### 4. Running the Development Server
```bash
npm run dev
# or watch mode
npm run watch
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build
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
