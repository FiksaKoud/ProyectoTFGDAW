"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  crearSupermercado,
  actualizarSupermercado,
} from "@/lib/actions/supermercados";
import { ImageUpload } from "@/components/products/ImageUpload";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function FormularioSupermercado({
  supermercado,
  cloudinaryHabilitado = false,
}) {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [pendiente, iniciarTransicion] = useTransition();
  const [formKey, setFormKey] = useState(Date.now());

  function alEnviar(formData) {
    setError(null);
    iniciarTransicion(async () => {
      const resultado = supermercado
        ? await actualizarSupermercado(supermercado.id, formData)
        : await crearSupermercado(formData);

      if (!resultado.success) {
        setError(resultado.error);
        return;
      }
      
      if (!supermercado) {
        // Al crear uno nuevo, forzamos que se vacíe todo
        setFormKey(Date.now());
      }
      
      router.refresh();
    });
  }

  return (
    <form key={formKey} action={alEnviar} className="space-y-4">
      <Input
        name="name"
        label="Nombre"
        defaultValue={supermercado?.name}
        required
        placeholder="Ej. Mercadona"
      />

      <ImageUpload
        variant="supermarket"
        defaultUrl={supermercado?.logoUrl}
        uploadEnabled={cloudinaryHabilitado}
      />

      {!cloudinaryHabilitado ? (
        <Input
          name="logoUrl"
          label="URL del logo"
          type="url"
          defaultValue={supermercado?.logoUrl ?? ""}
          placeholder="https://..."
        />
      ) : null}

      <Input
        name="location"
        label="Ubicación"
        defaultValue={supermercado?.location ?? ""}
        placeholder="Ej. Calle Mayor 12, Madrid"
      />

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button type="submit" disabled={pendiente}>
        {pendiente ? "Guardando…" : supermercado ? "Actualizar" : "Añadir tienda"}
      </Button>
    </form>
  );
}
