"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function updateProfile(formData) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { success: false, error: "No autorizado" };
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const image = formData.get("image") ? String(formData.get("image")) : null;

  if (!email) {
    return { success: false, error: "El email es obligatorio" };
  }

  try {
    // Check if email is already taken by another user
    if (email !== session.user.email) {
      const existing = await prisma.user.findUnique({
        where: { email },
      });
      if (existing) {
        return { success: false, error: "El email ya está en uso" };
      }
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        name: name || null,
        email,
        image,
      },
    });

    revalidatePath("/dashboard/perfil");
    return { success: true };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, error: "Error al actualizar el perfil" };
  }
}
