"use client";

import { useTransition } from "react";
import { updateUserRole } from "@/lib/actions/users";
import { Shield, User, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function UserRoleToggle({ user, isCurrentUser }) {
  const [isPending, startTransition] = useTransition();

  const toggleRole = () => {
    if (isCurrentUser) return;
    const newRole = user.role === "ADMIN" ? "USER" : "ADMIN";
    startTransition(async () => {
      await updateUserRole(user.id, newRole);
    });
  };

  return (
    <button
      onClick={toggleRole}
      disabled={isPending || isCurrentUser}
      className={cn(
        "flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold transition-all disabled:opacity-50",
        user.role === "ADMIN"
          ? "bg-emerald-100 text-emerald-700"
          : "bg-gray-100 text-gray-600",
        !isCurrentUser && (user.role === "ADMIN" ? "hover:bg-emerald-200" : "hover:bg-gray-200")
      )}
    >

      {isPending ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : user.role === "ADMIN" ? (
        <Shield className="h-3 w-3" />
      ) : (
        <User className="h-3 w-3" />
      )}
      {user.role}
    </button>
  );
}
