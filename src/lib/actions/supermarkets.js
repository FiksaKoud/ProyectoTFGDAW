"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const supermarketSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  logoUrl: z.string().url().optional().or(z.literal("")),
  location: z.string().optional(),
});

export async function getSupermarkets() {
  const userId = await requireUserId();
  return prisma.supermarket.findMany({
    where: { userId },
    orderBy: { name: "asc" },
  });
}

export async function createSupermarket(formData) {
  try {
    const userId = await requireUserId();
    const parsed = supermarketSchema.safeParse({
      name: formData.get("name"),
      logoUrl: formData.get("logoUrl") || undefined,
      location: formData.get("location") || undefined,
    });

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
    }

    const supermarket = await prisma.supermarket.create({
      data: {
        userId,
        name: parsed.data.name,
        logoUrl: parsed.data.logoUrl || null,
        location: parsed.data.location || null,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/supermarkets");
    revalidatePath("/dashboard/compare");

    return { success: true, data: { id: supermarket.id } };
  } catch {
    return { success: false, error: "No se pudo crear el supermercado" };
  }
}

export async function updateSupermarket(
  id,
  formData,
) {
  try {
    const userId = await requireUserId();
    const parsed = supermarketSchema.safeParse({
      name: formData.get("name"),
      logoUrl: formData.get("logoUrl") || undefined,
      location: formData.get("location") || undefined,
    });

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
    }

    const result = await prisma.supermarket.updateMany({
      where: { id, userId },
      data: {
        name: parsed.data.name,
        logoUrl: parsed.data.logoUrl || null,
        location: parsed.data.location || null,
      },
    });

    if (result.count === 0) {
      return { success: false, error: "Supermercado no encontrado" };
    }

    revalidatePath("/dashboard/supermarkets");
    revalidatePath("/dashboard/compare");

    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "No se pudo actualizar el supermercado" };
  }
}

export async function deleteSupermarket(id) {
  try {
    const userId = await requireUserId();
    const result = await prisma.supermarket.deleteMany({
      where: { id, userId },
    });

    if (result.count === 0) {
      return { success: false, error: "Supermercado no encontrado" };
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/supermarkets");
    revalidatePath("/dashboard/compare");

    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "No se pudo eliminar el supermercado" };
  }
}
