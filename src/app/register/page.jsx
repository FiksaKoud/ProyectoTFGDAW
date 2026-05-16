"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/actions/auth";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { SocialLogin } from "@/components/auth/SocialLogin";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [pending, startTransition] = useTransition();

  return (
    <main className="mx-auto flex max-w-md flex-1 flex-col justify-center px-4 py-12">
      <Card>
        <h1 className="text-2xl font-bold text-emerald-950">Crear cuenta</h1>
        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            setError(null);
            startTransition(async () => {
              const result = await registerUser(fd);
              if (!result.success) {
                setError(result.error);
                return;
              }
              router.push("/login?registered=1");
            });
          }}
        >
          <Input name="name" label="Nombre" placeholder="Tu nombre" />
          <Input name="email" label="Email" type="email" required />
          <Input name="password" label="Contraseña" type="password" required minLength={6} />
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Creando…" : "Registrarse"}
          </Button>
        </form>
        <SocialLogin />
        <p className="mt-4 text-center text-sm text-emerald-700">
          <Link href="/login" className="font-medium text-emerald-600 hover:underline">
            Volver al login
          </Link>
        </p>
      </Card>
    </main>
  );
}
