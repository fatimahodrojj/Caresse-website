import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@/lib/generated/prisma/client";

/**
 * One shared Prisma client, connected to Neon through its serverless driver
 * (works in Vercel functions). DATABASE_URL is Neon's pooled connection.
 *
 * Query logging stays off: requests can contain health information, which
 * must never end up in logs (CLAUDE.md, Privacy).
 */
function createClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }
  // Local development only: reach a local Postgres through a WebSocket
  // proxy (Neon's documented local setup, see docs/admin-setup.md). Never
  // set on Vercel.
  const localProxy = process.env.NEON_LOCAL_WS_PROXY;
  if (localProxy) {
    neonConfig.wsProxy = (host, port) => `${localProxy}/v1?address=${host}:${port}`;
    neonConfig.useSecureWebSocket = false;
    neonConfig.pipelineTLS = false;
    neonConfig.pipelineConnect = false;
  }
  return new PrismaClient({ adapter: new PrismaNeon({ connectionString }) });
}

// Reuse the client across hot reloads in development.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export function getDb(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createClient();
  }
  return globalForPrisma.prisma;
}
