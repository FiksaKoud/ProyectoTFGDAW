import { requireAdmin, auth } from "@/lib/auth";
import { getUsers } from "@/lib/actions/users";
import { Users, Mail, Calendar } from "lucide-react";
import { UserRoleToggle } from "@/components/auth/UserRoleToggle";
import { DeleteUserButton } from "@/components/auth/DeleteUserButton";

export const metadata = {
  title: "Gestión de Usuarios - SmartCart Admin",
};

export default async function UsersPage() {
  const currentAdminId = await requireAdmin();
  const users = await getUsers();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-emerald-900 flex items-center gap-3">
          <Users className="h-8 w-8 text-emerald-600" />
          Gestión de Usuarios
        </h1>
        <p className="text-emerald-600">
          Administra los permisos y las cuentas de los usuarios de la plataforma.
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-emerald-50 bg-emerald-50/30 text-emerald-900 font-semibold">
                <th className="px-6 py-4">Usuario</th>
                <th className="px-6 py-4">Rol</th>
                <th className="px-6 py-4">Actividad</th>
                <th className="px-6 py-4">Registro</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-50">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-emerald-50/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 overflow-hidden rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                        {user.image ? (
                          <img src={user.image} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <span className="font-bold text-emerald-600">
                            {(user.name?.[0] ?? user.email?.[0]).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-emerald-900 truncate">
                          {user.name || "Sin nombre"}
                        </span>
                        <span className="text-xs text-emerald-500 flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <UserRoleToggle user={user} />
                  </td>
                  <td className="px-6 py-4 text-sm text-emerald-700">
                    <div className="flex flex-col gap-1 text-xs">
                      <span>{user._count.products} productos</span>
                      <span>{user._count.shoppingLists} listas</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-emerald-600">
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Intl.DateTimeFormat('es-ES').format(user.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DeleteUserButton
                      userId={user.id}
                      userName={user.name || user.email}
                      isCurrentUser={user.id === currentAdminId}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
