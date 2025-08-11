import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";
import type { SeguimientoCurso } from "~/types/programacion-curso";
import { EstadoSeguimiento } from "~/types/programacion-curso";

interface GeneratePDFOptions {
  seguimientos: SeguimientoCurso[];
  titulo?: string;
  filtros?: {
    estado?: string;
    cuatrimestreId?: string;
    profesorId?: string;
    carrera?: string;
    search?: string;
  };
}

// Estilos para el PDF horizontal
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 20,
    fontSize: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  logoLeft: {
    width: 80,
    height: 80,
  },
  logoRight: {
    width: 80,
    height: 80,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    textTransform: "uppercase",
  },
  subtitle: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 5,
  },
  programacionText: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  mainContent: {
    flexDirection: "row",
    marginBottom: 20,
  },
  leftSection: {
    width: "50%",
    paddingRight: 10,
  },
  rightSection: {
    width: "50%",
    paddingLeft: 10,
  },
  courseInfo: {
    marginBottom: 20,
  },
  fieldRow: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "center",
  },
  fieldLabel: {
    fontWeight: "bold",
    width: 100,
  },
  fieldValue: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    borderBottomStyle: "solid",
    paddingBottom: 2,
    marginLeft: 10,
  },
  sectionHeader: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 8,
  },
  dateField: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "center",
  },
  dateLabel: {
    fontSize: 9,
    width: 140,
  },
  dateLine: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    borderBottomStyle: "solid",
    marginLeft: 10,
  },
  mainTable: {
    marginTop: 20,
  },
  tableHeader: {
    flexDirection: "row",
    marginBottom: 8,
  },
  programacionHeader: {
    backgroundColor: "#008000",
    color: "#ffffff",
    padding: 8,
    width: "30%",
    alignItems: "center",
    justifyContent: "center",
  },
  seguimientoHeader: {
    backgroundColor: "#0000ff",
    color: "#ffffff",
    padding: 8,
    width: "70%",
    alignItems: "center",
    justifyContent: "center",
  },
  tableSubHeaders: {
    flexDirection: "row",
    marginBottom: 5,
  },
  subHeader: {
    fontSize: 9,
    fontWeight: "bold",
    padding: 4,
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
    borderBottomStyle: "solid",
    paddingVertical: 4,
  },
  tableCell: {
    fontSize: 8,
    paddingHorizontal: 4,
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerLeft: {
    fontSize: 8,
  },
  footerRight: {
    fontSize: 8,
    textAlign: "right",
  },
});

// Función para agrupar seguimientos por asignatura
const agruparSeguimientosPorAsignatura = (seguimientos: SeguimientoCurso[]) => {
  const grupos = new Map<string, SeguimientoCurso[]>();

  seguimientos.forEach((seguimiento) => {
    const asignatura =
      seguimiento.cargaAcademica?.asignatura || "Sin asignatura";
    if (!grupos.has(asignatura)) {
      grupos.set(asignatura, []);
    }
    grupos.get(asignatura)!.push(seguimiento);
  });

  return grupos;
};

// Función para calcular semanas del cuatrimestre
const calcularSemanasCuatrimestre = (cuatrimestre: any) => {
  if (!cuatrimestre?.fechaInicio || !cuatrimestre?.fechaFin) {
    return 16; // Valor por defecto
  }

  const inicio = new Date(cuatrimestre.fechaInicio);
  const fin = new Date(cuatrimestre.fechaFin);
  const diferenciaMs = fin.getTime() - inicio.getTime();
  const diferenciaDias = diferenciaMs / (1000 * 60 * 60 * 24);
  const semanas = Math.ceil(diferenciaDias / 7);

  return Math.max(semanas, 1);
};

// Función para obtener información de retrasos
const getRetrasoInfo = (seguimiento: SeguimientoCurso): string => {
  if (!seguimiento.detalles || seguimiento.detalles.length === 0) {
    return "Sin retrasos reportados";
  }

  const retrasos = seguimiento.detalles.filter(
    (d) => d.estadoAvance === "retrasado"
  );
  if (retrasos.length === 0) {
    return "Al día";
  }

  return `Retraso en ${retrasos.length} temas`;
};

// Función para obtener información de evidencias
const getEvidenciaInfo = (seguimiento: SeguimientoCurso): string => {
  if (!seguimiento.detalles || seguimiento.detalles.length === 0) {
    return "Sin evidencia";
  }

  const evidencias = seguimiento.detalles.filter((d) => d.evidencias);
  if (evidencias.length === 0) {
    return "Pendiente evidencia";
  }

  return `${evidencias.length} evidencias presentadas`;
};

// Función para obtener información de justificaciones
const getJustificacionInfo = (seguimiento: SeguimientoCurso): string => {
  if (!seguimiento.detalles || seguimiento.detalles.length === 0) {
    return "Sin justificación";
  }

  const justificaciones = seguimiento.detalles.filter((d) => d.justificacion);
  if (justificaciones.length === 0) {
    return "Sin justificación";
  }

  return `${justificaciones.length} justificaciones presentadas`;
};

// Función para obtener información de acciones
const getAccionesInfo = (seguimiento: SeguimientoCurso): string => {
  if (!seguimiento.detalles || seguimiento.detalles.length === 0) {
    return "Sin acciones";
  }

  const acciones = seguimiento.detalles.filter((d) => d.acciones);
  if (acciones.length === 0) {
    return "Sin acciones definidas";
  }

  return `${acciones.length} acciones definidas`;
};

// Componente principal del PDF
const ProgramacionCursosDocument: React.FC<GeneratePDFOptions> = ({
  seguimientos,
  titulo = "Programación y Seguimiento de Cursos",
}) => {
  // Agrupar seguimientos por asignatura
  const seguimientosPorAsignatura =
    agruparSeguimientosPorAsignatura(seguimientos);

  // Obtener la primera asignatura para mostrar información general
  const primeraAsignatura = Array.from(seguimientosPorAsignatura.keys())[0];
  const seguimientosPrimeraAsignatura =
    seguimientosPorAsignatura.get(primeraAsignatura) || [];
  const primerSeguimiento = seguimientosPrimeraAsignatura[0];

  // Calcular semanas del cuatrimestre
  const semanasCuatrimestre = calcularSemanasCuatrimestre(
    primerSeguimiento?.cuatrimestre
  );

  // Obtener información del profesor
  const profesor = primerSeguimiento?.cargaAcademica?.profesor;
  const nombreProfesor = profesor
    ? `${profesor.nombre} ${profesor.apellido}`
    : "Profesor no asignado";

  // Obtener grupos únicos
  const gruposUnicos = Array.from(
    new Set(
      seguimientosPrimeraAsignatura.map(
        (s) => s.cargaAcademica?.grupo?.nombreGenerado || "Sin grupo"
      )
    )
  ).filter((g) => g !== "Sin grupo");

  // Obtener cuatrimestre
  const cuatrimestre = primerSeguimiento?.cuatrimestre;
  const nombreCuatrimestre =
    cuatrimestre?.nombreGenerado || "Cuatrimestre no definido";
  const año = cuatrimestre?.fechaInicio
    ? new Date(cuatrimestre.fechaInicio).getFullYear()
    : new Date().getFullYear();

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        {/* Encabezado con logos */}
        <View style={styles.header}>
          <Image src="/assets/logo-utn.png" style={styles.logoLeft} />
          <View style={styles.headerCenter}>
            <Text style={styles.title}>
              UNIVERSIDAD TECNOLÓGICA DE NOGALES, SONORA
            </Text>
            <Text style={styles.subtitle}>
              Formato por Dirección de Carrera
            </Text>
            <Text style={styles.subtitle}>Dirección de la carrera de:</Text>
            <Text style={styles.programacionText}>
              Programación y seguimiento del curso
            </Text>
          </View>
          <Image src="/assets/iso-21001.png" style={styles.logoRight} />
        </View>

        {/* Contenido principal en dos columnas */}
        <View style={styles.mainContent}>
          {/* Columna izquierda - Información del curso */}
          <View style={styles.leftSection}>
            <View style={styles.courseInfo}>
              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Profesor:</Text>
                <Text style={styles.fieldValue}>{nombreProfesor}</Text>
              </View>
              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Horas/Semana:</Text>
                <Text style={styles.fieldValue}>4</Text>
              </View>
              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Grupos a impartir:</Text>
                <Text style={styles.fieldValue}>{gruposUnicos.join(", ")}</Text>
              </View>
              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Cuatrimestre:</Text>
                <Text style={styles.fieldValue}>{nombreCuatrimestre}</Text>
              </View>
              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Año:</Text>
                <Text style={styles.fieldValue}>{año}</Text>
              </View>
            </View>
          </View>

          {/* Columna derecha - Sección de dirección de carrera */}
          <View style={styles.rightSection}>
            <View style={styles.sectionHeader}>
              <View style={styles.dateField}>
                <Text style={styles.dateLabel}>Fecha de entrega:</Text>
                <View style={styles.dateLine} />
              </View>
              <View style={styles.dateField}>
                <Text style={styles.dateLabel}>
                  Fecha de seguimiento de la Dirección:
                </Text>
                <View style={styles.dateLine} />
              </View>
              <View style={styles.dateField}>
                <Text style={styles.dateLabel}>
                  Fecha de seguimiento final de la Dirección:
                </Text>
                <View style={styles.dateLine} />
              </View>
            </View>
          </View>
        </View>

        {/* Tabla principal */}
        <View style={styles.mainTable}>
          {/* Encabezado de la tabla */}
          <View style={styles.tableHeader}>
            <View style={styles.programacionHeader}>
              <Text style={{ color: "#ffffff", fontWeight: "bold" }}>
                PROGRAMACIÓN
              </Text>
            </View>
            <View style={styles.seguimientoHeader}>
              <Text style={{ color: "#ffffff", fontWeight: "bold" }}>
                SEGUIMIENTO
              </Text>
            </View>
          </View>

          {/* Sub-encabezados */}
          <View style={styles.tableSubHeaders}>
            {/* Columnas de PROGRAMACIÓN */}
            <Text style={[styles.subHeader, { width: "10%" }]}>Unidad</Text>
            <Text style={[styles.subHeader, { width: "20%" }]}>TEMAS</Text>
            <Text style={[styles.subHeader, { width: "10%" }]}>
              TiempoAvance
            </Text>

            {/* Columnas de SEGUIMIENTO */}
            <Text style={[styles.subHeader, { width: "15%" }]}>
              Justificación
            </Text>
            <Text style={[styles.subHeader, { width: "15%" }]}>Acciones</Text>
            <Text style={[styles.subHeader, { width: "15%" }]}>Evidencia</Text>
            <Text style={[styles.subHeader, { width: "15%" }]}>Revisión</Text>
          </View>

          {/* Filas de datos reales */}
          {Array.from(seguimientosPorAsignatura.entries()).map(
            ([asignatura, seguimientosAsignatura], indexAsignatura) => {
              // Obtener detalles de la asignatura (unidades, temas, semanas programadas)
              const detallesAsignatura = seguimientosAsignatura.flatMap(
                (s) => s.detalles || []
              );

              // Si no hay detalles, crear una fila básica
              if (detallesAsignatura.length === 0) {
                return (
                  <View
                    key={`${asignatura}-${indexAsignatura}`}
                    style={styles.tableRow}
                  >
                    <Text style={[styles.tableCell, { width: "10%" }]}>
                      {indexAsignatura + 1}
                    </Text>
                    <Text style={[styles.tableCell, { width: "20%" }]}>
                      {asignatura}
                    </Text>
                    <Text style={[styles.tableCell, { width: "10%" }]}>
                      {semanasCuatrimestre}
                    </Text>
                    <Text style={[styles.tableCell, { width: "15%" }]}>
                      Sin justificación
                    </Text>
                    <Text style={[styles.tableCell, { width: "15%" }]}>
                      Sin acciones
                    </Text>
                    <Text style={[styles.tableCell, { width: "15%" }]}>
                      Sin evidencia
                    </Text>
                    <Text style={[styles.tableCell, { width: "15%" }]}>
                      {seguimientosAsignatura[0]?.estado ===
                      EstadoSeguimiento.REVISADO
                        ? "Revisado"
                        : "Pendiente"}
                    </Text>
                  </View>
                );
              }

              // Si hay detalles, mostrar cada tema como una fila
              return detallesAsignatura.map((detalle, indexDetalle) => (
                <View
                  key={`${asignatura}-${indexAsignatura}-${indexDetalle}`}
                  style={styles.tableRow}
                >
                  <Text style={[styles.tableCell, { width: "10%" }]}>
                    {indexDetalle + 1}
                  </Text>
                  <Text style={[styles.tableCell, { width: "20%" }]}>
                    {detalle.tema || asignatura}
                  </Text>
                  <Text style={[styles.tableCell, { width: "10%" }]}>
                    {detalle.semanaTerminada || ""}
                  </Text>
                  <Text style={[styles.tableCell, { width: "15%" }]}>
                    {detalle.justificacion || "Sin justificación"}
                  </Text>
                  <Text style={[styles.tableCell, { width: "15%" }]}>
                    {detalle.acciones || "Sin acciones"}
                  </Text>
                  <Text style={[styles.tableCell, { width: "15%" }]}>
                    {detalle.evidencias || "Sin evidencia"}
                  </Text>
                  <Text style={[styles.tableCell, { width: "15%" }]}>
                    {seguimientosAsignatura[0]?.estado ===
                    EstadoSeguimiento.REVISADO
                      ? "Revisado"
                      : "Pendiente"}
                  </Text>
                </View>
              ));
            }
          )}
        </View>

        {/* Pie de página */}
        <View style={styles.footer}>
          <Text style={styles.footerLeft}>F01PEFA04.00</Text>
          <View style={styles.footerRight}>
            <Text>
              Fecha revisión: {new Date().toLocaleDateString("es-ES")}
            </Text>
            <Text>Hoja 1 de 1</Text>
            <Text>Rev. 00</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

// Función helper para usar desde componentes
export const generateProgramacionCursosPDF = async (
  options: GeneratePDFOptions
) => {
  // Esta función ahora retorna el componente React PDF
  // Para descargarlo, necesitarás usar react-pdf-to-image o similar
  return ProgramacionCursosDocument(options);
};

// Exportar el componente para uso directo
export { ProgramacionCursosDocument };
