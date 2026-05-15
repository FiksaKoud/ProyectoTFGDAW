"use client";

import { useState, useTransition } from "react";
import { addPriceRecord } from "@/lib/actions/products";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function PriceRecordForm({
  productId,
  supermarkets,
  defaultSupermarketId,
}) {
  const [error, setError] = useState(null);
  const [pending, startTransition] = useTransition();

  if (supermarkets.length === 0) {
    return (
      <p className="text-sm text-amber-700">
        Crea al menos un supermercado antes de registrar precios.
      </p>
    );
  }

  return (
    <form
      action={(formData) => {
        setError(null);
        startTransition(async () => {
          const result = await addPriceRecord(formData);
          if (!result.success) setError(result.error);
        });
      }}
      className="flex flex-col gap-3 sm:flex-row sm:items-end"
    >
      <input type="hidden" name="productId" value={productId} />
      <div className="min-w-[180px] flex-1 space-y-1.5">
        <label htmlFor="supermarketId" className="block text-sm font-medium text-emerald-950">
          Supermercado
        </label>
        <select
          id="supermarketId"
          name="supermarketId"
          defaultValue={defaultSupermarketId ?? supermarkets[0]?.id}
          className="h-11 w-full rounded-xl border border-emerald-200 bg-white px-3 text-sm"
          required
        >
          {supermarkets.map((s) => (
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
        required
        className="w-full sm:max-w-[140px]"
      />
      <Button type="submit" disabled={pending}>
        {pending ? "Guardando…" : "Registrar precio"}
      </Button>
      {error ? <p className="w-full text-sm text-red-600 sm:col-span-3">{error}</p> : null}
    </form>
  );
}
