"use client";

import { useState, useTransition } from "react";
import { añadirRegistroPrecio } from "@/lib/actions/productos";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function FormularioRegistroPrecio({
  idProducto,
  supermercados,
  idSupermercadoDefecto,
  preciosActuales = {},
}) {
  const [error, setError] = useState(null);
  const [pendiente, iniciarTransicion] = useTransition();
  const [selectedSupermarket, setSelectedSupermarket] = useState(
    idSupermercadoDefecto ?? supermercados[0]?.id ?? ""
  );
  const [precioInput, setPrecioInput] = useState(
    preciosActuales[idSupermercadoDefecto ?? supermercados[0]?.id] ?? ""
  );

  if (supermercados.length === 0) {
    return (
      <p className="text-sm text-amber-700">
        Crea al menos un supermercado antes de registrar precios.
      </p>
    );
  }

  const precioActual = preciosActuales[selectedSupermarket];

  return (
    <form
      action={(formData) => {
        setError(null);
        iniciarTransicion(async () => {
          const resultado = await añadirRegistroPrecio(formData);
          if (!resultado.success) setError(resultado.error);
        });
      }}
      className="flex flex-col gap-3 sm:flex-row sm:items-end"
    >
      <input type="hidden" name="productId" value={idProducto} />
      <div className="min-w-[180px] flex-1 space-y-1.5">
        <label htmlFor="supermarketId" className="block text-sm font-medium text-emerald-950">
          Supermercado
        </label>
        <select
          id="supermarketId"
          name="supermarketId"
          value={selectedSupermarket}
          onChange={(e) => {
            const val = e.target.value;
            setSelectedSupermarket(val);
            setPrecioInput(preciosActuales[val] ?? "");
          }}
          className="h-11 w-full rounded-xl border border-emerald-200 bg-white px-3 text-sm"
          required
        >
          {supermercados.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>
      <Input
        name="price"
        label={
          precioActual !== undefined
            ? `Precio (€) (Actual: ${precioActual}€)`
            : "Precio (€)"
        }
        type="number"
        step="0.01"
        min="0.01"
        value={precioInput}
        onChange={(e) => setPrecioInput(e.target.value)}
        required
        className="w-full sm:max-w-[170px]"
      />
      <Button type="submit" disabled={pendiente}>
        {pendiente ? "Guardando…" : "Registrar precio"}
      </Button>
      {error ? <p className="w-full text-sm text-red-600 sm:col-span-3">{error}</p> : null}
    </form>
  );
}
