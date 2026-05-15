"use server";

import { requireUserId } from "@/lib/auth";
import { uploadImage, isCloudinaryConfigured } from "@/lib/cloudinary";

async function handleUpload(formData, folder) {
  try {
    const userId = await requireUserId();
    const file = formData.get("file");

    if (!file || !(file instanceof File) || file.size === 0) {
      return { success: false, error: "Selecciona una imagen" };
    }

    const result = await uploadImage(file, userId, folder);

    if ("error" in result) {
      return { success: false, error: result.error };
    }

    return { success: true, data: { url: result.url } };
  } catch {
    return { success: false, error: "No autorizado o error al subir" };
  }
}

export async function uploadProductImageAction(formData) {
  return handleUpload(formData, "products");
}

export async function uploadSupermarketLogoAction(formData) {
  return handleUpload(formData, "supermarkets");
}

export async function getCloudinaryStatus() {
  return { configured: isCloudinaryConfigured() };
}
