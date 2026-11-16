import process from "node:process";

import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  HOST: z.string().min(1).default("localhost"),
  PORT: z.coerce.number().int().positive().default(3000),
  MONGO_URI: z.string().min(1, "MONGO_URI is required"),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default("debug"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  // Pino not available yet, so console.log is intentional here
  //oxlint-disable-next-line no-console
  console.error("❌ Invalid environment variable: ", z.treeifyError(parsed.error));
  process.exit(1);
}

export const env = parsed.data;
