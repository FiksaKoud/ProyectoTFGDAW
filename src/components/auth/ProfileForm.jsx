"use client";

import { useState, useTransition } from "react";
import { updateProfile } from "@/lib/actions/profile";
import { User, Mail, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { ImageUpload } from "@/components/products/ImageUpload";

export function ProfileForm({ user, uploadEnabled }) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState(null);

  async function handleSubmit(formData) {
    setStatus(null);
    startTransition(async () => {
      const result = await updateProfile(formData);
      if (result.success) {
        setStatus({ type: "success", message: "Perfil actualizado correctamente" });
      } else {
        setStatus({ type: "error", message: result.error });
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="mx-auto max-w-[200px]">
          <ImageUpload
            variant="profile"
            defaultUrl={user.image}
            uploadEnabled={uploadEnabled}
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="name"
            className="text-sm font-medium leading-none text-emerald-900 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Nombre completo
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-500" />
            <input
              id="name"
              name="name"
              type="text"
              defaultValue={user.name || ""}
              placeholder="Tu nombre"
              className="flex h-12 w-full rounded-2xl border border-emerald-100 bg-white px-10 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-sm font-medium leading-none text-emerald-900 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Correo electrónico
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-500" />
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={user.email}
              required
              placeholder="tu@email.com"
              className="flex h-12 w-full rounded-2xl border border-emerald-100 bg-white px-10 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>
      </div>

      {status && (
        <div
          className={`flex items-center gap-2 rounded-2xl p-4 text-sm animate-in fade-in zoom-in-95 duration-300 ${
            status.type === "success"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
              : "bg-red-50 text-red-700 border border-red-100"
          }`}
        >
          {status.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0" />
          )}
          <p>{status.message}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-12 w-full items-center justify-center gap-2 whitespace-nowrap rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition-all hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95"
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Guardando cambios...
          </>
        ) : (
          "Guardar cambios"
        )}
      </button>
    </form>
  );
}
