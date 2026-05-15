"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const productSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  category: z.string().optional(),
  imageCloudinary: z.string().url().optional().or(z.literal("")),
});

const priceSchema = z.object({
  productId: z.string().min(1),
  supermarketId: z.string().min(1),
  price: z.coerce.number().positive("El precio debe ser mayor que 0"),
});

export async function getProducts() {
  const userId = await requireUserId();
  return prisma.product.findMany({
    where: { userId },
    include: {
      priceRecords: {
        orderBy: { recordedAt: "desc" },
        take: 1,
        include: { supermarket: { select: { id: true, name: true } } },
      },
    },
    orderBy: { name: "asc" },
  });
}

export async function getProductById(id) {
  const userId = await requireUserId();
  return prisma.product.findFirst({
    where: { id, userId },
    include: {
      priceRecords: {
        orderBy: { recordedAt: "asc" },
        include: { supermarket: { select: { id: true, name: true } } },
      },
    },
  });
}

export async function createProduct(formData) {
  try {
    const userId = await requireUserId();
    const parsed = productSchema.safeParse({
      name: formData.get("name"),
      category: formData.get("category") || undefined,
      imageCloudinary: formData.get("imageCloudinary") || undefined,
    });

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
    }

    const product = await prisma.product.create({
      data: {
        userId,
        name: parsed.data.name,
        category: parsed.data.category || null,
        imageCloudinary: parsed.data.imageCloudinary || null,
      },
    });

    revalidatePath("/dashboard/products");
    return { success: true, data: { id: product.id } };
  } catch {
    return { success: false, error: "No se pudo crear el producto" };
  }
}

export async function updateProduct(
  id,
  formData,
) {
  try {
    const userId = await requireUserId();
    const parsed = productSchema.safeParse({
      name: formData.get("name"),
      category: formData.get("category") || undefined,
      imageCloudinary: formData.get("imageCloudinary") || undefined,
    });

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
    }

    const result = await prisma.product.updateMany({
      where: { id, userId },
      data: {
        name: parsed.data.name,
        category: parsed.data.category || null,
        imageCloudinary: parsed.data.imageCloudinary || null,
      },
    });

    if (result.count === 0) {
      return { success: false, error: "Producto no encontrado" };
    }

    revalidatePath("/dashboard/products");
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "No se pudo actualizar el producto" };
  }
}

export async function deleteProduct(id) {
  try {
    const userId = await requireUserId();
    const result = await prisma.product.deleteMany({
      where: { id, userId },
    });

    if (result.count === 0) {
      return { success: false, error: "Producto no encontrado" };
    }

    revalidatePath("/dashboard/products");
    revalidatePath("/dashboard/lists");
    revalidatePath("/dashboard/compare");

    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "No se pudo eliminar el producto" };
  }
}

export async function addPriceRecord(
  formData,
) {
  try {
    const userId = await requireUserId();
    const parsed = priceSchema.safeParse({
      productId: formData.get("productId"),
      supermarketId: formData.get("supermarketId"),
      price: formData.get("price"),
    });

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
    }

    const [product, supermarket] = await Promise.all([
      prisma.product.findFirst({
        where: { id: parsed.data.productId, userId },
      }),
      prisma.supermarket.findFirst({
        where: { id: parsed.data.supermarketId, userId },
      }),
    ]);

    if (!product || !supermarket) {
      return { success: false, error: "Producto o supermercado no válido" };
    }

    await prisma.priceRecord.create({
      data: {
        productId: parsed.data.productId,
        supermarketId: parsed.data.supermarketId,
        price: parsed.data.price,
      },
    });

    revalidatePath("/dashboard/products");
    revalidatePath(`/dashboard/products/${parsed.data.productId}`);
    revalidatePath("/dashboard/compare");

    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "No se pudo registrar el precio" };
  }
}

export async function getPriceHistory(productId, supermarketId) {
  const userId = await requireUserId();

  const product = await prisma.product.findFirst({
    where: { id: productId, userId },
  });
  if (!product) return [];

  return prisma.priceRecord.findMany({
    where: { productId, supermarketId },
    orderBy: { recordedAt: "asc" },
  });
}
