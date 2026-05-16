import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { LoginForm } from "@/components/auth/LoginForm";
import { SocialLogin } from "@/components/auth/SocialLogin";

export const metadata = { title: "Iniciar sesión" };

export default function LoginPage() {
  return (
    <main className="mx-auto flex max-w-md flex-1 flex-col justify-center px-4 py-12">
      <Card>
        <h1 className="text-2xl font-bold text-emerald-950">Bienvenido</h1>
        <p className="mt-1 text-sm text-emerald-700">
          Accede a tu cuenta SmartCart
        </p>
        <LoginForm />
        <SocialLogin />
        <p className="mt-4 text-center text-sm text-emerald-700">
          ¿No tienes cuenta?{" "}
          <Link href="/register" className="font-medium text-emerald-600 hover:underline">
            Regístrate
          </Link>
        </p>
      </Card>
    </main>
  );
}
