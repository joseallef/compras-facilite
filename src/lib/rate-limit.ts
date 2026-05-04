import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
};

export async function getClientIp(): Promise<string> {
  const forwardedFor = (await headers()).get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  return "127.0.0.1";
}

export async function consumeRateLimit(params: {
  key: string;
  limit: number;
  windowMs: number;
}): Promise<RateLimitResult> {
  const now = new Date();
  const resetAt = new Date(now.getTime() + params.windowMs);

  const rows = await prisma.$queryRaw<
    Array<{ allowed: boolean; remaining: number; reset_at: Date }>
  >`
    WITH upsert AS (
      INSERT INTO "RateLimit" ("key", "count", "resetAt", "createdAt", "updatedAt")
      VALUES (${params.key}, 1, ${resetAt}, NOW(), NOW())
      ON CONFLICT ("key") DO UPDATE
      SET
        "count" = CASE
          WHEN "RateLimit"."resetAt" < NOW() THEN 1
          ELSE "RateLimit"."count" + 1
        END,
        "resetAt" = CASE
          WHEN "RateLimit"."resetAt" < NOW() THEN ${resetAt}
          ELSE "RateLimit"."resetAt"
        END,
        "updatedAt" = NOW()
      RETURNING "count", "resetAt"
    )
    SELECT ("count" <= ${params.limit}) AS allowed,
           GREATEST(${params.limit} - "count", 0) AS remaining,
           "resetAt" AS reset_at
    FROM upsert;
  `;

  const row = rows[0];
  if (!row) {
    return { allowed: false, remaining: 0, resetAt };
  }

  return {
    allowed: row.allowed,
    remaining: row.remaining,
    resetAt: row.reset_at,
  };
}

