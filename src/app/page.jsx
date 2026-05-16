import Link from "next/link";
import { ArrowRight, BarChart3, Scale, Store } from "lucide-react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-20">
      <section className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-emerald-950 sm:text-5xl">
          Compara tu cesta entre supermercados y{" "}
          <span className="text-emerald-600">ahorra de verdad</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-emerald-800">
          Registra precios por tienda, guarda el histórico y descubre dónde te
          sale más barata tu lista de la compra.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/register"
            className="inline-flex h-12 items-center gap-2 rounded-xl bg-emerald-600 px-6 font-medium text-white hover:bg-emerald-700"
          >
            Empezar gratis
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/login"
            className="inline-flex h-12 items-center rounded-xl border border-emerald-300 px-6 font-medium text-emerald-900 hover:bg-white"
          >
            Ya tengo cuenta
          </Link>
        </div>
      </section>

      <section className="mt-20 grid gap-6 sm:grid-cols-3">
        {[
          {
            icon: Store,
            title: "Multi-tienda",
            text: "Perfiles de Mercadona, Lidl, Carrefour y más.",
          },
          {
            icon: Scale,
            title: "Comparador",
            text: "Total de tu lista en cada supermercado al instante.",
          },
          {
            icon: BarChart3,
            title: "Histórico",
            text: "Gráficas de evolución de precios con Chart.js.",
          },
        ].map(({ icon: Icon, title, text }) => (
          <article
            key={title}
            className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm"
          >
            <Icon className="mb-4 h-8 w-8 text-emerald-600" />
            <h2 className="font-semibold text-emerald-950">{title}</h2>
            <p className="mt-2 text-sm text-emerald-700">{text}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
