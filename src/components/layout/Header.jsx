import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { auth } from "@/lib/auth";
import { LogoutButton } from "@/components/layout/LogoutButton";

export async function Header() {
  const session = await auth();

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

        {session?.user ? (
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-emerald-700 sm:inline">
              {session.user.name ?? session.user.email}
            </span>
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
