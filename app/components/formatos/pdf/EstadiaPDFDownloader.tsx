import React from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { EstadiaPDFReport } from "./EstadiaPDFReport";
import type { Estadia } from "~/types/estadias";

interface EstadiaPDFDownloaderProps {
  estadia: Estadia;
  children: React.ReactNode;
  filename?: string;
}

export function EstadiaPDFDownloader({
  estadia,
  children,
  filename,
}: EstadiaPDFDownloaderProps) {
  const defaultFilename = `Reporte_Estadia_${estadia.periodo}_${
    estadia.profesor?.nombre || "Profesor"
  }.pdf`;

  return (
    <PDFDownloadLink
      document={<EstadiaPDFReport estadia={estadia} />}
      fileName={filename || defaultFilename}
    >
      {({ loading, error }) => {
        if (loading) {
          return (
            <div className="opacity-50 cursor-not-allowed">{children}</div>
          );
        }

        if (error) {
          console.error("Error generando PDF:", error);
          return (
            <div
              className="opacity-50 cursor-not-allowed"
              title="Error generando PDF"
            >
              {children}
            </div>
          );
        }

        return children;
      }}
    </PDFDownloadLink>
  );
}
