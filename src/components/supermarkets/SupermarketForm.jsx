"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createSupermarket,
  updateSupermarket,
} from "@/lib/actions/supermarkets";
import { ImageUpload } from "@/components/products/ImageUpload";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function SupermarketForm({
  supermarket,
  cloudinaryEnabled = false,
}) {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(formData) {
    setError(null);
    startTransition(async () => {
      const result = supermarket
        ? await updateSupermarket(supermarket.id, formData)
        : await createSupermarket(formData);

      if (!result.success) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <Input
        name="name"
        label="Nombre"
        defaultValue={supermarket?.name}
        required
        placeholder="Ej. Mercadona"
      />

      <ImageUpload
        variant="supermarket"
        defaultUrl={supermarket?.logoUrl}
        uploadEnabled={cloudinaryEnabled}
      />

      {!cloudinaryEnabled ? (
        <Input
          name="logoUrl"
          label="URL del logo"
          type="url"
          defaultValue={supermarket?.logoUrl ?? ""}
          placeholder="https://..."
        />
      ) : null}

      <Input
        name="location"
        label="Ubicación"
        defaultValue={supermarket?.location ?? ""}
        placeholder="Ej. Calle Mayor 12, Madrid"
      />

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Guardando…" : supermarket ? "Actualizar" : "Añadir tienda"}
      </Button>
    </form>
  );
}
