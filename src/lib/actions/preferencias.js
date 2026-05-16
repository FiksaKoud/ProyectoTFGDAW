"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import {
  ACTIVE_LIST_COOKIE,
  PREFERRED_SUPERMARKET_COOKIE,
} from "@/lib/constants";

export async function establecerSupermercadoPreferido(supermarketId) {
  const cookieStore = await cookies();
  cookieStore.set(PREFERRED_SUPERMARKET_COOKIE, supermarketId, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/productos");
}

export async function establecerListaActiva(listId) {
  const cookieStore = await cookies();
  cookieStore.set(ACTIVE_LIST_COOKIE, listId, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  revalidatePath("/dashboard/listas");
  revalidatePath("/dashboard/comparar");
}

export async function obtenerIdSupermercadoPreferido() {
  const cookieStore = await cookies();
  return cookieStore.get(PREFERRED_SUPERMARKET_COOKIE)?.value ?? null;
}

export async function obtenerIdListaActiva() {
  const cookieStore = await cookies();
  return cookieStore.get(ACTIVE_LIST_COOKIE)?.value ?? null;
}
