import React from "react";
import { Button } from "~/components/ui/Button";
import { Download } from "lucide-react";
import type { SeguimientoCurso } from "~/types/programacion-curso";
import { ProgramacionCursosDocument } from "./programacion-cursos";

interface PDFDownloadButtonProps {
  seguimiento: SeguimientoCurso;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outline" | "ghost";
}

export function PDFDownloadButton({
  seguimiento,
  className = "",
  size = "sm",
  variant = "outline",
}: PDFDownloadButtonProps) {
  const handleDownload = async () => {
    try {
      // Importar dinámicamente para evitar problemas de SSR
      const { pdf } = await import("@react-pdf/renderer");

      // Crear el PDF
      const blob = await pdf(
        <ProgramacionCursosDocument
          seguimientos={[seguimiento]}
          titulo={`Seguimiento de Curso - ${
            seguimiento.cargaAcademica?.asignatura || "N/A"
          }`}
          filtros={{
            estado: seguimiento.estado,
            cuatrimestreId: seguimiento.cuatrimestre?.id,
            profesorId: seguimiento.cargaAcademica?.profesorId,
            carrera: seguimiento.cargaAcademica?.carrera,
          }}
        />
      ).toBlob();

      // Crear URL del blob y descargar
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `seguimiento-${
        seguimiento.cargaAcademica?.asignatura || "curso"
      }-${seguimiento.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al generar PDF:", error);
      alert("Error al generar el PDF. Inténtalo de nuevo.");
    }
  };

  return (
    <Button
      variant={variant}
      size={size as "default" | "sm" | "lg" | "icon" | null | undefined}
      onClick={handleDownload}
      className={className}
      title="Descargar PDF"
    >
      <Download className="h-4 w-4" />
    </Button>
  );
}
