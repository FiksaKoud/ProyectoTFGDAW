import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { User, Mail, Calendar, Shield } from "lucide-react";
import { ProfileForm } from "@/components/auth/ProfileForm";
import { LogoutButton } from "@/components/layout/LogoutButton";
import { isCloudinaryConfigured } from "@/lib/cloudinary";

export const metadata = {
  title: "Mi Perfil - SmartCart",
  description: "Gestiona tu información de perfil y preferencias",
};

export default async function ProfilePage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      _count: {
        select: {
          products: true,
          shoppingLists: true,
          supermarkets: true,
        }
      }
    }
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-emerald-900">Mi Perfil</h1>
        <p className="text-emerald-600">
          Gestiona tu información personal y revisa tu actividad.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Profile Info Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm transition-all hover:shadow-md">
            <div className="h-24 bg-gradient-to-r from-emerald-500 to-teal-500" />
            <div className="relative flex flex-col items-center px-6 pb-6 text-center">
              <div className="absolute -top-12 h-24 w-24 overflow-hidden rounded-2xl border-4 border-white bg-emerald-100 shadow-sm">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name || "Usuario"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-emerald-600">
                    <User className="h-12 w-12" />
                  </div>
                )}
              </div>
              
              <div className="mt-20 space-y-1">
                <h2 className="text-xl font-bold text-emerald-900">{user.name || "Usuario"}</h2>
                <p className="text-sm text-emerald-600 break-all">{user.email}</p>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-4 border-t border-emerald-50 pt-6 text-center">
                <div>
                  <p className="text-lg font-bold text-emerald-900">{user._count.products}</p>
                  <p className="text-xs text-emerald-500 uppercase tracking-wider">Productos</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-emerald-900">{user._count.shoppingLists}</p>
                  <p className="text-xs text-emerald-500 uppercase tracking-wider">Listas</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-emerald-900">{user._count.supermarkets}</p>
                  <p className="text-xs text-emerald-500 uppercase tracking-wider">Tiendas</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-emerald-100 bg-emerald-50/50 p-6">
            <h3 className="mb-4 flex items-center gap-2 font-semibold text-emerald-900">
              <Shield className="h-4 w-4" />
              Seguridad
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-emerald-500" />
                <span className="text-emerald-700">
                  Miembro desde: {new Intl.DateTimeFormat('es-ES').format(user.createdAt)}
                </span>
              </div>
              <LogoutButton />
            </div>
          </div>
        </div>

        {/* Right Column: Edit Form */}
        <div className="lg:col-span-2">
          <div className="rounded-3xl border border-emerald-100 bg-white p-8 shadow-sm">
            <h3 className="mb-6 text-xl font-bold text-emerald-900">Editar Información</h3>
            <ProfileForm user={user} uploadEnabled={isCloudinaryConfigured()} />
          </div>
        </div>
      </div>
    </div>
  );
}
