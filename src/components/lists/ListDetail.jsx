"use client";

import { useTransition } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import {
  addItemToList,
  removeItemFromList,
  updateListItemQuantity,
} from "@/lib/actions/shopping-lists";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export function ListDetail({ listId, items, availableProducts }) {
  const [pending, startTransition] = useTransition();

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
                    disabled={pending || item.quantity <= 1}
                    onClick={() =>
                      startTransition(() => {
                        void updateListItemQuantity(item.id, item.quantity - 1);
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
                    disabled={pending}
                    onClick={() =>
                      startTransition(() => {
                        void updateListItemQuantity(item.id, item.quantity + 1);
                      })
                    }
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={pending}
                    onClick={() =>
                      startTransition(() => {
                        void removeItemFromList(item.id);
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
        <h2 className="mb-4 font-semibold text-emerald-950">Añadir producto</h2>
        {availableProducts.length === 0 ? (
          <p className="text-sm text-emerald-700">No hay más productos disponibles.</p>
        ) : (
          <ul className="space-y-2">
            {availableProducts.map((product) => (
              <li
                key={product.id}
                className="flex items-center justify-between rounded-xl border border-emerald-100 px-3 py-2"
              >
                <span className="text-sm">{product.name}</span>
                <Button
                  type="button"
                  size="sm"
                  disabled={pending}
                  onClick={() =>
                    startTransition(() => {
                      void addItemToList(listId, product.id);
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
