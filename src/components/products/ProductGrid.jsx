import { obtenerProductos } from "@/lib/actions/productos";
import { TarjetaProducto } from "@/components/products/ProductCard";

export async function CuadriculaProductos({ supermarketId }) {
  const productos = await obtenerProductos(supermarketId);

  if (productos.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/50 p-10 text-center">
        <p className="text-emerald-800">
          Aún no tienes productos. Crea el primero para empezar a comparar precios.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {productos.map((producto) => (
        <TarjetaProducto
          key={producto.id}
          id={producto.id}
          name={producto.name}
          category={producto.category}
          imageCloudinary={producto.imageCloudinary}
          precioMasReciente={producto.priceRecords[0] ?? null}
        />
      ))}
    </div>
  );
}
