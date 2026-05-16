"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getUsers() {
  await requireAdmin();
  return await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          products: true,
          shoppingLists: true,
        }
      }
    }
  });
}

export async function updateUserRole(userId, newRole) {
  await requireAdmin();
  
  // Prevent admin from demoting themselves (optional but recommended)
  // const currentAdminId = await requireAdmin();
  // if (userId === currentAdminId) throw new Error("No puedes cambiar tu propio rol");

  await prisma.user.update({
    where: { id: userId },
    data: { role: newRole },
  });

  revalidatePath("/dashboard/usuarios");
  return { success: true };
}

export async function deleteUser(userId) {
  const currentAdminId = await requireAdmin();
  
  if (userId === currentAdminId) {
    return { success: false, error: "No puedes eliminar tu propia cuenta de administrador" };
  }

  await prisma.user.delete({
    where: { id: userId },
  });

  revalidatePath("/dashboard/usuarios");
  return { success: true };
}
