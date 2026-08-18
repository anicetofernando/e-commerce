import "dotenv/config";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  max: Number(process.env.PG_POOL_MAX) || 5,
});
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  const { count } = await prisma.businessQuestionnaireResponse.deleteMany({
    where: { respondentName: { in: ["Fernando Albimaq", "Cliente Teste"] } },
  });
  console.log(`Removidas ${count} respostas de teste do questionário.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
