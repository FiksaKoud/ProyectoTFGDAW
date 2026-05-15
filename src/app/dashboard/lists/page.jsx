import { getShoppingLists } from "@/lib/actions/shopping-lists";
import { getActiveListId } from "@/lib/actions/preferences";
import { ShoppingListManager } from "@/components/lists/ShoppingListManager";

export const metadata = { title: "Listas de compra" };

export default async function ListsPage() {
  const [lists, activeListId] = await Promise.all([
    getShoppingLists(),
    getActiveListId(),
  ]);

  const listsWithItems = await Promise.all(
    lists.map(async (list) => {
      const full = await import("@/lib/actions/shopping-lists").then((m) =>
        m.getShoppingListById(list.id),
      );
      return {
        id: list.id,
        name: list.name,
        items: full?.items ?? [],
      };
    }),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-emerald-950">Listas de compra</h1>
        <p className="text-sm text-emerald-700">
          Crea listas y selecciona cuál quieres comparar entre tiendas.
        </p>
      </div>
      <ShoppingListManager lists={listsWithItems} activeListId={activeListId} />
    </div>
  );
}
