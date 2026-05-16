import Link from "next/link";
import { Package, Scale, Store } from "lucide-react";
import { auth } from "@/lib/auth";
import { obtenerSupermercados } from "@/lib/actions/supermercados";
import { obtenerProductos } from "@/lib/actions/productos";
import { obtenerListasCompra } from "@/lib/actions/listas-compra";
import { SelectorSupermercado } from "@/components/supermarkets/SupermarketSelector";
import { obtenerIdSupermercadoPreferido } from "@/lib/actions/preferencias";
import { Card } from "@/components/ui/Card";

export const metadata = { title: "Panel" };

export default async function PaginaPanelPrincipal() {
  const session = await auth();
  const [supermercados, productos, listas, idPreferido] = await Promise.all([
    obtenerSupermercados(),
    obtenerProductos(),
    obtenerListasCompra(),
    obtenerIdSupermercadoPreferido(),
  ]);

  const estadisticas = [
    { label: "Supermercados", value: supermercados.length, href: "/dashboard/supermercados", icon: Store },
    { label: "Productos", value: productos.length, href: "/dashboard/productos", icon: Package },
    { label: "Listas", value: listas.length, href: "/dashboard/listas", icon: Scale },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-emerald-950">
          Hola, {session?.user?.name ?? "comprador"}
        </h1>
        <p className="mt-1 text-emerald-700">
          Gestiona precios y compara tu cesta en segundos.
        </p>
      </div>

      <Card>
        <SelectorSupermercado
          supermercados={supermercados}
          idSeleccionado={idPreferido ?? supermercados[0]?.id ?? null}
        />
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        {estadisticas.map(({ label, value, href, icon: Icon }) => (
          <Link key={href} href={href}>
            <Card className="transition hover:shadow-md">
              <Icon className="mb-2 h-6 w-6 text-emerald-600" />
              <p className="text-3xl font-bold">{value}</p>
              <p className="text-sm text-emerald-700">{label}</p>
            </Card>
          </Link>
        ))}
      </div>

      <Link
        href="/dashboard/comparar"
        className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-4 font-semibold text-white hover:bg-emerald-700"
      >
        <Scale className="h-5 w-5" />
        Comparar cesta ahora
      </Link>
    </div>
  );
}
