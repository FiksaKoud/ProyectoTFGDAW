"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { eliminarSupermercado } from "@/lib/actions/supermercados";
import { Button } from "@/components/ui/Button";

export function BotonEliminarSupermercado({ id }) {
  const [pendiente, iniciarTransicion] = useTransition();

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      disabled={pendiente}
      onClick={() => {
        if (window.confirm("¿Estás seguro de que quieres eliminar esta tienda? Se borrarán todos sus precios asociados.")) {
          iniciarTransicion(async () => {
            await eliminarSupermercado(id);
          });
        }
      }}
      aria-label="Eliminar"
    >
      <Trash2 className={`h-4 w-4 ${pendiente ? "text-gray-400" : "text-red-600"}`} />
    </Button>
  );
}
