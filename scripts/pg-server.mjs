import { PGlite } from "@electric-sql/pglite";
import { PGLiteSocketServer } from "@electric-sql/pglite-socket";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "..", ".pgdata");
const port = Number(process.env.PGLITE_PORT ?? 55432);

const db = new PGlite(dataDir);
await db.waitReady;

const server = new PGLiteSocketServer({ db, port, host: "127.0.0.1" });
await server.start();

console.log(`[albimaq-db] PostgreSQL (PGlite) a correr em postgresql://127.0.0.1:${port}/albimaq`);
console.log(`[albimaq-db] Dados guardados em ${dataDir}`);

const shutdown = async () => {
  console.log("\n[albimaq-db] A encerrar...");
  await server.stop();
  await db.close();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
