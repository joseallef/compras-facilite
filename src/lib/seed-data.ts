import { PrismaPg } from "@prisma/adapter-pg";
import { Category, PrismaClient } from "@prisma/client";
import { subDays, subMonths } from "date-fns";
import * as dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Iniciando seed de dados...");

  // 1. Criar ou encontrar um usuário de teste
  const user = await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: {},
    create: {
      email: "demo@example.com",
      name: "Usuário Demo",
      password: "password123", // Em produção use hash!
    },
  });

  console.log(`👤 Usuário demo pronto: ${user.email}`);

  // 2. Limpar listas antigas do usuário demo (opcional)
  // await prisma.shoppingList.deleteMany({ where: { userId: user.id } });

  const categories: Category[] = [
    "Alimentos",
    "Bebidas",
    "Higiene",
    "Limpeza",
    "Hortifruti",
    "Acougue",
    "Padaria",
    "Outros",
  ];

  // 3. Gerar 10 listas nos últimos 6 meses
  for (let i = 0; i < 10; i++) {
    const monthsAgo = Math.floor(i / 2);
    const daysAgo = Math.floor(Math.random() * 20);
    const date = subDays(subMonths(new Date(), monthsAgo), daysAgo);
    
    const isCompleted = i < 8; // 8 concluídas, 2 abertas
    const totalValue = isCompleted ? Math.random() * 400 + 100 : null;

    const list = await prisma.shoppingList.create({
      data: {
        name: `Compras ${date.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })} #${i + 1}`,
        userId: user.id,
        status: isCompleted ? "CONCLUIDA" : "ABERTA",
        totalValue,
        createdAt: date,
        updatedAt: date,
        items: {
          create: Array.from({ length: Math.floor(Math.random() * 10) + 5 }).map(() => ({
            name: `Item ${Math.random().toString(36).substring(7)}`,
            quantity: Math.floor(Math.random() * 5) + 1,
            unit: "un",
            isPicked: isCompleted || Math.random() > 0.5,
            category: categories[Math.floor(Math.random() * categories.length)],
          })),
        },
      },
    });

    console.log(`✅ Lista criada: ${list.name} (${list.status})`);
  }

  console.log("✨ Seed finalizado com sucesso!");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
