import React from "react";
import { PDFDownloadLink, pdf } from "@react-pdf/renderer";
import { ProgramacionCursosDocument } from "./programacion-cursos";
import type { SeguimientoCurso } from "~/types/programacion-curso";
import { Button } from "~/components/ui/Button";
import { Download } from "lucide-react";

interface PDFDownloaderProps {
  seguimientos: SeguimientoCurso[];
  titulo?: string;
  filtros?: {
    estado?: string;
    cuatrimestreId?: string;
    profesorId?: string;
    carrera?: string;
    search?: string;
  };
  children?: React.ReactNode;
}

export const PDFDownloader: React.FC<PDFDownloaderProps> = ({
  seguimientos,
  titulo,
  filtros,
  children,
}) => {
  const handleDownload = async () => {
    try {
      // Generar el PDF
      const pdfBlob = await pdf(
        <ProgramacionCursosDocument
          seguimientos={seguimientos}
          titulo={titulo}
          filtros={filtros}
        />
      ).toBlob();

      // Crear URL del blob
      const url = URL.createObjectURL(pdfBlob);

      // Crear enlace de descarga
      const link = document.createElement("a");
      link.href = url;
      link.download = `programacion-cursos-${
        new Date().toISOString().split("T")[0]
      }.pdf`;

      // Simular clic
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Limpiar URL
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al generar PDF:", error);
      alert("Error al generar el PDF");
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={seguimientos.length === 0}
      variant="outline"
      className="flex items-center space-x-2"
    >
      <Download className="h-4 w-4" />
      {children || "Descargar PDF"}
    </Button>
  );
};

// Componente alternativo usando PDFDownloadLink (más directo)
export const PDFDownloadLinkComponent: React.FC<PDFDownloaderProps> = ({
  seguimientos,
  titulo,
  filtros,
  children,
}) => {
  if (seguimientos.length === 0) {
    return (
      <Button
        disabled
        variant="outline"
        className="flex items-center space-x-2"
      >
        <Download className="h-4 w-4" />
        {children || "Descargar PDF"}
      </Button>
    );
  }

  return (
    <PDFDownloadLink
      document={
        <ProgramacionCursosDocument
          seguimientos={seguimientos}
          titulo={titulo}
          filtros={filtros}
        />
      }
      fileName={`programacion-cursos-${
        new Date().toISOString().split("T")[0]
      }.pdf`}
    >
      {({ loading }) => (
        <Button
          disabled={loading}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <Download className="h-4 w-4" />
          {loading ? "Generando..." : children || "Descargar PDF"}
        </Button>
      )}
    </PDFDownloadLink>
  );
};
