import { v2 as cloudinary } from "cloudinary";

function getCloudinaryConfig() {
  const url = process.env.CLOUDINARY_URL;

  if (url && url.startsWith("cloudinary://")) {
    return { url };
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (cloudName && apiKey && apiSecret) {
    return { cloudName, apiKey, apiSecret };
  }

  return null;
}

export function isCloudinaryConfigured() {
  const config = getCloudinaryConfig();
  return config !== null;
}

export async function uploadImage(file, userId, folder) {
  const config = getCloudinaryConfig();
  if (!config) {
    return {
      error:
        "Cloudinary no está configurado. Añade CLOUDINARY_URL en tu archivo .env",
    };
  }

  if (config.url) {
    cloudinary.config({
      cloudinary_url: config.url,
      secure: true,
    });
  } else {
    cloudinary.config({
      cloud_name: config.cloudName,
      api_key: config.apiKey,
      api_secret: config.apiSecret,
      secure: true,
    });
  }

  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return { error: "La imagen no puede superar 5 MB" };
  }

  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowed.includes(file.type)) {
    return { error: "Formato no válido. Usa JPG, PNG, WebP o GIF" };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const dataUri = `data:${file.type};base64,${buffer.toString("base64")}`;

  try {
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: `smartcart/${folder}/${userId}`,
      resource_type: "image",
      transformation: [{ width: 800, height: 800, crop: "limit" }],
    });

    return { url: result.secure_url };
  } catch (error) {
    console.error("Cloudinary error:", error);
    return { error: "Error al subir la imagen a Cloudinary" };
  }
}
