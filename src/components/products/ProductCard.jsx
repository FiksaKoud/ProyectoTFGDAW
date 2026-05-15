import Image from "next/image";
import Link from "next/link";
import { Tag } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { formatCurrency, decimalToNumber } from "@/lib/utils";

export function ProductCard({
  id,
  name,
  category,
  imageCloudinary,
  latestPrice,
}) {
  return (
    <Link href={`/dashboard/products/${id}`}>
      <Card className="group h-full transition hover:-translate-y-0.5 hover:shadow-md hover:shadow-emerald-900/10">
        <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-xl bg-emerald-50">
          {imageCloudinary ? (
            <Image
              src={imageCloudinary}
              alt={name}
              fill
              className="object-cover transition group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-emerald-300">
              <Tag className="h-12 w-12" />
            </div>
          )}
        </div>
        <h3 className="font-semibold text-emerald-950">{name}</h3>
        {category ? (
          <p className="mt-1 text-xs font-medium uppercase tracking-wide text-emerald-600">
            {category}
          </p>
        ) : null}
        {latestPrice ? (
          <p className="mt-3 text-sm text-emerald-800">
            Desde{" "}
            <span className="font-bold text-emerald-950">
              {formatCurrency(decimalToNumber(latestPrice.price))}
            </span>{" "}
            en {latestPrice.supermarket.name}
          </p>
        ) : (
          <p className="mt-3 text-sm text-amber-700">Sin precios registrados</p>
        )}
      </Card>
    </Link>
  );
}
