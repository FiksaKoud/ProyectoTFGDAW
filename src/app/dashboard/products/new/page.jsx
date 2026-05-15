import { ProductForm } from "@/components/products/ProductForm";
import { Card } from "@/components/ui/Card";
import { getCloudinaryStatus } from "@/lib/actions/upload";

export const metadata = { title: "Nuevo producto" };

export default async function NewProductPage() {
  const { configured } = await getCloudinaryStatus();

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-2xl font-bold text-emerald-950">Nuevo producto</h1>
      <Card>
        <ProductForm cloudinaryEnabled={configured} />
      </Card>
    </div>
  );
}
