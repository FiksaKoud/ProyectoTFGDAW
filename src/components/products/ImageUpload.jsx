"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { Camera, Loader2, X } from "lucide-react";
import {
  uploadProductImageAction,
  uploadSupermarketLogoAction,
  uploadProfileImageAction,
} from "@/lib/actions/upload";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

function compressImage(file, maxWidth = 1024, maxHeight = 1024, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target.result;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File(
                [blob],
                file.name.replace(/\.[^/.]+$/, "") + ".jpg",
                {
                  type: "image/jpeg",
                  lastModified: Date.now(),
                }
              );
              resolve(compressedFile);
            } else {
              reject(new Error("La compresión de la imagen falló"));
            }
          },
          "image/jpeg",
          quality
        );
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

export function ImageUpload({
  name,
  defaultUrl,
  uploadEnabled = true,
  label,
  variant = "product",
}) {
  const fieldName =
    name ??
    (variant === "supermarket"
      ? "logoUrl"
      : variant === "profile"
        ? "image"
        : "imageCloudinary");
  const fieldLabel =
    label ??
    (variant === "supermarket"
      ? "Logo de la tienda"
      : variant === "profile"
        ? "Foto de perfil"
        : "Foto del producto");
  const uploadAction =
    variant === "supermarket"
      ? uploadSupermarketLogoAction
      : variant === "profile"
        ? uploadProfileImageAction
        : uploadProductImageAction;
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(defaultUrl ?? null);
  const [url, setUrl] = useState(defaultUrl ?? "");
  const [error, setError] = useState(null);
  const [pending, startTransition] = useTransition();

  async function handleFile(file) {
    setError(null);

    let fileToUpload = file;
    if (file.type.startsWith("image/")) {
      try {
        fileToUpload = await compressImage(file);
      } catch (err) {
        console.error("Error al comprimir imagen, se usará la original:", err);
      }
    }

    const localPreview = URL.createObjectURL(fileToUpload);
    setPreview(localPreview);

    const fd = new FormData();
    fd.append("file", fileToUpload);

    startTransition(async () => {
      const result = await uploadAction(fd);
      URL.revokeObjectURL(localPreview);

      if (!result.success) {
        setError(result.error);
        setPreview(defaultUrl ?? null);
        setUrl(defaultUrl ?? "");
        return;
      }

      setPreview(result.data.url);
      setUrl(result.data.url);
    });
  }

  function clearImage() {
    setPreview(null);
    setUrl("");
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="space-y-2">
      <span className="block text-sm font-medium text-emerald-950">{fieldLabel}</span>

      <input type="hidden" name={fieldName} value={url} />

      <div
        className={cn(
          "relative flex flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-emerald-200 bg-emerald-50/50",
          variant === "profile" ? "aspect-square" : "aspect-[4/3]",
          preview && "border-solid border-emerald-200",
        )}
      >
        {preview ? (
          <>
            <Image
              src={preview}
              alt="Vista previa"
              fill
              className="object-cover"
              sizes="400px"
              unoptimized={preview.startsWith("blob:")}
            />
            {pending ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
              </div>
            ) : null}
            <button
              type="button"
              onClick={clearImage}
              className="absolute right-2 top-2 z-10 rounded-full bg-white/90 p-1.5 shadow hover:bg-white"
              aria-label="Quitar imagen"
            >
              <X className="h-4 w-4 text-emerald-900" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 p-6 text-center">
            <Camera className="h-10 w-10 text-emerald-400" />
            <p className="text-sm text-emerald-700">
              {uploadEnabled
                ? "Toca para hacer una foto o elegir archivo"
                : "Cloudinary no configurado — puedes pegar una URL abajo"}
            </p>
          </div>
        )}

        {uploadEnabled ? (
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            capture="environment"
            className={preview ? "hidden" : "absolute inset-0 cursor-pointer opacity-0"}
            disabled={pending}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        ) : null}
      </div>

      {!uploadEnabled ? (
        <p className="text-xs text-amber-700">
          Añade CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY y CLOUDINARY_API_SECRET
          en .env para subir desde el móvil en la tienda.
        </p>
      ) : null}

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="flex gap-2">
        {uploadEnabled ? (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={pending}
            onClick={() => inputRef.current?.click()}
          >
            {pending ? "Subiendo…" : "Elegir imagen"}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
