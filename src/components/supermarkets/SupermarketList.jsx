import Image from "next/image";
import { MapPin } from "lucide-react";
import { obtenerSupermercados } from "@/lib/actions/supermercados";
import { getCloudinaryStatus } from "@/lib/actions/upload";
import { Card } from "@/components/ui/Card";
import { FormularioSupermercado } from "@/components/supermarkets/SupermarketForm";
import { BotonEliminarSupermercado } from "@/components/supermarkets/DeleteSupermarketButton";

import { redirect } from "next/navigation";
import { establecerSupermercadoPreferido } from "@/lib/actions/preferencias";

export async function ListaSupermercados() {
  const [supermercados, { configured }] = await Promise.all([
    obtenerSupermercados(),
    getCloudinaryStatus(),
  ]);

  return (
    <div className="space-y-8">
      <Card>
        <h2 className="mb-4 text-lg font-semibold text-emerald-950">Nueva tienda</h2>
        <FormularioSupermercado cloudinaryHabilitado={configured} />
      </Card>

      {supermercados.length === 0 ? (
        <p className="text-center text-emerald-700">
          Registra Mercadona, Lidl, Carrefour… para comparar precios.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {supermercados.map((tienda) => (
            <li key={tienda.id}>
              <Card className="flex items-center gap-4 p-0 overflow-hidden">
                <form
                  action={async () => {
                    "use server";
                    await establecerSupermercadoPreferido(tienda.id);
                    redirect("/dashboard/productos");
                  }}
                  className="flex flex-1 items-center gap-4 p-4 transition-colors hover:bg-emerald-50/50"
                >
                  <button type="submit" className="flex flex-1 items-center gap-4 text-left">
                    {tienda.logoUrl ? (
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-emerald-50">
                        <Image
                          src={tienda.logoUrl}
                          alt={tienda.name}
                          fill
                          className="object-contain p-1"
                        />
                      </div>
                    ) : (
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-lg font-bold text-emerald-700">
                        {tienda.name.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-emerald-950">{tienda.name}</h3>
                      {tienda.location ? (
                        <p className="mt-1 flex items-center gap-1 text-sm text-emerald-700">
                          <MapPin className="h-3.5 w-3.5 shrink-0" />
                          {tienda.location}
                        </p>
                      ) : null}
                    </div>
                  </button>
                </form>
                <div className="pr-4">
                  <BotonEliminarSupermercado id={tienda.id} />
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
