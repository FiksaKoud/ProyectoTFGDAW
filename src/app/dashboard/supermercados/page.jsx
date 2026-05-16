import { Suspense } from "react";
import { ListaSupermercados } from "@/components/supermarkets/SupermarketList";
import { Skeleton } from "@/components/ui/Skeleton";

export const metadata = { title: "Supermercados" };

function EsqueletoListaSupermercados() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}

export default function PaginaSupermercados() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-emerald-950">Supermercados</h1>
        <p className="text-sm text-emerald-700">
          Crea perfiles de tienda para registrar y comparar precios.
        </p>
      </div>
      <Suspense fallback={<EsqueletoListaSupermercados />}>
        <ListaSupermercados />
      </Suspense>
    </div>
  );
}
