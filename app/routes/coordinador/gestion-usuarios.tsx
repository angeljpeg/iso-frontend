import { DashboardLayout } from "~/layouts/DashboardLayout";

export default function GestionUsuariosPage() {
  return (
    <DashboardLayout title="Gestion de Usuarios" needsSaludo={false}>
      <div>
        <h1>Gestionar Usuarios</h1>
      </div>
    </DashboardLayout>
  );
}
