"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { crearProducto, actualizarProducto } from "@/lib/actions/productos";
import { PRODUCT_CATEGORIES } from "@/lib/constants";
import { ImageUpload } from "@/components/products/ImageUpload";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function FormularioProducto({
  producto,
  cloudinaryHabilitado = false,
  supermercados = [],
  idSupermercadoDefecto,
}) {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [pendiente, iniciarTransicion] = useTransition();
  const [formKey, setFormKey] = useState(Date.now());

  function handleSubmit(formData) {
    setError(null);
    iniciarTransicion(async () => {
      const resultado = producto
        ? await actualizarProducto(producto.id, formData)
        : await crearProducto(formData);

      if (!resultado.success) {
        setError(resultado.error);
        return;
      }

      if (!producto && resultado.data?.id) {
        router.push(`/dashboard/productos/${resultado.data.id}`);
      } else {
        if (!producto) {
          // Si creamos desde un modal o lista que no redirige
          setFormKey(Date.now());
        }
        router.refresh();
      }
    });
  }

  return (
    <form key={formKey} action={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Input
          name="name"
          label="Nombre del producto"
          defaultValue={producto?.name}
          required
          placeholder="Ej. Leche entera 1L"
        />
        <div className="space-y-1.5">
          <label
            htmlFor="category"
            className="block text-sm font-medium text-emerald-950"
          >
            Categoría
          </label>
          <select
            id="category"
            name="category"
            defaultValue={producto?.category ?? ""}
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
          defaultUrl={producto?.imageCloudinary}
          uploadEnabled={cloudinaryHabilitado}
        />

        {!cloudinaryHabilitado ? (
          <Input
            name="imageCloudinary"
            label="URL imagen (Cloudinary u otra)"
            type="url"
            defaultValue={producto?.imageCloudinary ?? ""}
            placeholder="https://res.cloudinary.com/..."
          />
        ) : null}
      </div>

      {!producto && supermercados.length > 0 && (
        <div className="rounded-2xl bg-emerald-50/50 p-4 ring-1 ring-emerald-100">
          <h3 className="mb-3 text-sm font-semibold text-emerald-900">
            Añadir precio inicial (opcional)
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label
                htmlFor="supermarketId"
                className="block text-xs font-medium text-emerald-700"
              >
                Supermercado
              </label>
              <select
                id="supermarketId"
                name="supermarketId"
                defaultValue={idSupermercadoDefecto ?? supermercados[0]?.id}
                className="h-11 w-full rounded-xl border border-emerald-200 bg-white px-3 text-sm"
              >
                <option value="">No registrar precio ahora</option>
                {supermercados.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <Input
              name="price"
              label="Precio (€)"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
            />
          </div>
        </div>
      )}

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button type="submit" disabled={pendiente} className="w-full">
        {pendiente ? "Guardando…" : producto ? "Guardar cambios" : "Crear producto"}
      </Button>
    </form>
  );
}
