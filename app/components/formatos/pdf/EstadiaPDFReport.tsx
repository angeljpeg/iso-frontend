import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { Estadia } from "~/types/estadias";

// Registrar fuentes (opcional, usar fuentes del sistema por defecto)
Font.register({
  family: "Helvetica",
  fonts: [{ src: "Helvetica" }, { src: "Helvetica-Bold", fontWeight: "bold" }],
});

// Estilos del PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 40,
    fontFamily: "Helvetica",
  },

  // Header
  header: {
    flexDirection: "row",
    marginBottom: 30,
    alignItems: "center",
  },

  logoSection: {
    width: 80,
    alignItems: "center",
  },

  logoText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2563eb",
    marginBottom: 4,
  },

  logoSubtext: {
    fontSize: 8,
    color: "#6b7280",
    textAlign: "center",
  },

  titleSection: {
    flex: 1,
    alignItems: "center",
    marginLeft: 20,
  },

  universityName: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },

  departmentText: {
    fontSize: 10,
    marginBottom: 4,
    textAlign: "center",
  },

  mainTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
    textTransform: "uppercase",
  },

  // Información del profesor
  professorSection: {
    marginBottom: 30,
    borderBottom: "1 solid #e5e7eb",
    paddingBottom: 15,
  },

  professorLabel: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 8,
  },

  professorName: {
    fontSize: 12,
    borderBottom: "1 solid #000",
    paddingBottom: 4,
    minHeight: 20,
  },

  // Tabla principal
  table: {
    marginBottom: 30,
  },

  tableHeader: {
    flexDirection: "row",
    borderBottom: "2 solid #000",
    paddingBottom: 8,
    marginBottom: 15,
  },

  studentNameHeader: {
    width: "30%",
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
  },

  monthHeader: {
    width: "17.5%",
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
  },

  // Filas de la tabla
  tableRow: {
    flexDirection: "row",
    borderBottom: "1 solid #e5e7eb",
    paddingVertical: 8,
    minHeight: 30,
  },

  studentNameCell: {
    width: "30%",
    fontSize: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRight: "1 solid #e5e7eb",
  },

  monthCell: {
    width: "17.5%",
    fontSize: 10,
    paddingHorizontal: 4,
    paddingVertical: 4,
    borderRight: "1 solid #e5e7eb",
  },

  // Subcolumnas de mes
  monthSubHeader: {
    fontSize: 8,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
  },

  progressSubHeader: {
    fontSize: 8,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
  },

  actionsSubHeader: {
    fontSize: 8,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
  },

  // Subcolumnas
  progressCell: {
    width: "50%",
    fontSize: 8,
    textAlign: "center",
    paddingVertical: 2,
  },

  actionsCell: {
    width: "50%",
    fontSize: 8,
    textAlign: "center",
    paddingVertical: 2,
  },

  // Footer
  footer: {
    marginTop: 30,
    fontSize: 10,
    color: "#6b7280",
    textAlign: "center",
  },
});

interface EstadiaPDFReportProps {
  estadia: Estadia;
}

export function EstadiaPDFReport({ estadia }: EstadiaPDFReportProps) {
  const alumnos = estadia.alumnos || [];

  // Generar filas de la tabla
  const generateTableRows = () => {
    if (alumnos.length === 0) {
      return (
        <View style={styles.tableRow}>
          <View style={styles.studentNameCell}>
            <Text>No hay alumnos registrados</Text>
          </View>
          {[1, 2, 3, 4].map((mes) => (
            <View key={mes} style={styles.monthCell}>
              <Text style={styles.progressSubHeader}>
                MES {mes}: el alumno mostró avance
              </Text>
              <View style={styles.progressCell}>
                <Text>si</Text>
              </View>
              <View style={styles.progressCell}>
                <Text>no</Text>
              </View>
              <Text style={styles.actionsSubHeader}>
                Acciones tomadas cuando el alumno no presentó avances
              </Text>
            </View>
          ))}
        </View>
      );
    }

    return alumnos.map((alumno, index) => (
      <View key={alumno.id} style={styles.tableRow}>
        <View style={styles.studentNameCell}>
          <Text>{alumno.nombreAlumno}</Text>
          {alumno.matricula && (
            <Text style={{ fontSize: 8, color: "#6b7280", marginTop: 2 }}>
              Matrícula: {alumno.matricula}
            </Text>
          )}
          {alumno.carrera && (
            <Text style={{ fontSize: 8, color: "#6b7280", marginTop: 2 }}>
              {alumno.carrera}
            </Text>
          )}
        </View>

        {[1, 2, 3, 4].map((mes) => {
          const progreso =
            alumno.progresoMensual?.find((p) => p.mes === mes.toString()) ||
            null;
          const tieneAvance = progreso?.avance === "si";
          const acciones = progreso?.accionesTomadas || "";

          return (
            <View key={mes} style={styles.monthCell}>
              <Text style={styles.progressSubHeader}>
                MES {mes}: el alumno mostró avance
              </Text>
              <View style={styles.progressCell}>
                <Text>{tieneAvance ? "✓" : ""}</Text>
              </View>
              <View style={styles.progressCell}>
                <Text>{!tieneAvance ? "✓" : ""}</Text>
              </View>
              <Text style={styles.actionsSubHeader}>
                Acciones tomadas cuando el alumno no presentó avances
              </Text>
              <Text style={{ fontSize: 7, paddingHorizontal: 2, marginTop: 2 }}>
                {!tieneAvance ? acciones || "Sin acciones registradas" : ""}
              </Text>
            </View>
          );
        })}
      </View>
    ));
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoSection}>
            <Text style={styles.logoText}>UTN</Text>
            <Text style={styles.logoSubtext}>Construyendo el futuro</Text>
          </View>

          <View style={styles.titleSection}>
            <Text style={styles.universityName}>
              Universidad Tecnológica de Nogales, Sonora
            </Text>
            <Text style={styles.departmentText}>Dirección de la Carrera:</Text>
            <Text style={styles.mainTitle}>
              Reporte Mensual de Avance de Estadía
            </Text>
          </View>
        </View>

        {/* Información del profesor */}
        <View style={styles.professorSection}>
          <Text style={styles.professorLabel}>NOMBRE DEL PROFESOR (A):</Text>
          <Text style={styles.professorName}>
            {estadia.profesor?.nombre || ""} {estadia.profesor?.apellido || ""}
          </Text>
        </View>

        {/* Tabla principal */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.studentNameHeader}>Nombre del alumno</Text>
            {[1, 2, 3, 4].map((mes) => (
              <Text key={mes} style={styles.monthHeader}>
                MES {mes}
              </Text>
            ))}
          </View>

          {generateTableRows()}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            Documento generado el {new Date().toLocaleDateString("es-ES")}
          </Text>
          <Text>Período: {estadia.periodo}</Text>
        </View>
      </Page>
    </Document>
  );
}
