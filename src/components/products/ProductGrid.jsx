import { getProducts } from "@/lib/actions/products";
import { ProductCard } from "@/components/products/ProductCard";

export async function ProductGrid() {
  const products = await getProducts();

  if (products.length === 0) {
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
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          category={product.category}
          imageCloudinary={product.imageCloudinary}
          latestPrice={product.priceRecords[0] ?? null}
        />
      ))}
    </div>
  );
}
