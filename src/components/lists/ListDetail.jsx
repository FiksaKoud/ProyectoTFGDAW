"use client";

import { useTransition } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import {
  añadirItemALista,
  quitarItemDeLista,
  actualizarCantidadItem,
  añadidoRapidoProductoALista,
} from "@/lib/actions/listas-compra";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function DetalleListaCompra({
  idLista,
  nombreLista,
  items,
  productosDisponibles,
  supermercados = [],
  idSupermercadoDefecto,
}) {
  const [pendiente, iniciarTransicion] = useTransition();

  // Intentar emparejar el nombre de la lista con un supermercado para el valor por defecto
  const idSupermercadoSugerido = supermercados.find(
    (s) => s.name.toLowerCase() === nombreLista?.toLowerCase()
  )?.id ?? idSupermercadoDefecto;

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="mb-4 font-semibold text-emerald-950">Productos en la lista</h2>
        {items.length === 0 ? (
          <p className="text-sm text-emerald-700">La lista está vacía.</p>
        ) : (
          <ul className="space-y-3">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-emerald-50/80 px-3 py-3"
              >
                <span className="font-medium text-emerald-950">{item.product.name}</span>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    disabled={pendiente || item.quantity <= 1}
                    onClick={() =>
                      iniciarTransicion(() => {
                        void actualizarCantidadItem(item.id, item.quantity - 1);
                      })
                    }
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center font-semibold">{item.quantity}</span>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    disabled={pendiente}
                    onClick={() =>
                      iniciarTransicion(() => {
                        void actualizarCantidadItem(item.id, item.quantity + 1);
                      })
                    }
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={pendiente}
                    onClick={() =>
                      iniciarTransicion(() => {
                        void quitarItemDeLista(item.id);
                      })
                    }
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card>
        <h2 className="mb-4 font-semibold text-emerald-950">Añadido rápido</h2>
        <form
          action={(fd) => {
            const name = fd.get("name");
            const price = fd.get("price");
            const supermarketId = fd.get("supermarketId");
            iniciarTransicion(async () => {
              await añadidoRapidoProductoALista(idLista, name, price, supermarketId);
            });
          }}
          className="grid gap-3 sm:grid-cols-4 sm:items-end"
        >
          <div className="sm:col-span-2">
            <Input name="name" label="Nombre del producto" placeholder="Ej. Pan" required />
          </div>
          <div>
            <Input name="price" label="Precio (€)" type="number" step="0.01" placeholder="0.00" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-emerald-700">Supermercado</label>
            <select
              name="supermarketId"
              defaultValue={idSupermercadoSugerido ?? supermercados[0]?.id}
              className="h-11 w-full rounded-xl border border-emerald-200 bg-white px-3 text-sm"
            >
              {supermercados.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <Button type="submit" disabled={pendiente} className="sm:col-span-4">
            Crear y añadir
          </Button>
        </form>
      </Card>

      <Card>
        <h2 className="mb-4 font-semibold text-emerald-950">Elegir de mis productos</h2>
        {productosDisponibles.length === 0 ? (
          <p className="text-sm text-emerald-700">No hay más productos disponibles.</p>
        ) : (
          <ul className="max-h-60 overflow-y-auto space-y-2 pr-1">
            {productosDisponibles.map((producto) => (
              <li
                key={producto.id}
                className="flex items-center justify-between rounded-xl border border-emerald-100 px-3 py-2"
              >
                <span className="text-sm">{producto.name}</span>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  disabled={pendiente}
                  onClick={() =>
                    iniciarTransicion(() => {
                      void añadirItemALista(idLista, producto.id);
                    })
                  }
                >
                  Añadir
                </Button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
