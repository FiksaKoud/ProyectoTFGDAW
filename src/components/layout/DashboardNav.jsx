"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  LayoutDashboard,
  ListChecks,
  Package,
  Scale,
  Store,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Inicio", icon: LayoutDashboard },
  { href: "/dashboard/supermarkets", label: "Tiendas", icon: Store },
  { href: "/dashboard/products", label: "Productos", icon: Package },
  { href: "/dashboard/lists", label: "Listas", icon: ListChecks },
  { href: "/dashboard/compare", label: "Comparar", icon: Scale },
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
        <li className="hidden md:list-item">
          <Link
            href="/dashboard/products"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
          >
            <BarChart3 className="h-5 w-5" />
            Histórico
          </Link>
        </li>
      </ul>
    </nav>
  );
}
