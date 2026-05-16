"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { eliminarProducto } from "@/lib/actions/productos";
import { Button } from "@/components/ui/Button";

export function BotonEliminarProducto({ id }) {
  const router = useRouter();
  const [pendiente, iniciarTransicion] = useTransition();

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      disabled={pendiente}
      onClick={() => {
        if (window.confirm("¿Estás seguro de que quieres eliminar este producto? Se borrarán todos sus precios e historial.")) {
          iniciarTransicion(async () => {
            const resultado = await eliminarProducto(id);
            if (resultado.success) {
              router.push("/dashboard/productos");
            }
          });
        }
      }}
      className="text-red-600 hover:bg-red-50 hover:text-red-700"
    >
      <Trash2 className="mr-2 h-4 w-4" />
      Eliminar producto
    </Button>
  );
}
