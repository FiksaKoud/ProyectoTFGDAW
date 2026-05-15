"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUserId } from "@/lib/auth";
import { compareShoppingList } from "@/lib/compare";
import { prisma } from "@/lib/prisma";

const listSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
});

export async function getShoppingLists() {
  const userId = await requireUserId();
  return prisma.shoppingList.findMany({
    where: { userId },
    include: { _count: { select: { items: true } } },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getShoppingListById(id) {
  const userId = await requireUserId();
  return prisma.shoppingList.findFirst({
    where: { id, userId },
    include: {
      items: {
        include: { product: true },
        orderBy: { product: { name: "asc" } },
      },
    },
  });
}

export async function createShoppingList(formData) {
  try {
    const userId = await requireUserId();
    const parsed = listSchema.safeParse({ name: formData.get("name") });

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
    }

    const list = await prisma.shoppingList.create({
      data: { userId, name: parsed.data.name },
    });

    revalidatePath("/dashboard/lists");
    revalidatePath("/dashboard/compare");

    return { success: true, data: { id: list.id } };
  } catch {
    return { success: false, error: "No se pudo crear la lista" };
  }
}

export async function deleteShoppingList(id) {
  try {
    const userId = await requireUserId();
    const result = await prisma.shoppingList.deleteMany({
      where: { id, userId },
    });

    if (result.count === 0) {
      return { success: false, error: "Lista no encontrada" };
    }

    revalidatePath("/dashboard/lists");
    revalidatePath("/dashboard/compare");

    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "No se pudo eliminar la lista" };
  }
}

export async function addItemToList(
  listId,
  productId,
  quantity = 1,
) {
  try {
    const userId = await requireUserId();

    const list = await prisma.shoppingList.findFirst({
      where: { id: listId, userId },
    });
    const product = await prisma.product.findFirst({
      where: { id: productId, userId },
    });

    if (!list || !product) {
      return { success: false, error: "Lista o producto no válido" };
    }

    await prisma.shoppingListItem.upsert({
      where: {
        shoppingListId_productId: { shoppingListId: listId, productId },
      },
      create: { shoppingListId: listId, productId, quantity },
      update: { quantity: { increment: quantity } },
    });

    revalidatePath(`/dashboard/lists/${listId}`);
    revalidatePath("/dashboard/compare");

    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "No se pudo añadir el producto" };
  }
}

export async function updateListItemQuantity(
  itemId,
  quantity,
) {
  try {
    const userId = await requireUserId();

    if (quantity < 1) {
      return { success: false, error: "La cantidad debe ser al menos 1" };
    }

    const item = await prisma.shoppingListItem.findFirst({
      where: { id: itemId, shoppingList: { userId } },
    });

    if (!item) {
      return { success: false, error: "Elemento no encontrado" };
    }

    await prisma.shoppingListItem.update({
      where: { id: itemId },
      data: { quantity },
    });

    revalidatePath(`/dashboard/lists/${item.shoppingListId}`);
    revalidatePath("/dashboard/compare");

    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "No se pudo actualizar la cantidad" };
  }
}

export async function removeItemFromList(itemId) {
  try {
    const userId = await requireUserId();

    const item = await prisma.shoppingListItem.findFirst({
      where: { id: itemId, shoppingList: { userId } },
    });

    if (!item) {
      return { success: false, error: "Elemento no encontrado" };
    }

    await prisma.shoppingListItem.delete({ where: { id: itemId } });

    revalidatePath(`/dashboard/lists/${item.shoppingListId}`);
    revalidatePath("/dashboard/compare");

    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "No se pudo eliminar el producto" };
  }
}

export async function compareList(listId) {
  const userId = await requireUserId();
  return compareShoppingList(listId, userId);
}
