"use client";

import Link from "next/link";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import {
  crearListaCompra,
  eliminarListaCompra,
} from "@/lib/actions/listas-compra";
import { establecerListaActiva } from "@/lib/actions/preferencias";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function GestorListasCompra({ listas, idListaActiva }) {
  const router = useRouter();
  const [pendiente, iniciarTransicion] = useTransition();

  return (
    <Card>
      <h2 className="mb-4 font-semibold text-emerald-950">Tus listas</h2>
      <form
        action={(fd) => {
          iniciarTransicion(async () => {
            await crearListaCompra(fd);
          });
        }}
        className="mb-6 flex gap-2"
      >
        <Input name="name" placeholder="Compra semanal" required className="flex-1" />
        <Button type="submit" disabled={pendiente}>
          <Plus className="h-4 w-4" />
        </Button>
      </form>
      {listas.length === 0 ? (
        <p className="text-sm text-emerald-700">Crea tu primera lista de compra.</p>
      ) : (
        <ul className="space-y-2">
          {listas.map((lista) => (
            <li
              key={lista.id}
              className="flex items-center justify-between gap-2 rounded-xl border border-emerald-100 px-3 py-2"
            >
              <Link
                href={`/dashboard/listas/${lista.id}`}
                className="min-w-0 flex-1 font-medium text-emerald-900 hover:underline"
              >
                {lista.name}
                <span className="ml-2 text-xs text-emerald-600">
                  ({lista._count?.items ?? 0} productos)
                </span>
              </Link>
              <div className="flex shrink-0 gap-1">
                <Button
                  type="button"
                  variant={idListaActiva === lista.id ? "primary" : "secondary"}
                  size="sm"
                  disabled={pendiente}
                  onClick={() =>
                    iniciarTransicion(async () => {
                      await establecerListaActiva(lista.id);
                      router.push("/dashboard/comparar");
                    })
                  }
                >
                  Comparar
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={pendiente}
                  onClick={() => {
                    if (window.confirm("¿Estás seguro de que quieres eliminar esta lista?")) {
                      iniciarTransicion(async () => {
                        await eliminarListaCompra(lista.id);
                      });
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
