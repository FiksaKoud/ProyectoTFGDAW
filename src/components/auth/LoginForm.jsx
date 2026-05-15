"use client";

import { useState, useTransition } from "react";
import { loginUser } from "@/lib/actions/auth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function LoginForm() {
  const [error, setError] = useState(null);
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="mt-6 space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        setError(null);
        startTransition(async () => {
          const result = await loginUser(fd);
          if (result && !result.success) {
            setError(result.error);
          }
        });
      }}
    >
      <Input name="email" label="Email" type="email" required autoComplete="email" />
      <Input
        name="password"
        label="Contraseña"
        type="password"
        required
        autoComplete="current-password"
      />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Entrando…" : "Entrar"}
      </Button>
    </form>
  );
}
