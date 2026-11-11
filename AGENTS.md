<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Mandatory Project Security Rules & Operating Guidelines

> **Target Project:** FreeDocForge.com  
> **Applicability:** Mandatory for all AI agents, pairing sessions, and developers on EVERY task.  
> **Master Reference:** Read and adhere strictly to `SECURITY_CHECKLIST.md` at the project root.

---

## 1. Operating Rules

### Before Starting EVERY New Task:
1. **Read the root `SECURITY_CHECKLIST.md`** file completely.
2. Review the specific security requirements relevant to the requested task (e.g., auth, routing, database, tenant isolation, or input validation).
3. Identify security risks, boundary crossings, and potential attack vectors before writing any code.
4. Follow the security checklist while writing or modifying code.
5. **Never bypass existing authentication, authorization, validation, or security controls** for convenience or temporary testing.

### During Implementation:
1. **Server-Side Validation:** Validate all untrusted inputs on the server. Never rely solely on client-side React validation.
2. **Authorization Enforcement:** Enforce authorization and role checks (`USER` vs `ADMIN`) on every sensitive server-side operation and Route Handler.
3. **Parameterized SQL Queries:** Use Prisma ORM parameterized methods exclusively. Never concatenate raw SQL strings.
4. **Zero Secret Exposure:** Never expose secrets, database URLs, JWT signing keys, or server environment variables to frontend code or client bundles.
5. **Tenant & User Isolation:** Prevent unauthorized cross-user and cross-tenant access by validating resource ownership on all mutations (`userId === session.userId`).
6. **Architecture Integrity:** Follow secure coding practices appropriate to the existing Next.js 16 + MySQL + Prisma architecture.
7. **No Security Weakening:** Do not weaken existing security configurations (e.g., do not disable `httpOnly`, do not remove `SameSite`, do not disable middleware checks).

### Before Completing EVERY Task:
1. **Security Review:** Perform a security review of all changed and created files.
2. **Vulnerability Assessment:** Verify that the changes do not introduce any new vulnerabilities (such as XSS, IDOR, SQL injection, CSRF, or sensitive data leakage).
3. **Run Verification:** Run relevant tests, builds (`npm run build`), and security checks.
4. **Report Concerns:** Report any unresolved security concerns or newly identified risk areas.
5. **Checklist Confirmation:** Confirm whether the relevant checklist requirements were satisfied.

---

## 2. Task-Specific Security Review Template

For every new feature, bug fix, or refactor, include a short security review in your final response using this structured format:

```markdown
### Security Review
- **Authentication Impact:** [Describe impact or 'None / Preserved existing JWT auth']
- **Authorization Impact:** [Describe RBAC impact or 'Enforced USER/ADMIN checks']
- **Input Validation:** [Detail server-side validation & bounds checking]
- **Database Security:** [Confirm parameterized queries via Prisma]
- **Sensitive Data Exposure:** [Confirm zero leakage in client bundles or logs]
- **Potential Security Vulnerabilities:** [Detail analysis of potential risks]
- **Tests Performed:** [Detail build, type-check, and verification steps]
```

---

## 3. Vulnerability Disclosure & Architecture Protocol

If a security vulnerability is discovered in the project:
* **Do not silently ignore it.**
* If fixing it is directly within the task scope, implement the secure pattern and verify it against `SECURITY_CHECKLIST.md`.
* If fixing it requires changing unrelated code, altering existing database schemas, or modifying fundamental application architecture, document the issue clearly, explain the risks, and request user approval before making that broader change.
