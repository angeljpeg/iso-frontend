import { GruposTable } from "~/components/coordinador/gestion-grupos-page";
import { DashboardLayout } from "~/layouts/DashboardLayout";

export default function GestionGrupos() {
  return (
    <DashboardLayout needsSaludo={false}>
      <div>
        <h1>Gestionar Grupos</h1>
        <GruposTable />
      </div>
    </DashboardLayout>
  );
}
