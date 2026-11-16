import pino from "pino";

import { requestContext } from "#application/context/request.ctx";
import { env } from "#infrastructure/config/env";

export const logger = pino({
  level: env.LOG_LEVEL,
  base: {
    service: "product-catalogue-api",
    env: env.NODE_ENV,
  },
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "*.password",
      "*.passwordHash",
      "*.token",
      "*.secret",
    ],
    censor: "[REDACTED]",
  },

  mixin() {
    const ctx = requestContext.get();
    if (!ctx) return {};
    return {
      correlationId: ctx.correlationId,
      ...(ctx.tenantId !== undefined && ctx.tenantId !== "" ? { tenantId: ctx.tenantId } : {}),
      ...(ctx.userId !== undefined && ctx.userId !== "" ? { userId: ctx.userId } : {}),
    };
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});
