"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const esquemaSupermercado = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  logoUrl: z.string().url().optional().or(z.literal("")),
  location: z.string().optional(),
});

export async function obtenerSupermercados() {
  const userId = await requireUserId();
  return prisma.supermarket.findMany({
    where: { userId },
    orderBy: { name: "asc" },
  });
}

export async function crearSupermercado(formData) {
  try {
    const userId = await requireUserId();
    const validacion = esquemaSupermercado.safeParse({
      name: formData.get("name"),
      logoUrl: formData.get("logoUrl") || undefined,
      location: formData.get("location") || undefined,
    });

    if (!validacion.success) {
      return { success: false, error: validacion.error.issues[0]?.message ?? "Datos inválidos" };
    }

    const supermercado = await prisma.supermarket.create({
      data: {
        userId,
        name: validacion.data.name,
        logoUrl: validacion.data.logoUrl || null,
        location: validacion.data.location || null,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/supermercados");
    revalidatePath("/dashboard/comparar");

    return { success: true, data: { id: supermercado.id } };
  } catch {
    return { success: false, error: "No se pudo crear el supermercado" };
  }
}

export async function actualizarSupermercado(id, formData) {
  try {
    const userId = await requireUserId();
    const validacion = esquemaSupermercado.safeParse({
      name: formData.get("name"),
      logoUrl: formData.get("logoUrl") || undefined,
      location: formData.get("location") || undefined,
    });

    if (!validacion.success) {
      return { success: false, error: validacion.error.issues[0]?.message ?? "Datos inválidos" };
    }

    const resultado = await prisma.supermarket.updateMany({
      where: { id, userId },
      data: {
        name: validacion.data.name,
        logoUrl: validacion.data.logoUrl || null,
        location: validacion.data.location || null,
      },
    });

    if (resultado.count === 0) {
      return { success: false, error: "Supermercado no encontrado" };
    }

    revalidatePath("/dashboard/supermercados");
    revalidatePath("/dashboard/comparar");

    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "No se pudo actualizar el supermercado" };
  }
}

export async function eliminarSupermercado(id) {
  try {
    const userId = await requireUserId();
    const resultado = await prisma.supermarket.deleteMany({
      where: { id, userId },
    });

    if (resultado.count === 0) {
      return { success: false, error: "Supermercado no encontrado" };
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/supermercados");
    revalidatePath("/dashboard/comparar");

    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "No se pudo eliminar el supermercado" };
  }
}
