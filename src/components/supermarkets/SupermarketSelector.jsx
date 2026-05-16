"use client";

import { useTransition } from "react";
import { Store } from "lucide-react";
import { establecerSupermercadoPreferido } from "@/lib/actions/preferencias";
import { cn } from "@/lib/utils";

export function SelectorSupermercado({ supermercados, idSeleccionado }) {
  const [pendiente, iniciarTransicion] = useTransition();

  if (supermercados.length === 0) {
    return (
      <p className="text-sm text-emerald-700">
        Añade un supermercado para registrar precios.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <p className="flex items-center gap-2 text-sm font-medium text-emerald-950">
        <Store className="h-4 w-4" />
        Supermercado activo
        {pendiente ? (
          <span className="text-xs font-normal text-emerald-600">Guardando…</span>
        ) : null}
      </p>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {supermercados.map((tienda) => {
          const activo = tienda.id === idSeleccionado;
          return (
            <button
              key={tienda.id}
              type="button"
              disabled={pendiente}
              onClick={() =>
                iniciarTransicion(() => {
                  void establecerSupermercadoPreferido(tienda.id);
                })
              }
              className={cn(
                "shrink-0 rounded-xl border px-4 py-2 text-sm font-medium transition",
                activo
                  ? "border-emerald-600 bg-emerald-600 text-white"
                  : "border-emerald-200 bg-white text-emerald-900 hover:border-emerald-400",
              )}
            >
              {tienda.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
