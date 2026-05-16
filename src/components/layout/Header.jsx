import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LogoutButton } from "@/components/layout/LogoutButton";

export async function Header() {
  const session = await auth();
  const user = session?.user
    ? await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { name: true, email: true, image: true },
      })
    : null;

  return (
    <header className="sticky top-0 z-40 border-b border-emerald-100/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href={session ? "/dashboard" : "/"} className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white">
            <ShoppingCart className="h-5 w-5" />
          </span>
          <span className="text-lg font-bold tracking-tight text-emerald-950">
            SmartCart
          </span>
        </Link>

        {user ? (
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/perfil"
              className="group flex items-center gap-2 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-1 pr-3 transition-all hover:bg-emerald-100 hover:shadow-sm active:scale-95"
            >
              <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-xl bg-emerald-600 font-bold text-white shadow-sm transition-transform group-hover:scale-105">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name || ""}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  (user.name?.[0] ?? user.email?.[0]).toUpperCase()
                )}
              </div>
              <span className="hidden text-sm font-semibold text-emerald-800 sm:inline">
                {user.name ?? "Mi Perfil"}
              </span>
            </Link>
            <LogoutButton />
          </div>
        ) : (
          <Link
            href="/login"
            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            Entrar
          </Link>
        )}
      </div>
    </header>
  );
}
