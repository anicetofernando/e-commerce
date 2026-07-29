import "server-only";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForDb = globalThis as unknown as {
  prisma?: PrismaClient;
  pgPool?: pg.Pool;
};

// The local dev database (PGlite via a TCP socket shim, see scripts/pg-server.mjs)
// only handles one connection at a time, so the pool is capped at a single client.
const pool =
  globalForDb.pgPool ??
  new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 1 });

const adapter = new PrismaPg(pool);

export const prisma = globalForDb.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForDb.prisma = prisma;
  globalForDb.pgPool = pool;
}
