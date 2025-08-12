import { Button } from "~/components/ui/Button";
import { Download } from "lucide-react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";
import type { Tutoria } from "~/types/tutorias";

interface TutoriaPDFDownloaderProps {
  tutoria: Tutoria;
  profesores: Array<{ id: string; nombre: string; apellido: string }>;
}

// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 20,
    fontSize: 10,
  },
  header: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "center",
  },
  logo: {
    width: 30,
    height: 30,
    backgroundColor: "#006400",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  logoText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "bold",
  },
  titleSection: {
    flex: 1,
  },
  mainTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#006400",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000000",
  },
  isoLogo: {
    width: 24,
    height: 24,
    backgroundColor: "#808080",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  isoText: {
    color: "#ffffff",
    fontSize: 7,
    fontWeight: "bold",
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    marginVertical: 15,
  },
  infoGrid: {
    marginBottom: 25,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  infoLabel: {
    width: 80,
    fontSize: 10,
    fontWeight: "bold",
    marginRight: 10,
  },
  infoValue: {
    flex: 1,
    fontSize: 10,
  },
  table: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    paddingBottom: 5,
    marginBottom: 5,
  },
  headerCell: {
    fontSize: 8,
    fontWeight: "bold",
    textAlign: "center",
  },
  tableSubHeader: {
    flexDirection: "row",
    marginBottom: 10,
  },
  subHeaderCell: {
    fontSize: 6,
    textAlign: "center",
    paddingVertical: 3,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#cccccc",
    paddingVertical: 5,
  },
  cell: {
    fontSize: 7,
    textAlign: "center",
    paddingVertical: 2,
  },
  observations: {
    marginTop: 20,
  },
  observationsLabel: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 10,
  },
  observationsBox: {
    borderWidth: 1,
    borderColor: "#000000",
    padding: 10,
    minHeight: 60,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: "#808080",
  },
});

// Componente del PDF
const TutoriaPDF = ({
  tutoria,
  profesores,
}: {
  tutoria: Tutoria;
  profesores: Array<{ id: string; nombre: string; apellido: string }>;
}) => {
  // Debug: mostrar los datos que llegan
  console.log("=== DEBUG TUTORIA PDF ===");
  console.log("Tutoria completa:", tutoria);
  console.log("nombreTutor:", tutoria.nombreTutor);
  console.log("carrera:", tutoria.carrera);
  console.log("grupo:", tutoria.grupo);
  console.log("cuatrimestre:", tutoria.cuatrimestre);
  console.log("fecha:", tutoria.fecha);
  console.log("Profesores disponibles:", profesores);

  // Acceder a campos que pueden no estar tipados pero existen en el backend
  const tutoriaAny = tutoria as any;
  console.log("cargaAcademica (any):", tutoriaAny.cargaAcademica);
  console.log("profesor (any):", tutoriaAny.profesor);
  console.log("tutor (any):", tutoriaAny.tutor);
  console.log("nombreProfesor (any):", tutoriaAny.nombreProfesor);

  // Función para obtener el nombre del profesor desde diferentes fuentes
  const getNombreProfesor = () => {
    // 1. Intentar desde nombreTutor
    if (tutoria.nombreTutor && tutoria.nombreTutor.trim() !== "") {
      return tutoria.nombreTutor;
    }

    // 2. Intentar desde campos que pueden existir en el backend
    if (tutoriaAny.nombreProfesor && tutoriaAny.nombreProfesor.trim() !== "") {
      return tutoriaAny.nombreProfesor;
    }

    if (tutoriaAny.profesor && tutoriaAny.profesor.trim() !== "") {
      return tutoriaAny.profesor;
    }

    if (tutoriaAny.tutor && tutoriaAny.tutor.trim() !== "") {
      return tutoriaAny.tutor;
    }

    // 3. Intentar desde cargaAcademica.profesorId usando el array de profesores
    if (
      tutoriaAny.cargaAcademica &&
      typeof tutoriaAny.cargaAcademica === "object" &&
      tutoriaAny.cargaAcademica.profesorId
    ) {
      const profesor = profesores.find(
        (p) => p.id === tutoriaAny.cargaAcademica.profesorId
      );
      if (profesor) {
        return `${profesor.nombre} ${profesor.apellido}`;
      }
    }

    // 4. Si no hay nada, mostrar mensaje
    return "No especificado";
  };

  const nombreProfesor = getNombreProfesor();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>UTN</Text>
          </View>
          <View style={styles.titleSection}>
            <Text style={styles.mainTitle}>
              UNIVERSIDAD TECNOLÓGICA DE NOGALES, SONORA
            </Text>
            <Text style={styles.subtitle}>REPORTE BIMESTRAL DEL TUTOR</Text>
          </View>
          <View style={styles.isoLogo}>
            <Text style={styles.isoText}>ISO</Text>
            <Text style={styles.isoText}>9001</Text>
          </View>
        </View>

        {/* Separador */}
        <View style={styles.separator} />

        {/* Información del reporte */}
        <View style={styles.infoGrid}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>NOMBRE DEL TUTOR:</Text>
            <Text style={styles.infoValue}>{nombreProfesor}</Text>
            <Text style={styles.infoLabel}>GRUPO:</Text>
            <Text style={styles.infoValue}>{tutoria.grupo}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>PROGRAMA EDUCATIVO:</Text>
            <Text style={styles.infoValue}>{tutoria.carrera}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>CUATRIMESTRE:</Text>
            <Text style={styles.infoValue}>{tutoria.cuatrimestre}</Text>
            <Text style={styles.infoLabel}>FECHA:</Text>
            <Text style={styles.infoValue}>{tutoria.fecha}</Text>
          </View>
        </View>

        {/* Tabla */}
        <View style={styles.table}>
          {/* Encabezados principales */}
          <View style={styles.tableHeader}>
            <Text style={[styles.headerCell, { width: "8%" }]}>No.</Text>
            <Text style={[styles.headerCell, { width: "18%" }]}>
              Nombre del alumno
            </Text>
            <Text style={[styles.headerCell, { width: "18%" }]}>
              Tipo de vulnerabilidad
            </Text>
            <Text style={[styles.headerCell, { width: "18%" }]}>
              Área de canalización
            </Text>
            <Text style={[styles.headerCell, { width: "12%" }]}>
              Fue atendido
            </Text>
            <Text style={[styles.headerCell, { width: "12%" }]}>
              Presentó mejoría
            </Text>
            <Text style={[styles.headerCell, { width: "14%" }]}>
              Causa de baja
            </Text>
          </View>

          {/* Subencabezados */}
          <View style={styles.tableSubHeader}>
            <Text style={[styles.subHeaderCell, { width: "8%" }]}></Text>
            <Text style={[styles.subHeaderCell, { width: "18%" }]}></Text>
            <Text style={[styles.subHeaderCell, { width: "18%" }]}>
              Académica, Personal, Socio-económica
            </Text>
            <Text style={[styles.subHeaderCell, { width: "18%" }]}>
              1.Asesoría, 2.Médico, 3.Psicólogo, 4.Estudiantiles, 5.Admón,
              6.Vinculación, 7.Dir.Carrera, 8.Otra
            </Text>
            <Text style={[styles.subHeaderCell, { width: "12%" }]}>Sí, No</Text>
            <Text style={[styles.subHeaderCell, { width: "12%" }]}>Sí, No</Text>
            <Text style={[styles.subHeaderCell, { width: "14%" }]}>
              Marcar X si causó baja + causa específica
            </Text>
          </View>

          {/* Filas de datos */}
          {tutoria.detalles && tutoria.detalles.length > 0 ? (
            tutoria.detalles.map((detalle, index) => (
              <View key={detalle.id} style={styles.tableRow}>
                <Text style={[styles.cell, { width: "8%" }]}>{index + 1}</Text>
                <Text style={[styles.cell, { width: "18%" }]}>
                  {detalle.nombreAlumno}
                </Text>
                <Text style={[styles.cell, { width: "18%" }]}>
                  {detalle.vulnerabilidad === "academica" && "Académica"}
                  {detalle.vulnerabilidad === "personal" && "Personal"}
                  {detalle.vulnerabilidad === "socioeconomica" &&
                    "Socio-económica"}
                </Text>
                <Text style={[styles.cell, { width: "18%" }]}>
                  {detalle.areaCanalizacion}
                </Text>
                <Text style={[styles.cell, { width: "12%" }]}>
                  {detalle.fueAtendido ? "Sí" : "No"}
                </Text>
                <Text style={[styles.cell, { width: "12%" }]}>
                  {detalle.presentoMejoria ? "Sí" : "No"}
                </Text>
                <Text style={[styles.cell, { width: "14%" }]}>
                  {detalle.causoBaja ? (
                    <>X - {detalle.causaBaja || "Sin causa especificada"}</>
                  ) : (
                    "No"
                  )}
                </Text>
              </View>
            ))
          ) : (
            <View style={styles.tableRow}>
              <Text
                style={[styles.cell, { width: "100%", textAlign: "center" }]}
              >
                No hay alumnos registrados en esta tutoría
              </Text>
            </View>
          )}
        </View>

        {/* Observaciones */}
        <View style={styles.observations}>
          <Text style={styles.observationsLabel}>
            Observaciones (opcional):
          </Text>
          <View style={styles.observationsBox}>
            {tutoria.observaciones && (
              <Text style={{ fontSize: 8 }}>{tutoria.observaciones}</Text>
            )}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Generado el: {new Date().toLocaleDateString("es-MX")}</Text>
          <Text>Página 1 de 1</Text>
        </View>
      </Page>
    </Document>
  );
};

export function TutoriaPDFDownloader({
  tutoria,
  profesores,
}: TutoriaPDFDownloaderProps) {
  const handleDownload = async () => {
    try {
      const blob = await pdf(
        <TutoriaPDF tutoria={tutoria} profesores={profesores} />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Tutoria_${tutoria.grupo}_${tutoria.cuatrimestre.replace(
        /\s+/g,
        "_"
      )}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generando PDF:", error);
      alert("Error al generar el PDF. Inténtalo de nuevo.");
    }
  };

  return (
    <Button
      onClick={handleDownload}
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
    >
      <Download className="h-4 w-4" />
      Descargar PDF
    </Button>
  );
}
