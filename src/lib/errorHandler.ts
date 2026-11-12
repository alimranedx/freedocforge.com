import { NextResponse } from "next/server";

export interface StandardErrorResponse {
  success: false;
  error: string;
  code?: string;
  details?: any;
}

/**
 * Handles database (Prisma) and general code exceptions in a production-safe format.
 * Sanitizes internal traces in production to prevent credential and infrastructure leakage.
 */
export function handleApiError(error: any, fallbackMessage: string = "Internal Server Error"): NextResponse<StandardErrorResponse> {
  // 0. Next.js App Router Control-Flow Signals: Re-throw to allow Next.js dynamic bail-out
  if (
    error?.digest?.startsWith("NEXT_") ||
    error?.digest === "HANGING_PROMISE_REJECTION" ||
    error?.message?.includes("DYNAMIC_SERVER_USAGE")
  ) {
    throw error;
  }

  const isDev = process.env.NODE_ENV !== "production";

  // Default error message and status code
  let status = 500;
  let clientMessage = fallbackMessage;
  let errorCode = error?.code || "INTERNAL_ERROR";

  // 1. Prisma-Specific Known Request Errors
  if (error?.code) {
    switch (error.code) {
      case "P1001":
        // Can't reach database server
        status = 503;
        errorCode = "DATABASE_UNAVAILABLE";
        clientMessage = "The database service is temporarily unreachable. Please ensure MySQL is running.";
        break;

      case "P2002":
        // Unique constraint failed
        status = 409;
        errorCode = "DUPLICATE_ENTRY";
        const target = Array.isArray(error.meta?.target) ? error.meta.target.join(", ") : error.meta?.target || "field";
        clientMessage = `A record with this ${target} already exists. Please use a unique value.`;
        break;

      case "P2025":
        // Record to update/delete not found
        status = 404;
        errorCode = "RECORD_NOT_FOUND";
        clientMessage = "The requested resource could not be found or has already been deleted.";
        break;

      case "P2003":
        // Foreign key constraint failed
        status = 400;
        errorCode = "FOREIGN_KEY_VIOLATION";
        clientMessage = "The requested operation violates data integrity constraints.";
        break;

      default:
        if (error.name?.includes("PrismaClientInitializationError")) {
          status = 503;
          errorCode = "DATABASE_INITIALIZATION_ERROR";
          clientMessage = "Database initialization error. Please check your MySQL database connection.";
        }
        break;
    }
  } else if (error?.name === "ValidationError" || error?.status === 400) {
    status = 400;
    errorCode = "VALIDATION_ERROR";
    clientMessage = error.message || "Invalid request payload.";
  } else if (error?.status === 401 || error?.name === "UnauthorizedError") {
    status = 401;
    errorCode = "UNAUTHORIZED";
    clientMessage = error.message || "Authentication required.";
  } else if (error?.status === 403) {
    status = 403;
    errorCode = "FORBIDDEN";
    clientMessage = error.message || "Access forbidden. Insufficient permissions.";
  } else if (error?.message && !isDev) {
    // In production, preserve clean business error messages, avoid raw stack traces
    if (!error.message.includes("prisma") && !error.message.includes("mysql") && !error.message.includes("at ")) {
      clientMessage = error.message;
    }
  } else if (error?.message && isDev) {
    clientMessage = error.message;
  }

  // Structured logging for operations
  console.error(`[API Error] [${errorCode}] (HTTP ${status}):`, error);

  const responseBody: StandardErrorResponse = {
    success: false,
    error: clientMessage,
    code: errorCode,
    ...(isDev && error?.stack ? { details: error.stack } : {}),
  };

  return NextResponse.json(responseBody, { status });
}
