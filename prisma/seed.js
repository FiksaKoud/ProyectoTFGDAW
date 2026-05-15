import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "demo@smartcart.local";
  const passwordHash = await bcrypt.hash("demo1234", 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: "Usuario demo",
      passwordHash,
    },
  });

  const mercadona = await prisma.supermarket.upsert({
    where: { id: "seed-mercadona" },
    update: {},
    create: {
      id: "seed-mercadona",
      userId: user.id,
      name: "Mercadona",
      location: "Centro ciudad",
    },
  });

  const lidl = await prisma.supermarket.upsert({
    where: { id: "seed-lidl" },
    update: {},
    create: {
      id: "seed-lidl",
      userId: user.id,
      name: "Lidl",
      location: "Polígono industrial",
    },
  });

  const leche = await prisma.product.upsert({
    where: { id: "seed-leche" },
    update: {},
    create: {
      id: "seed-leche",
      userId: user.id,
      name: "Leche entera 1L",
      category: "Lácteos",
    },
  });

  const pan = await prisma.product.upsert({
    where: { id: "seed-pan" },
    update: {},
    create: {
      id: "seed-pan",
      userId: user.id,
      name: "Pan de molde",
      category: "Panadería",
    },
  });

  const prices = [
    { productId: leche.id, supermarketId: mercadona.id, price: 0.95 },
    { productId: leche.id, supermarketId: lidl.id, price: 0.89 },
    { productId: pan.id, supermarketId: mercadona.id, price: 1.2 },
    { productId: pan.id, supermarketId: lidl.id, price: 1.15 },
  ];

  for (const p of prices) {
    await prisma.priceRecord.create({ data: p });
  }

  const list = await prisma.shoppingList.upsert({
    where: { id: "seed-list" },
    update: {},
    create: {
      id: "seed-list",
      userId: user.id,
      name: "Compra semanal",
    },
  });

  await prisma.shoppingListItem.upsert({
    where: {
      shoppingListId_productId: {
        shoppingListId: list.id,
        productId: leche.id,
      },
    },
    update: {},
    create: {
      shoppingListId: list.id,
      productId: leche.id,
      quantity: 2,
    },
  });

  await prisma.shoppingListItem.upsert({
    where: {
      shoppingListId_productId: {
        shoppingListId: list.id,
        productId: pan.id,
      },
    },
    update: {},
    create: {
      shoppingListId: list.id,
      productId: pan.id,
      quantity: 1,
    },
  });

  console.log("Seed OK — demo@smartcart.local / demo1234");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
