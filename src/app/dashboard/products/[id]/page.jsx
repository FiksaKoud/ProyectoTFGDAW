import { notFound } from "next/navigation";
import { getProductById } from "@/lib/actions/products";
import { getSupermarkets } from "@/lib/actions/supermarkets";
import { getPreferredSupermarketId } from "@/lib/actions/preferences";
import { getCloudinaryStatus } from "@/lib/actions/upload";
import { ProductForm } from "@/components/products/ProductForm";
import { PriceRecordForm } from "@/components/products/PriceRecordForm";
import { PriceHistoryChart } from "@/components/products/PriceHistoryChart";
import { Card } from "@/components/ui/Card";
import { decimalToNumber } from "@/lib/utils";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = await getProductById(id);
  return { title: product?.name ?? "Producto" };
}

export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  const [product, supermarkets, preferredId, { configured }] = await Promise.all([
    getProductById(id),
    getSupermarkets(),
    getPreferredSupermarketId(),
    getCloudinaryStatus(),
  ]);

  if (!product) notFound();

  // Serializamos los Decimal a Number para que Next.js pueda pasarlos al cliente
  const serializedProduct = {
    ...product,
    priceRecords: product.priceRecords.map((r) => ({
      ...r,
      price: decimalToNumber(r.price),
    })),
  };

  const selectedStoreId = preferredId ?? supermarkets[0]?.id ?? null;
  const historyByStore = supermarkets.map((store) => {
    const points = serializedProduct.priceRecords
      .filter((r) => r.supermarketId === store.id)
      .map((r) => ({
        date: r.recordedAt.toISOString(),
        price: r.price,
      }));
    return { store, points };
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-emerald-950">{serializedProduct.name}</h1>
        {serializedProduct.category ? (
          <p className="text-sm text-emerald-600">{serializedProduct.category}</p>
        ) : null}
      </div>

      <Card>
        <h2 className="mb-4 font-semibold">Editar producto</h2>
        <ProductForm product={serializedProduct} cloudinaryEnabled={configured} />
      </Card>

      <Card>
        <h2 className="mb-4 font-semibold">Registrar precio</h2>
        <PriceRecordForm
          productId={serializedProduct.id}
          supermarkets={supermarkets}
          defaultSupermarketId={selectedStoreId}
        />
      </Card>

      <div className="space-y-6">
        <h2 className="text-lg font-semibold text-emerald-950">Histórico de precios</h2>
        {historyByStore.map(({ store, points }) => (
          <Card key={store.id}>
            <h3 className="mb-4 font-medium text-emerald-900">{store.name}</h3>
            <PriceHistoryChart points={points} supermarketName={store.name} />
          </Card>
        ))}
      </div>
    </div>
  );
}
