"use client";

import Link from "next/link";
import { useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  createShoppingList,
  deleteShoppingList,
} from "@/lib/actions/shopping-lists";
import { setActiveList } from "@/lib/actions/preferences";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function ShoppingListManager({ lists, activeListId }) {
  const [pending, startTransition] = useTransition();

  return (
    <Card>
      <h2 className="mb-4 font-semibold text-emerald-950">Tus listas</h2>
      <form
        action={(fd) => {
          startTransition(async () => {
            await createShoppingList(fd);
          });
        }}
        className="mb-6 flex gap-2"
      >
        <Input name="name" placeholder="Compra semanal" required className="flex-1" />
        <Button type="submit" disabled={pending}>
          <Plus className="h-4 w-4" />
        </Button>
      </form>
      {lists.length === 0 ? (
        <p className="text-sm text-emerald-700">Crea tu primera lista de compra.</p>
      ) : (
        <ul className="space-y-2">
          {lists.map((list) => (
            <li
              key={list.id}
              className="flex items-center justify-between gap-2 rounded-xl border border-emerald-100 px-3 py-2"
            >
              <Link
                href={`/dashboard/lists/${list.id}`}
                className="min-w-0 flex-1 font-medium text-emerald-900 hover:underline"
              >
                {list.name}
                <span className="ml-2 text-xs text-emerald-600">
                  ({list.items.length} productos)
                </span>
              </Link>
              <div className="flex shrink-0 gap-1">
                <Button
                  type="button"
                  variant={activeListId === list.id ? "primary" : "secondary"}
                  size="sm"
                  onClick={() =>
                    startTransition(() => {
                      void setActiveList(list.id);
                    })
                  }
                >
                  Comparar
                </Button>
                <form
                  action={() => {
                    startTransition(async () => {
                      await deleteShoppingList(list.id);
                    });
                  }}
                >
                  <Button type="submit" variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
