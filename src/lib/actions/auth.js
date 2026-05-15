"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { signIn } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function registerUser(formData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || password.length < 6) {
    return {
      success: false,
      error: "Email válido y contraseña de al menos 6 caracteres requeridos",
    };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { success: false, error: "Ya existe una cuenta con este email" };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      name: name || null,
      email,
      passwordHash,
    },
  });

  return { success: true, data: undefined };
}

export async function loginUser(formData) {
  try {
    const result = await signIn("credentials", {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      redirect: false,
    });

    if (result?.error) {
      return { success: false, error: "Credenciales incorrectas" };
    }

    redirect("/dashboard");
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      String(error.digest).startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }
    return { success: false, error: "Credenciales incorrectas" };
  }
}

export async function logoutUser() {
  const { signOut } = await import("@/lib/auth");
  await signOut({ redirectTo: "/" });
}
