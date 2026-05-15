import Link from "next/link";
import { Suspense } from "react";
import { compareList, getShoppingLists } from "@/lib/actions/shopping-lists";
import { getActiveListId } from "@/lib/actions/preferences";
import { CompareResults } from "@/components/compare/CompareResults";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

export const metadata = { title: "Comparar cesta" };

async function CompareContent({ listId }) {
  const comparison = await compareList(listId);
  if (!comparison) {
    return (
      <Card>
        <p className="text-emerald-800">Lista no encontrada.</p>
      </Card>
    );
  }
  return <CompareResults comparison={comparison} />;
}

function CompareSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Skeleton className="h-40" />
      <Skeleton className="h-40" />
    </div>
  );
}

export default async function ComparePage() {
  const [lists, activeListId] = await Promise.all([
    getShoppingLists(),
    getActiveListId(),
  ]);

  const listId = activeListId ?? lists[0]?.id;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-emerald-950">Comparador de cesta</h1>
        <p className="text-sm text-emerald-700">
          Suma los precios más recientes de cada producto en todas tus tiendas.
        </p>
      </div>

      {lists.length === 0 ? (
        <Card>
          <p className="text-emerald-800">
            Crea una{" "}
            <Link href="/dashboard/lists" className="font-medium underline">
              lista de compra
            </Link>{" "}
            para empezar a comparar.
          </p>
        </Card>
      ) : (
        <>
          <Card>
            <p className="text-sm text-emerald-700">
              Lista activa:{" "}
              <span className="font-semibold text-emerald-950">
                {lists.find((l) => l.id === listId)?.name ?? lists[0]?.name}
              </span>
              . Cambia la lista desde{" "}
              <Link href="/dashboard/lists" className="underline">
                Listas
              </Link>
              .
            </p>
          </Card>
          {listId ? (
            <Suspense fallback={<CompareSkeleton />}>
              <CompareContent listId={listId} />
            </Suspense>
          ) : null}
        </>
      )}
    </div>
  );
}
