"use client";

import { useTransition } from "react";
import { deleteUser } from "@/lib/actions/users";
import { Trash2, Loader2 } from "lucide-react";

export function DeleteUserButton({ userId, userName, isCurrentUser }) {
  const [isPending, startTransition] = useTransition();

  if (isCurrentUser) {
    return (
      <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600 border border-emerald-100">
        Eres tú
      </span>
    );
  }

  const handleDelete = () => {
    if (confirm(`¿Estás seguro de que quieres eliminar a ${userName}? Esta acción no se puede deshacer.`)) {
      startTransition(async () => {
        const result = await deleteUser(userId);
        if (result && !result.success) {
          alert(result.error);
        }
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all disabled:opacity-50"
      title="Eliminar usuario"
    >
      {isPending ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <Trash2 className="h-5 w-5" />
      )}
    </button>
  );
}
