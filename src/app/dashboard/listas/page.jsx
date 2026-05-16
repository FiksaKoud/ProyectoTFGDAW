import { obtenerListasCompra, obtenerListaCompraPorId } from "@/lib/actions/listas-compra";
import { obtenerIdListaActiva } from "@/lib/actions/preferencias";
import { GestorListasCompra } from "@/components/lists/ShoppingListManager";

export const metadata = { title: "Listas de compra" };

export default async function PaginaListas() {
  const [listas, idListaActiva] = await Promise.all([
    obtenerListasCompra(),
    obtenerIdListaActiva(),
  ]);

  const listasConItems = await Promise.all(
    listas.map(async (lista) => {
      const completa = await obtenerListaCompraPorId(lista.id);
      return {
        id: lista.id,
        name: lista.name,
        items: completa?.items ?? [],
        _count: { items: completa?.items?.length ?? 0 }
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
      <GestorListasCompra listas={listasConItems} idListaActiva={idListaActiva} />
    </div>
  );
}
