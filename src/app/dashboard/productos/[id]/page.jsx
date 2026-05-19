import { notFound } from "next/navigation";
import { obtenerProductoPorId } from "@/lib/actions/productos";
import { obtenerSupermercados } from "@/lib/actions/supermercados";
import { obtenerIdSupermercadoPreferido } from "@/lib/actions/preferencias";
import { getCloudinaryStatus } from "@/lib/actions/upload";
import { FormularioProducto } from "@/components/products/ProductForm";
import { FormularioRegistroPrecio } from "@/components/products/PriceRecordForm";
import { PriceHistoryChart } from "@/components/products/PriceHistoryChart";
import { Card } from "@/components/ui/Card";
import { decimalToNumber } from "@/lib/utils";
import { BotonEliminarProducto } from "@/components/products/DeleteProductButton";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const producto = await obtenerProductoPorId(id);
  return { title: producto?.name ?? "Producto" };
}

export default async function PaginaDetalleProducto({ params }) {
  const { id } = await params;
  const [producto, supermercados, idPreferido, { configured }] = await Promise.all([
    obtenerProductoPorId(id),
    obtenerSupermercados(),
    obtenerIdSupermercadoPreferido(),
    getCloudinaryStatus(),
  ]);

  if (!producto) notFound();

  // Serializamos los Decimal a Number para que Next.js pueda pasarlos al cliente
  const productoSerializado = {
    ...producto,
    priceRecords: producto.priceRecords.map((r) => ({
      ...r,
      price: decimalToNumber(r.price),
    })),
  };

  const preciosActuales = {};
  productoSerializado.priceRecords.forEach((r) => {
    preciosActuales[r.supermarketId] = r.price;
  });

  const idTiendaSeleccionada = idPreferido ?? supermercados[0]?.id ?? null;
  const historialPorTienda = supermercados.map((tienda) => {
    const puntos = productoSerializado.priceRecords
      .filter((r) => r.supermarketId === tienda.id)
      .map((r) => ({
        date: r.recordedAt.toISOString(),
        price: r.price,
      }));
    return { tienda, puntos };
  });

  return (
    <div className="space-y-8">
      <Link
        href="/dashboard/productos"
        className="inline-flex items-center gap-1 text-sm text-emerald-700 hover:text-emerald-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver
      </Link>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-emerald-950">{productoSerializado.name}</h1>
          {productoSerializado.category ? (
            <p className="text-sm text-emerald-600">{productoSerializado.category}</p>
          ) : null}
        </div>
        <BotonEliminarProducto id={productoSerializado.id} />
      </div>

      <Card>
        <h2 className="mb-4 font-semibold">Editar producto</h2>
        <FormularioProducto producto={productoSerializado} cloudinaryHabilitado={configured} />
      </Card>

      <Card>
        <h2 className="mb-4 font-semibold">Registrar precio</h2>
        <FormularioRegistroPrecio
          idProducto={productoSerializado.id}
          supermercados={supermercados}
          idSupermercadoDefecto={idTiendaSeleccionada}
          preciosActuales={preciosActuales}
        />
      </Card>

      <div className="space-y-6">
        <h2 className="text-lg font-semibold text-emerald-950">Histórico de precios</h2>
        {historialPorTienda.map(({ tienda, puntos }) => (
          <Card key={tienda.id}>
            <h3 className="mb-4 font-medium text-emerald-900">{tienda.name}</h3>
            <PriceHistoryChart points={puntos} supermarketName={tienda.name} />
          </Card>
        ))}
      </div>
    </div>
  );
}
