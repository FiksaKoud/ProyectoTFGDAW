import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";
import { CuadriculaProductos } from "@/components/products/ProductGrid";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import { obtenerSupermercados } from "@/lib/actions/supermercados";
import { obtenerIdSupermercadoPreferido } from "@/lib/actions/preferencias";
import { SelectorSupermercado } from "@/components/supermarkets/SupermarketSelector";
import { Card } from "@/components/ui/Card";

export const metadata = { title: "Productos" };

export default async function PaginaProductos() {
  const [supermercados, idPreferido] = await Promise.all([
    obtenerSupermercados(),
    obtenerIdSupermercadoPreferido(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-emerald-950">Productos</h1>
          <p className="text-sm text-emerald-700">
            Cada producto puede tener distintos precios por supermercado.
          </p>
        </div>
        <Link
          href="/dashboard/productos/nuevo"
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-medium text-white hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
          Nuevo producto
        </Link>
      </div>

      <Card>
        <SelectorSupermercado
          supermercados={supermercados}
          idSeleccionado={idPreferido ?? supermercados[0]?.id ?? null}
        />
      </Card>

      <Suspense
        key={idPreferido ?? "default"}
        fallback={
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-40 animate-pulse rounded-2xl bg-emerald-50" />
            ))}
          </div>
        }
      >
        <CuadriculaProductos supermarketId={idPreferido ?? supermercados[0]?.id} />
      </Suspense>
    </div>
  );
}
