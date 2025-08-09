import { EstadiasTable } from "~/components/coordinador/asignacion-estadias-page";
import { DashboardLayout } from "~/layouts/DashboardLayout";

export default function AsignacionEstadiasPage() {
  return (
    <DashboardLayout title="Asignación de Estadias" needsSaludo={false}>
      <div>
        <h1>Asignación de Estadias</h1>
        <EstadiasTable />
      </div>
    </DashboardLayout>
  );
}
