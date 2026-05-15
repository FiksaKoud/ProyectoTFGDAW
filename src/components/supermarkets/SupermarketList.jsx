import Image from "next/image";
import { MapPin, Trash2 } from "lucide-react";
import { getSupermarkets, deleteSupermarket } from "@/lib/actions/supermarkets";
import { getCloudinaryStatus } from "@/lib/actions/upload";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SupermarketForm } from "@/components/supermarkets/SupermarketForm";

async function DeleteSupermarketButton({ id }) {
  async function remove() {
    "use server";
    await deleteSupermarket(id);
  }

  return (
    <form action={remove}>
      <Button type="submit" variant="ghost" size="sm" aria-label="Eliminar">
        <Trash2 className="h-4 w-4 text-red-600" />
      </Button>
    </form>
  );
}

export async function SupermarketList() {
  const [supermarkets, { configured }] = await Promise.all([
    getSupermarkets(),
    getCloudinaryStatus(),
  ]);

  return (
    <div className="space-y-8">
      <Card>
        <h2 className="mb-4 text-lg font-semibold text-emerald-950">Nueva tienda</h2>
        <SupermarketForm cloudinaryEnabled={configured} />
      </Card>

      {supermarkets.length === 0 ? (
        <p className="text-center text-emerald-700">
          Registra Mercadona, Lidl, Carrefour… para comparar precios.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {supermarkets.map((store) => (
            <li key={store.id}>
              <Card className="flex gap-4">
                {store.logoUrl ? (
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-emerald-50">
                    <Image
                      src={store.logoUrl}
                      alt={store.name}
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                ) : (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-lg font-bold text-emerald-700">
                    {store.name.charAt(0)}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-emerald-950">{store.name}</h3>
                    <DeleteSupermarketButton id={store.id} />
                  </div>
                  {store.location ? (
                    <p className="mt-1 flex items-center gap-1 text-sm text-emerald-700">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      {store.location}
                    </p>
                  ) : null}
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
