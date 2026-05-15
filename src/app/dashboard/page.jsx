import Link from "next/link";
import { Package, Scale, Store } from "lucide-react";
import { auth } from "@/lib/auth";
import { getSupermarkets } from "@/lib/actions/supermarkets";
import { getProducts } from "@/lib/actions/products";
import { getShoppingLists } from "@/lib/actions/shopping-lists";
import { SupermarketSelector } from "@/components/supermarkets/SupermarketSelector";
import { getPreferredSupermarketId } from "@/lib/actions/preferences";
import { Card } from "@/components/ui/Card";

export const metadata = { title: "Panel" };

export default async function DashboardPage() {
  const session = await auth();
  const [supermarkets, products, lists, preferredId] = await Promise.all([
    getSupermarkets(),
    getProducts(),
    getShoppingLists(),
    getPreferredSupermarketId(),
  ]);

  const stats = [
    { label: "Supermercados", value: supermarkets.length, href: "/dashboard/supermarkets", icon: Store },
    { label: "Productos", value: products.length, href: "/dashboard/products", icon: Package },
    { label: "Listas", value: lists.length, href: "/dashboard/lists", icon: Scale },
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
        <SupermarketSelector
          supermarkets={supermarkets}
          selectedId={preferredId ?? supermarkets[0]?.id ?? null}
        />
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, href, icon: Icon }) => (
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
        href="/dashboard/compare"
        className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-4 font-semibold text-white hover:bg-emerald-700"
      >
        <Scale className="h-5 w-5" />
        Comparar cesta ahora
      </Link>
    </div>
  );
}
