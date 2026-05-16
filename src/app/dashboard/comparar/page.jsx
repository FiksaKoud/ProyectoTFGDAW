import Link from "next/link";
import { Suspense } from "react";
import { compararLista, obtenerListasCompra } from "@/lib/actions/listas-compra";
import { obtenerIdListaActiva } from "@/lib/actions/preferencias";
import { CompareResults } from "@/components/compare/CompareResults";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

export const metadata = { title: "Comparar cesta" };

async function ContenidoComparacion({ idLista }) {
  const comparacion = await compararLista(idLista);
  if (!comparacion) {
    return (
      <Card>
        <p className="text-emerald-800">Lista no encontrada.</p>
      </Card>
    );
  }
  return <CompareResults comparison={comparacion} />;
}

function EsqueletoComparacion() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Skeleton className="h-40" />
      <Skeleton className="h-40" />
    </div>
  );
}

export default async function PaginaComparar() {
  const [listas, idListaActiva] = await Promise.all([
    obtenerListasCompra(),
    obtenerIdListaActiva(),
  ]);

  const idLista = idListaActiva ?? listas[0]?.id;
  console.log('PaginaComparar - idListaActiva:', idListaActiva);
  console.log('PaginaComparar - idLista final:', idLista);
  
  const listaSeleccionada = listas.find(l => l.id === idLista);
  console.log('PaginaComparar - listaSeleccionada:', listaSeleccionada?.name, 'Items:', listaSeleccionada?._count?.items);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-emerald-950">Comparador de cesta</h1>
        <p className="text-sm text-emerald-700">
          Suma los precios más recientes de cada producto en todas tus tiendas.
        </p>
      </div>

      {listas.length === 0 ? (
        <Card>
          <p className="text-emerald-800">
            Crea una{" "}
            <Link href="/dashboard/listas" className="font-medium underline">
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
                {listas.find((l) => l.id === idLista)?.name ?? listas[0]?.name}
              </span>
              . Cambia la lista desde{" "}
              <Link href="/dashboard/listas" className="underline">
                Listas
              </Link>
              .
            </p>
          </Card>
          {idLista ? (
            <Suspense fallback={<EsqueletoComparacion />}>
              <ContenidoComparacion idLista={idLista} />
            </Suspense>
          ) : null}
        </>
      )}
    </div>
  );
}
