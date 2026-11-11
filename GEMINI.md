# Project Instructions & Mandatory Security Guidelines

> **Project:** FreeDocForge.com  
> **Master Security Reference:** `SECURITY_CHECKLIST.md` (located in the project root)

## Mandatory Security Rules for All Tasks

Before starting EVERY new task:
1. **Read `SECURITY_CHECKLIST.md`:** Review the security requirements relevant to the requested task.
2. **Review Risks:** Identify security risks, boundary crossings, and potential attack vectors before writing code.
3. **Checklist Compliance:** Adhere strictly to the security checklist while implementing or refactoring.
4. **Never Bypass Controls:** Never bypass existing authentication, authorization, validation, or security controls.

During implementation:
1. **Server Validation:** Validate all untrusted inputs on the server.
2. **Authorization Enforcement:** Enforce authorization and role checks (`USER` vs `ADMIN`) on every sensitive server-side operation.
3. **Parameterized SQL Queries:** Use Prisma ORM parameterized methods exclusively. Never concatenate raw SQL strings.
4. **Zero Secret Exposure:** Never expose secrets, database URLs, JWT signing keys, or server environment variables to frontend code or client bundles.
5. **Tenant Isolation:** Prevent unauthorized cross-user and cross-tenant access (`userId === session.userId`).
6. **No Weakening:** Do not weaken existing security configurations.

Before completing EVERY task:
1. **Security Review:** Perform a security review of all changed and created files.
2. **Vulnerability Assessment:** Verify that changes do not introduce new vulnerabilities.
3. **Run Verification:** Run tests, builds (`npm run build`), and security checks.
4. **Report Concerns:** Report any unresolved security concerns.
5. **Checklist Confirmation:** Confirm whether relevant checklist requirements were satisfied.

Include a short Security Review summary in the final response for every task:
- Authentication impact
- Authorization impact
- Input validation
- Database security
- Sensitive data exposure
- Potential security vulnerabilities
- Tests performed
