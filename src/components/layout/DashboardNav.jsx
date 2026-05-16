"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ListChecks,
  Package,
  Scale,
  Store,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Inicio", icon: LayoutDashboard },
  { href: "/dashboard/supermercados", label: "Tiendas", icon: Store },
  { href: "/dashboard/productos", label: "Productos", icon: Package },
  { href: "/dashboard/listas", label: "Listas", icon: ListChecks },
  { href: "/dashboard/comparar", label: "Comparar", icon: Scale },
  { href: "/dashboard/perfil", label: "Perfil", icon: User },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-emerald-100 bg-white/95 backdrop-blur md:static md:border-0 md:bg-transparent md:backdrop-blur-none">
      <ul className="mx-auto flex max-w-6xl items-stretch justify-around gap-1 px-2 py-2 md:flex-col md:justify-start md:gap-2 md:px-0 md:py-0">
        {links.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href ||
            (href !== "/dashboard" && pathname.startsWith(href));

          return (
            <li key={href} className="flex-1 md:flex-none">
              <Link
                href={href}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-xs font-medium transition md:flex-row md:gap-3 md:px-4 md:py-3 md:text-sm",
                  active
                    ? "bg-emerald-600 text-white md:bg-emerald-50 md:text-emerald-900"
                    : "text-emerald-700 hover:bg-emerald-50",
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
