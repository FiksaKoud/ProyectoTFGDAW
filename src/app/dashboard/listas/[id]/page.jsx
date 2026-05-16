import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { obtenerListaCompraPorId } from "@/lib/actions/listas-compra";
import { obtenerProductos } from "@/lib/actions/productos";
import { DetalleListaCompra } from "@/components/lists/ListDetail";
import { establecerListaActiva, obtenerIdSupermercadoPreferido } from "@/lib/actions/preferencias";
import { obtenerSupermercados } from "@/lib/actions/supermercados";

export default async function PaginaDetalleLista({ params }) {
  const { id } = await params;
  const [lista, todosLosProductos, supermercados, idPreferido] = await Promise.all([
    obtenerListaCompraPorId(id),
    obtenerProductos(),
    obtenerSupermercados(),
    obtenerIdSupermercadoPreferido(),
  ]);

  if (!lista) notFound();

  const idsEnLista = new Set(lista.items.map((i) => i.productId));
  const productosDisponibles = todosLosProductos
    .filter((p) => !idsEnLista.has(p.id))
    .map((p) => ({ id: p.id, name: p.name }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <Link
          href="/dashboard/listas"
          className="inline-flex items-center gap-1 text-sm text-emerald-700 hover:text-emerald-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Link>
        <h1 className="flex-1 text-2xl font-bold text-emerald-950">{lista.name}</h1>
        <form
          action={async () => {
            "use server";
            await establecerListaActiva(lista.id);
            redirect("/dashboard/comparar");
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
      <DetalleListaCompra
        idLista={lista.id}
        nombreLista={lista.name}
        items={lista.items}
        productosDisponibles={productosDisponibles}
        supermercados={supermercados}
        idSupermercadoDefecto={idPreferido}
      />
    </div>
  );
}
