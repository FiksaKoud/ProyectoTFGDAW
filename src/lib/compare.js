import { prisma } from "@/lib/prisma";
import { decimalToNumber } from "@/lib/utils";

/**
 * Compara el coste total de una lista de compra en cada supermercado del usuario,
 * usando el precio más reciente registrado por producto y tienda.
 */
export async function compareShoppingList(listId, userId) {
  const list = await prisma.shoppingList.findFirst({
    where: { id: listId, userId },
    include: {
      items: {
        include: { product: { select: { id: true, name: true } } },
      },
    },
  });

  if (!list) return null;

  const supermarkets = await prisma.supermarket.findMany({
    where: { userId },
    orderBy: { name: "asc" },
  });

  const productIds = list.items.map((item) => item.productId);

  if (supermarkets.length === 0) {
    return {
      listId: list.id,
      listName: list.name,
      comparisons: [],
      cheapestSupermarketId: null,
    };
  }

  const priceRecords =
    productIds.length > 0
      ? await prisma.priceRecord.findMany({
          where: {
            productId: { in: productIds },
            supermarketId: { in: supermarkets.map((s) => s.id) },
          },
          orderBy: { recordedAt: "desc" },
        })
      : [];

  const latestPriceByStoreProduct = new Map();
  for (const record of priceRecords) {
    const key = `${record.supermarketId}:${record.productId}`;
    if (!latestPriceByStoreProduct.has(key)) {
      latestPriceByStoreProduct.set(key, decimalToNumber(record.price));
    }
  }

  const comparisons = supermarkets.map((store) => {
    const lineItems = list.items.map((item) => {
      const key = `${store.id}:${item.productId}`;
      const unitPrice = latestPriceByStoreProduct.get(key) ?? null;
      const subtotal =
        unitPrice !== null ? unitPrice * item.quantity : null;

      return {
        productId: item.productId,
        productName: item.product.name,
        quantity: item.quantity,
        unitPrice,
        subtotal,
      };
    });

    const missingProducts = lineItems
      .filter((line) => line.unitPrice === null)
      .map((line) => ({ id: line.productId, name: line.productName }));

    const coveredItems = lineItems.filter(
      (line) => line.unitPrice !== null,
    ).length;

    const total = lineItems.reduce(
      (sum, line) => sum + (line.subtotal ?? 0),
      0,
    );

    return {
      supermarketId: store.id,
      supermarketName: store.name,
      logoUrl: store.logoUrl,
      total,
      coveredItems,
      totalItems: list.items.length,
      missingProducts,
      lineItems,
    };
  });

  const completeComparisons = comparisons.filter(
    (c) => c.totalItems > 0 && c.coveredItems === c.totalItems,
  );

  const cheapest =
    completeComparisons.length > 0
      ? completeComparisons.reduce((best, current) =>
          current.total < best.total ? current : best,
        )
      : comparisons.reduce((best, current) => {
          if (current.coveredItems === 0) return best;
          if (!best || current.total < best.total) return current;
          return best;
        }, null);

  return {
    listId: list.id,
    listName: list.name,
    comparisons,
    cheapestSupermarketId: cheapest?.supermarketId ?? null,
  };
}
