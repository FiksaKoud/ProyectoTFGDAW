import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getShoppingListById } from "@/lib/actions/shopping-lists";
import { getProducts } from "@/lib/actions/products";
import { ListDetail } from "@/components/lists/ListDetail";
import { setActiveList } from "@/lib/actions/preferences";

export default async function ListDetailPage({ params }) {
  const { id } = await params;
  const [list, allProducts] = await Promise.all([
    getShoppingListById(id),
    getProducts(),
  ]);

  if (!list) notFound();

  const inListIds = new Set(list.items.map((i) => i.productId));
  const availableProducts = allProducts
    .filter((p) => !inListIds.has(p.id))
    .map((p) => ({ id: p.id, name: p.name }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <Link
          href="/dashboard/lists"
          className="inline-flex items-center gap-1 text-sm text-emerald-700 hover:text-emerald-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Link>
        <h1 className="flex-1 text-2xl font-bold text-emerald-950">{list.name}</h1>
        <form
          action={async () => {
            "use server";
            await setActiveList(list.id);
          }}
        >
          <button
            type="submit"
            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            Usar para comparar
          </button>
        </form>
      </div>
      <ListDetail
        listId={list.id}
        items={list.items}
        availableProducts={availableProducts}
      />
    </div>
  );
}
