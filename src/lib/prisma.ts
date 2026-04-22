import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import pg from "pg";

const connectionString = `${process.env.DATABASE_URL}`;

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const createPrismaClient = () => {
  const pool = new pg.Pool({
    connectionString,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
};

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
