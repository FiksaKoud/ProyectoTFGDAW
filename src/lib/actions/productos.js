"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const esquemaProducto = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  category: z.string().optional(),
  imageCloudinary: z.string().url().optional().or(z.literal("")),
});

const esquemaPrecio = z.object({
  productId: z.string().min(1),
  supermarketId: z.string().min(1),
  price: z.coerce.number().positive("El precio debe ser mayor que 0"),
});

export async function obtenerProductos(supermarketId) {
  const userId = await requireUserId();
  return prisma.product.findMany({
    where: { userId },
    include: {
      priceRecords: {
        where: supermarketId ? { supermarketId } : undefined,
        orderBy: { recordedAt: "desc" },
        take: 1,
        include: { supermarket: { select: { id: true, name: true } } },
      },
    },
    orderBy: { name: "asc" },
  });
}

export async function obtenerProductoPorId(id) {
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

export async function crearProducto(formData) {
  try {
    const userId = await requireUserId();
    const validacion = esquemaProducto.safeParse({
      name: formData.get("name"),
      category: formData.get("category") || undefined,
      imageCloudinary: formData.get("imageCloudinary") || undefined,
    });

    if (!validacion.success) {
      return {
        success: false,
        error: validacion.error.issues[0]?.message ?? "Datos inválidos",
      };
    }

    const producto = await prisma.product.create({
      data: {
        userId,
        name: validacion.data.name,
        category: validacion.data.category || null,
        imageCloudinary: validacion.data.imageCloudinary || null,
      },
    });

    // Añadir precio inicial si se proporcionó
    const supermarketId = formData.get("supermarketId");
    const price = formData.get("price");

    if (supermarketId && price) {
      await prisma.priceRecord.create({
        data: {
          productId: producto.id,
          supermarketId: supermarketId,
          price: parseFloat(price),
        },
      });
    }

    revalidatePath("/dashboard/productos");
    return { success: true, data: { id: producto.id } };
  } catch (err) {
    console.error(err);
    return { success: false, error: "No se pudo crear el producto" };
  }
}

export async function actualizarProducto(id, formData) {
  try {
    const userId = await requireUserId();
    const validacion = esquemaProducto.safeParse({
      name: formData.get("name"),
      category: formData.get("category") || undefined,
      imageCloudinary: formData.get("imageCloudinary") || undefined,
    });

    if (!validacion.success) {
      return { success: false, error: validacion.error.issues[0]?.message ?? "Datos inválidos" };
    }

    const resultado = await prisma.product.updateMany({
      where: { id, userId },
      data: {
        name: validacion.data.name,
        category: validacion.data.category || null,
        imageCloudinary: validacion.data.imageCloudinary || null,
      },
    });

    if (resultado.count === 0) {
      return { success: false, error: "Producto no encontrado" };
    }

    revalidatePath("/dashboard/productos");
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "No se pudo actualizar el producto" };
  }
}

export async function eliminarProducto(id) {
  try {
    const userId = await requireUserId();
    const resultado = await prisma.product.deleteMany({
      where: { id, userId },
    });

    if (resultado.count === 0) {
      return { success: false, error: "Producto no encontrado" };
    }

    revalidatePath("/dashboard/productos");
    revalidatePath("/dashboard/listas");
    revalidatePath("/dashboard/comparar");

    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "No se pudo eliminar el producto" };
  }
}

export async function añadirRegistroPrecio(formData) {
  try {
    const userId = await requireUserId();
    const validacion = esquemaPrecio.safeParse({
      productId: formData.get("productId"),
      supermarketId: formData.get("supermarketId"),
      price: formData.get("price"),
    });

    if (!validacion.success) {
      return { success: false, error: validacion.error.issues[0]?.message ?? "Datos inválidos" };
    }

    const [producto, supermercado] = await Promise.all([
      prisma.product.findFirst({
        where: { id: validacion.data.productId, userId },
      }),
      prisma.supermarket.findFirst({
        where: { id: validacion.data.supermarketId, userId },
      }),
    ]);

    if (!producto || !supermercado) {
      return { success: false, error: "Producto o supermercado no válido" };
    }

    await prisma.priceRecord.create({
      data: {
        productId: validacion.data.productId,
        supermarketId: validacion.data.supermarketId,
        price: validacion.data.price,
      },
    });

    revalidatePath("/dashboard/productos");
    revalidatePath(`/dashboard/productos/${validacion.data.productId}`);
    revalidatePath("/dashboard/comparar");

    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "No se pudo registrar el precio" };
  }
}

export async function obtenerHistorialPrecios(productId, supermarketId) {
  const userId = await requireUserId();

  const producto = await prisma.product.findFirst({
    where: { id: productId, userId },
  });
  if (!producto) return [];

  return prisma.priceRecord.findMany({
    where: { productId, supermarketId },
    orderBy: { recordedAt: "asc" },
  });
}
