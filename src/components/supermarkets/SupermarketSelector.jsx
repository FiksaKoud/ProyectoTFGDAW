"use client";

import { useTransition } from "react";
import { Store } from "lucide-react";
import { setPreferredSupermarket } from "@/lib/actions/preferences";
import { cn } from "@/lib/utils";

export function SupermarketSelector({ supermarkets, selectedId }) {
  const [pending, startTransition] = useTransition();

  if (supermarkets.length === 0) {
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
        {pending ? (
          <span className="text-xs font-normal text-emerald-600">Guardando…</span>
        ) : null}
      </p>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {supermarkets.map((store) => {
          const active = store.id === selectedId;
          return (
            <button
              key={store.id}
              type="button"
              disabled={pending}
              onClick={() =>
                startTransition(() => {
                  void setPreferredSupermarket(store.id);
                })
              }
              className={cn(
                "shrink-0 rounded-xl border px-4 py-2 text-sm font-medium transition",
                active
                  ? "border-emerald-600 bg-emerald-600 text-white"
                  : "border-emerald-200 bg-white text-emerald-900 hover:border-emerald-400",
              )}
            >
              {store.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
