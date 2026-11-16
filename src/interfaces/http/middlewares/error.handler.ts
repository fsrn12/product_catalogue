import type { ErrorRequestHandler, Response } from "express";
import { ZodError } from "zod";

import { requestContext } from "#application/context/request.ctx";
import { DomainError } from "#domain/errors/domain.errors";
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  TenantIsolationError,
  UnauthorizedError,
  ValidationError,
} from "#domain/errors/domain.errors";
import { env } from "#infrastructure/config/env";
import { logger } from "#infrastructure/logging/logger";

// Why: Maps pure domain error types to HTTP status codes at the outer HTTP adapter boundary
function mapDomainErrorToStatus(err: DomainError): number {
  if (err instanceof ValidationError) return 400;
  if (err instanceof UnauthorizedError) return 401;
  if (err instanceof ForbiddenError || err instanceof TenantIsolationError) return 403;
  if (err instanceof NotFoundError) return 400;
  if (err instanceof ConflictError) return 409;
  return 422;
}

function sendZodError(res: Response, err: ZodError, correlationId?: string): void {
  logger.warn({ err, issues: err.issues }, "Request validation failed");
  res.status(400).json({
    error: {
      code: "VALIDATION_ERROR",
      message: "Invalid request payload or parameters",
      details: err.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
      correlationId,
    },
  });
}

function sendDomainError(res: Response, err: DomainError, correlationId?: string) {
  const statusCode = mapDomainErrorToStatus(err);
  const { code, message } = err;
  logger.warn({ err, code: code, statusCode }, message);
  res.status(statusCode).json({
    error: {
      code,
      message,
      ...(err.details ? { details: err.details } : {}),
      correlationId,
    },
  });
}

function sendUnexpectedError(res: Response, err: unknown, correlationId?: string) {
  logger.error({ err }, "Unhandled unexpected server code");
  const message =
    env.NODE_ENV === "production"
      ? "An unexpected error occurred"
      : err instanceof Error
        ? err.message
        : "Unknown error";

  res.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message,
      correlationId,
    },
  });
}

export const errorHandler: ErrorRequestHandler = (err, _req, res: Response, _next) => {
  const correlationId = requestContext.get()?.correlationId;
  if (err instanceof ZodError) {
    sendZodError(res, err, correlationId);
    return;
  }

  if (err instanceof DomainError) {
    sendDomainError(res, err, correlationId);
    return;
  }

  sendUnexpectedError(res, err, correlationId);
};
