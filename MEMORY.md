# FreeDocForge.com - Project Memory & Continuity Handoff

> **Last Updated:** November 12, 2026 (19:58:00 +06:00)  
> **Active Git Branch:** `dev` (`origin/dev`)  
> **Status:** Production-Grade, All 64 routes verified with `npm run build` (Exit code 0).  
> **Mandatory Agent Guideline:** Every AI agent, pairing session, or developer MUST read this file upon starting any task.

---

## 1. Project Overview & Architecture
* **Framework:** Next.js 16.4.6 (App Router + Turbopack), React 19, TypeScript.
* **Database & ORM:** MySQL with Prisma ORM 6.4.1 (`prisma/schema.prisma`).
* **Styling & Print Engine:** Tailwind CSS, `@media print` with `-webkit-print-color-adjust: exact !important;` and `break-inside: avoid;`.
* **Primary Target Audiences:**
  1. **Shopkeepers & F-Commerce:** Invoices, Cash Memos, Delivery Chalans, Quotations, Restaurant POS slips (80mm).
  2. **School Teachers & Institutes:** Academic Marksheets (GPA 5.00), Exam Schedules, Admit Cards (35x45mm photo), Testimonial/Certificates.
  3. **Healthcare & Clinics:** Doctor Rx Prescription Pads (BMDC seal), Patient Serial Tokens, Diagnostic Center Test Bills / Money Receipts, Discharge Summaries.

---

## 2. Where We Stopped (Completed Work)

### A. Template Routing & Diagnostic Bill Bug Fix
* **Resolved Issue:** `http://localhost:3000/templates/medical-money-receipt` previously rendered a clinical prescription pad for "Dr. Farhana Yasmin".
* **Solution:** Updated `src/app/templates/[slug]/page.tsx` to route `medical-money-receipt` to `InvoiceEditor.tsx` with dedicated `isMedicalReceipt` mode. The editor displays diagnostic pathology tests, referred doctor, sample collection time, report delivery time, advance/due breakdown, and cashier seal.

### B. Dynamic Gallery Previews (Zero Dummy Data)
* **File:** `src/components/TemplateCardPreview.tsx`
* **Solution:** Rewrote `renderVisualSnapshot()` to read live `template.defaultData`. Logistics chalans display export cartons and packing tape, exam marksheets show GPA scores, and restaurant bills display culinary items.

### C. Aesthetic PDF Overhaul (300+ Template Benchmarking)
* **Design Themes Token System:** `src/lib/designThemes.ts` & `src/components/ThemeSelectorBar.tsx`.
* **6 Curated Design Archetypes:**
  1. `modern-blue`: Deep Navy + Electric Cobalt + Ice Blue Bento containers.
  2. `luxury-gold`: Warm Ivory + Burnished Gold filigree rules + Editorial Serif.
  3. `thermal-pos`: Dot-matrix monospace with dashed tear-off rules (80mm).
  4. `royal-academic`: Imperial Oxford Navy + double engraved frame + crest watermark.
  5. `clinical-teal`: Surgical Teal + BMDC doctor stamp + 2-column clinical history.
  6. `cyber-slate`: Stealth Graphite + Cyan Neon + Barcode warranty seal.
* **Micro-Typography & Precision:** Wide-tracked uppercase micro-labels (`text-[10px] tracking-wider uppercase font-bold`), accounting-grade tabular numerals (`font-mono tabular-nums`), and high-contrast due callout pills.

### D. Multi-Auth & Document Persistence Merged
* **Unified Commit:** `a6b44aa` merged remote authentication (`/api/auth/callback/google`, `/api/auth/login`, `/api/auth/register`) with document persistence (`/api/user/documents`, `/api/user/documents/[id]`).
* **Social Sharing:** 1-click WhatsApp share with pre-formatted bill details and direct JPG export via `html2canvas`.
* **Prisma Schema Updated:** `User` (googleId, phone, avatarUrl) and `SavedDocument` (templateSlug, templateTitle, recipientName, amountOrDetails, status).

---

## 3. Where You Should Start Next (Actionable Roadmap)

When resuming development, proceed with the following high-priority features:

### Priority 1: Direct 1-Click Vector PDF Export
* **Current Behavior:** Uses browser `window.print()` dialog.
* **Next Step:** Implement a true 1-click direct vector PDF download button (using `@react-pdf/renderer` or `jspdf` vector canvas) in `InvoiceEditor`, `SchoolTemplateEditor`, and `MedicalPrescriptionEditor` so mobile users can download PDFs without dealing with print dialogs.

### Priority 2: Offline-First PWA Sync (IndexedDB / Dexie)
* **Current Behavior:** Documents are saved to `localStorage` and sent to `/api/user/documents`.
* **Next Step:** Introduce IndexedDB storage (via Dexie or `idb`) so rural shopkeepers and coaching centers with intermittent internet can continue creating documents offline, automatically syncing to the MySQL cloud database when online.

### Priority 3: Admin Template Studio (Dynamic Management)
* **Current Behavior:** Templates are defined in code (`src/lib/templates.ts`).
* **Next Step:** Enhance `/admin/templates` with a visual JSON/schema editor allowing administrators to create new templates, modify fields, and reorder categories directly from the database without redeploying code.

### Priority 4: Dynamic OpenGraph Template Previews (`@vercel/og`)
* **Next Step:** Build dynamic social preview card generator at `/api/og/template?slug=...` so sharing any template on Facebook, WhatsApp, or Twitter displays an eye-catching rendered snapshot of that exact template.

---

## 4. Key Files Directory & Reference

| File Path | Description |
|---|---|
| `MEMORY.md` | **This file** - Primary project state and handoff context. |
| `AGENTS.md` & `GEMINI.md` | Mandatory operating and security guidelines. |
| `SECURITY_CHECKLIST.md` | Security and RBAC audit checklist. |
| `src/lib/templates.ts` | Master list of all 30 templates (`INITIAL_TEMPLATES`). |
| `src/app/templates/[slug]/page.tsx` | Route dispatcher for template editors. |
| `src/components/InvoiceEditor.tsx` | Editor for invoices, cash memos, chalans, and diagnostic money receipts. |
| `src/components/SchoolTemplateEditor.tsx` | Editor for academic results, routines, admit cards, and certificates. |
| `src/components/MedicalPrescriptionEditor.tsx` | Editor for clinical prescriptions, tokens, and discharge summaries. |
| `src/lib/designThemes.ts` | 6 design theme token definitions. |
| `src/components/ThemeSelectorBar.tsx` | 1-click visual theme switcher component. |
| `src/components/TemplateCardPreview.tsx` | Dynamic visual snapshot renderer for template cards. |
| `prisma/schema.prisma` | Database schema for users, profiles, and saved documents. |

---

## 5. Verification Commands
Before concluding any future turn, always run:
```bash
# 1. Type Check
npx tsc --noEmit

# 2. Production Build
npm run build
```
