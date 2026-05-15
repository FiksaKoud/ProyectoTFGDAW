"use client";

import { logoutUser } from "@/lib/actions/auth";
import { Button } from "@/components/ui/Button";

export function LogoutButton() {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => logoutUser()}
    >
      Salir
    </Button>
  );
}
