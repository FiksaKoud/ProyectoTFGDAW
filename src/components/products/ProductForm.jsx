"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct } from "@/lib/actions/products";
import { PRODUCT_CATEGORIES } from "@/lib/constants";
import { ImageUpload } from "@/components/products/ImageUpload";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function ProductForm({ product, cloudinaryEnabled = false }) {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(formData) {
    setError(null);
    startTransition(async () => {
      const result = product
        ? await updateProduct(product.id, formData)
        : await createProduct(formData);

      if (!result.success) {
        setError(result.error);
        return;
      }

      if (!product && result.data?.id) {
        router.push(`/dashboard/products/${result.data.id}`);
      } else {
        router.refresh();
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <Input
        name="name"
        label="Nombre del producto"
        defaultValue={product?.name}
        required
        placeholder="Ej. Leche entera 1L"
      />
      <div className="space-y-1.5">
        <label htmlFor="category" className="block text-sm font-medium text-emerald-950">
          Categoría
        </label>
        <select
          id="category"
          name="category"
          defaultValue={product?.category ?? ""}
          className="h-11 w-full rounded-xl border border-emerald-200 bg-white px-3 text-sm"
        >
          <option value="">Sin categoría</option>
          {PRODUCT_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <ImageUpload
        defaultUrl={product?.imageCloudinary}
        uploadEnabled={cloudinaryEnabled}
      />

      {!cloudinaryEnabled ? (
        <Input
          name="imageCloudinary"
          label="URL imagen (Cloudinary u otra)"
          type="url"
          defaultValue={product?.imageCloudinary ?? ""}
          placeholder="https://res.cloudinary.com/..."
        />
      ) : null}

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button type="submit" disabled={pending} className="w-full sm:w-auto">
        {pending ? "Guardando…" : product ? "Guardar cambios" : "Crear producto"}
      </Button>
    </form>
  );
}
