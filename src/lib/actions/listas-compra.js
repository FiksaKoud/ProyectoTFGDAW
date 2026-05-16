"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUserId } from "@/lib/auth";
import { compareShoppingList } from "@/lib/compare";
import { prisma } from "@/lib/prisma";

const esquemaLista = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
});

export async function obtenerListasCompra() {
  const userId = await requireUserId();
  return prisma.shoppingList.findMany({
    where: { userId },
    include: { _count: { select: { items: true } } },
    orderBy: { updatedAt: "desc" },
  });
}

export async function obtenerListaCompraPorId(id) {
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

export async function crearListaCompra(formData) {
  try {
    const userId = await requireUserId();
    const validacion = esquemaLista.safeParse({ name: formData.get("name") });

    if (!validacion.success) {
      return { success: false, error: validacion.error.issues[0]?.message ?? "Datos inválidos" };
    }

    const lista = await prisma.shoppingList.create({
      data: { userId, name: validacion.data.name },
    });

    revalidatePath("/dashboard/listas");
    revalidatePath("/dashboard/comparar");

    return { success: true, data: { id: lista.id } };
  } catch {
    return { success: false, error: "No se pudo crear la lista" };
  }
}

export async function eliminarListaCompra(id) {
  try {
    const userId = await requireUserId();
    const resultado = await prisma.shoppingList.deleteMany({
      where: { id, userId },
    });

    if (resultado.count === 0) {
      return { success: false, error: "Lista no encontrada" };
    }

    revalidatePath("/dashboard/listas");
    revalidatePath("/dashboard/comparar");

    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "No se pudo eliminar la lista" };
  }
}

export async function añadirItemALista(listId, productId, quantity = 1) {
  try {
    const userId = await requireUserId();

    const lista = await prisma.shoppingList.findFirst({
      where: { id: listId, userId },
    });
    const producto = await prisma.product.findFirst({
      where: { id: productId, userId },
    });

    if (!lista || !producto) {
      return { success: false, error: "Lista o producto no válido" };
    }

    await prisma.shoppingListItem.upsert({
      where: {
        shoppingListId_productId: { shoppingListId: listId, productId },
      },
      create: { shoppingListId: listId, productId, quantity },
      update: { quantity: { increment: quantity } },
    });

    revalidatePath(`/dashboard/listas/${listId}`);
    revalidatePath("/dashboard/comparar");

    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "No se pudo añadir el producto" };
  }
}

export async function añadidoRapidoProductoALista(listId, name, price, supermarketId) {
  try {
    const userId = await requireUserId();

    // 1. Buscar o crear producto
    let producto = await prisma.product.findFirst({
      where: { name: { equals: name }, userId },
    });

    if (!producto) {
      producto = await prisma.product.create({
        data: { userId, name },
      });
    }

    // 2. Añadir precio si se proporciona
    if (price && supermarketId) {
      await prisma.priceRecord.create({
        data: {
          productId: producto.id,
          supermarketId,
          price: parseFloat(price),
        },
      });
    }

    // 3. Añadir a la lista
    await prisma.shoppingListItem.upsert({
      where: {
        shoppingListId_productId: { shoppingListId: listId, productId: producto.id },
      },
      create: { shoppingListId: listId, productId: producto.id, quantity: 1 },
      update: { quantity: { increment: 1 } },
    });

    revalidatePath(`/dashboard/listas/${listId}`);
    revalidatePath("/dashboard/comparar");
    revalidatePath("/dashboard/productos");

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "No se pudo añadir el producto rápido" };
  }
}

export async function actualizarCantidadItem(itemId, quantity) {
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

    revalidatePath(`/dashboard/listas/${item.shoppingListId}`);
    revalidatePath("/dashboard/comparar");

    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "No se pudo actualizar la cantidad" };
  }
}

export async function quitarItemDeLista(itemId) {
  try {
    const userId = await requireUserId();

    const item = await prisma.shoppingListItem.findFirst({
      where: { id: itemId, shoppingList: { userId } },
    });

    if (!item) {
      return { success: false, error: "Elemento no encontrado" };
    }

    await prisma.shoppingListItem.delete({ where: { id: itemId } });

    revalidatePath(`/dashboard/listas/${item.shoppingListId}`);
    revalidatePath("/dashboard/comparar");

    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "No se pudo eliminar el producto" };
  }
}

export async function compararLista(listId) {
  const userId = await requireUserId();
  return compareShoppingList(listId, userId);
}
