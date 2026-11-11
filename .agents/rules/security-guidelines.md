---
description: Mandatory Project Security Guidelines and Verification Protocol for FreeDocForge.com
globs: "**/*"
always_on: true
---

# Mandatory Project Security Rules

Whenever starting a new task, adding a feature, modifying code, or refactoring:

1. **Read `SECURITY_CHECKLIST.md`:** Always read and review the root `SECURITY_CHECKLIST.md` before writing or modifying any code.
2. **Server-Side Validation:** Enforce strict validation on all input data on the server; never trust client-side data.
3. **Role & Permission Guarding:** Ensure sensitive operations are protected with role checks (`USER` or `ADMIN`) both in middleware and server handlers.
4. **Prisma Parameterized Queries:** Always use Prisma ORM parameterized methods. Never use raw unparameterized SQL strings.
5. **Zero Secret Leakage:** Never leak environment variables, JWT secrets, or database connection strings to frontend code or log files.
6. **Data Isolation:** Strictly isolate multi-tenant shop and invoice data using `userId` ownership checks.
7. **Task Security Review:** Before completing every task, perform a security review and output the required Security Review block in your response.
