import { FormularioProducto } from "@/components/products/ProductForm";
import { Card } from "@/components/ui/Card";
import { getCloudinaryStatus } from "@/lib/actions/upload";
import { obtenerSupermercados } from "@/lib/actions/supermercados";
import { obtenerIdSupermercadoPreferido } from "@/lib/actions/preferencias";

export const metadata = { title: "Nuevo producto" };

export default async function PaginaNuevoProducto() {
  const [ { configured }, supermercados, idPreferido ] = await Promise.all([
    getCloudinaryStatus(),
    obtenerSupermercados(),
    obtenerIdSupermercadoPreferido(),
  ]);

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-2xl font-bold text-emerald-950">Nuevo producto</h1>
      <Card>
        <FormularioProducto 
          cloudinaryHabilitado={configured} 
          supermercados={supermercados}
          idSupermercadoDefecto={idPreferido}
        />
      </Card>
    </div>
  );
}
