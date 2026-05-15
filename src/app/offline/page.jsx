import Link from "next/link";
import { WifiOff } from "lucide-react";
import { Card } from "@/components/ui/Card";

export const metadata = { title: "Sin conexión" };

export default function OfflinePage() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 py-12">
      <Card className="text-center">
        <WifiOff className="mx-auto mb-4 h-12 w-12 text-emerald-600" />
        <h1 className="text-xl font-bold text-emerald-950">Estás sin conexión</h1>
        <p className="mt-2 text-sm text-emerald-700">
          SmartCart guarda datos en caché para que puedas consultar listas y
          productos en la tienda. Vuelve a conectarte para sincronizar precios nuevos.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex h-11 items-center rounded-xl bg-emerald-600 px-5 text-sm font-medium text-white hover:bg-emerald-700"
        >
          Ir al panel
        </Link>
      </Card>
    </main>
  );
}
