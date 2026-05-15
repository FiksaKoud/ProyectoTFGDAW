import { Trophy, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { formatCurrency, cn } from "@/lib/utils";

export function CompareResults({ comparison }) {
  if (comparison.comparisons.length === 0) {
    return (
      <Card>
        <p className="text-emerald-800">
          Añade supermercados y productos con precios para poder comparar.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-emerald-950">
          Comparación: {comparison.listName}
        </h2>
        <p className="mt-1 text-sm text-emerald-700">
          Totales calculados con el precio más reciente por producto en cada tienda.
        </p>
      </div>

      <ul className="grid gap-4 md:grid-cols-2">
        {comparison.comparisons.map((store) => {
          const isCheapest =
            store.supermarketId === comparison.cheapestSupermarketId;
          const coverage =
            store.totalItems > 0
              ? Math.round((store.coveredItems / store.totalItems) * 100)
              : 0;

          return (
            <li key={store.supermarketId}>
              <Card
                className={cn(
                  "relative overflow-hidden",
                  isCheapest && "ring-2 ring-emerald-500",
                )}
              >
                {isCheapest ? (
                  <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white">
                    <Trophy className="h-3.5 w-3.5" />
                    Más barato
                  </span>
                ) : null}
                <h3 className="text-lg font-semibold text-emerald-950">
                  {store.supermarketName}
                </h3>
                <p className="mt-2 text-3xl font-bold text-emerald-900">
                  {formatCurrency(store.total)}
                </p>
                <p className="mt-1 text-sm text-emerald-700">
                  {store.coveredItems}/{store.totalItems} productos con precio (
                  {coverage}%)
                </p>
                {store.missingProducts.length > 0 ? (
                  <div className="mt-4 rounded-xl bg-amber-50 p-3">
                    <p className="flex items-center gap-1 text-xs font-medium text-amber-900">
                      <AlertCircle className="h-3.5 w-3.5" />
                      Sin precio en esta tienda
                    </p>
                    <ul className="mt-2 space-y-1 text-xs text-amber-800">
                      {store.missingProducts.map((p) => (
                        <li key={p.id}>• {p.name}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </Card>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
