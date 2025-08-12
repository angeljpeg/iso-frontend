import { Button } from "~/components/ui/button";
import { Download } from "lucide-react";
import jsPDF from "jspdf";
import type { Tutoria } from "~/types/tutorias";

interface TutoriaPDFDownloaderProps {
  tutoria: Tutoria;
}

export function TutoriaPDFDownloader({ tutoria }: TutoriaPDFDownloaderProps) {
  const generatePDF = () => {
    const doc = new jsPDF("landscape"); // Cambiar a orientación horizontal para mejor distribución

    // Configuración de fuentes y colores
    const primaryColor = [0, 100, 0]; // Verde UTN
    const secondaryColor = [128, 128, 128]; // Gris para texto secundario

    // Función para agregar texto con estilo
    const addText = (
      text: string,
      x: number,
      y: number,
      fontSize: number = 12,
      isBold: boolean = false,
      color: number[] = [0, 0, 0]
    ) => {
      doc.setFontSize(fontSize);
      doc.setFont(undefined, isBold ? "bold" : "normal");
      doc.setTextColor(color[0], color[1], color[2]);
      doc.text(text, x, y);
    };

    // Función para dibujar rectángulo
    const drawRect = (
      x: number,
      y: number,
      width: number,
      height: number,
      color: number[] = [0, 0, 0]
    ) => {
      doc.setDrawColor(color[0], color[1], color[2]);
      doc.setLineWidth(0.5);
      doc.rect(x, y, width, height);
    };

    // Función para dibujar línea
    const drawLine = (
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      color: number[] = [0, 0, 0]
    ) => {
      doc.setDrawColor(color[0], color[1], color[2]);
      doc.setLineWidth(0.5);
      doc.line(x1, y1, x2, y2);
    };

    // Encabezado
    // Logo UTN (simulado con un rectángulo verde)
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(20, 20, 40, 40, "F");
    addText("UTN", 35, 42, 18, true, [255, 255, 255]);

    // Título principal
    addText(
      "UNIVERSIDAD TECNOLÓGICA DE NOGALES, SONORA",
      80,
      30,
      18,
      true,
      primaryColor
    );
    addText("REPORTE BIMESTRAL DEL TUTOR", 80, 45, 16, true, [0, 0, 0]);

    // Logo de certificación (simulado)
    doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.circle(270, 40, 20, "F");
    addText("ISO", 265, 45, 10, true, [255, 255, 255]);
    addText("9001", 265, 52, 10, true, [255, 255, 255]);

    // Información del reporte
    let yPosition = 80;

    // Línea separadora
    drawLine(20, yPosition - 5, 280, yPosition - 5, [0, 0, 0]);

    // Campos de información
    const infoFields = [
      { label: "CUATRIMESTRE:", value: tutoria.cuatrimestre },
      {
        label: "NOMBRE DEL TUTOR:",
        value: tutoria.nombreTutor || "No especificado",
      },
      { label: "PROGRAMA EDUCATIVO:", value: tutoria.carrera },
      { label: "GRUPO:", value: tutoria.grupo },
      { label: "FECHA:", value: tutoria.fecha },
    ];

    infoFields.forEach((field, index) => {
      addText(field.label, 20, yPosition + index * 12, 12, true);
      addText(field.value, 80, yPosition + index * 12, 12, false);
    });

    yPosition += 70;

    // Tabla principal - Mejorar dimensiones y legibilidad
    // Encabezados principales de la tabla
    const mainHeaders = [
      { text: "No.", width: 25, x: 20 },
      { text: "Nombre del alumno", width: 60, x: 45 },
      { text: "Tipo de vulnerabilidad", width: 80, x: 105 },
      { text: "Área de canalización", width: 80, x: 185 },
      { text: "Fue atendido", width: 40, x: 265 },
      { text: "Presentó mejoría", width: 40, x: 305 },
    ];

    // Dibujar encabezados principales
    mainHeaders.forEach((header) => {
      drawRect(header.x, yPosition, header.width, 12, [0, 0, 0]);
      addText(header.text, header.x + 2, yPosition + 8, 10, true);
    });

    yPosition += 12;

    // Subencabezados para vulnerabilidad
    const vulnerabilidadHeaders = [
      { text: "Académica", x: 105, width: 25 },
      { text: "Personal", x: 130, width: 25 },
      { text: "Socio-económica", x: 155, width: 30 },
    ];

    vulnerabilidadHeaders.forEach((header) => {
      drawRect(header.x, yPosition, header.width, 10, [0, 0, 0]);
      addText(header.text, header.x + 2, yPosition + 7, 8, false);
    });

    // Subencabezados para área de canalización
    const areaHeaders = [
      { text: "1. Asesoría", x: 185, width: 25 },
      { text: "2. Médico", x: 210, width: 25 },
      { text: "3. Psicólogo", x: 235, width: 25 },
      { text: "4. Estudiantiles", x: 260, width: 25 },
      { text: "5. Admón", x: 285, width: 25 },
    ];

    areaHeaders.forEach((header) => {
      drawRect(header.x, yPosition, header.width, 10, [0, 0, 0]);
      addText(header.text, header.x + 1, yPosition + 7, 7, false);
    });

    // Subencabezados para "Fue atendido"
    drawRect(265, yPosition, 20, 10, [0, 0, 0]);
    addText("Sí", 270, yPosition + 7, 8, false);
    drawRect(285, yPosition, 20, 10, [0, 0, 0]);
    addText("No", 295, yPosition + 7, 8, false);

    yPosition += 10;

    // Filas de datos de alumnos
    if (tutoria.detalles && tutoria.detalles.length > 0) {
      tutoria.detalles.forEach((detalle, index) => {
        if (yPosition > 180) {
          doc.addPage("landscape");
          yPosition = 20;
        }

        const rowHeight = 12;

        // Número
        drawRect(20, yPosition, 25, rowHeight, [0, 0, 0]);
        addText((index + 1).toString(), 30, yPosition + 8, 10, false);

        // Nombre del alumno
        drawRect(45, yPosition, 60, rowHeight, [0, 0, 0]);
        addText(detalle.nombreAlumno, 47, yPosition + 8, 9, false);

        // Vulnerabilidad - Marcar con X
        drawRect(105, yPosition, 25, rowHeight, [0, 0, 0]);
        if (detalle.vulnerabilidad === "academica")
          addText("X", 115, yPosition + 8, 12, true);

        drawRect(130, yPosition, 25, rowHeight, [0, 0, 0]);
        if (detalle.vulnerabilidad === "personal")
          addText("X", 140, yPosition + 8, 12, true);

        drawRect(155, yPosition, 30, rowHeight, [0, 0, 0]);
        if (detalle.vulnerabilidad === "socioeconomica")
          addText("X", 165, yPosition + 8, 12, true);

        // Área de canalización
        drawRect(185, yPosition, 80, rowHeight, [0, 0, 0]);
        addText(detalle.areaCanalizacion, 187, yPosition + 8, 9, false);

        // Fue atendido
        drawRect(265, yPosition, 20, rowHeight, [0, 0, 0]);
        if (detalle.fueAtendido) addText("X", 275, yPosition + 8, 12, true);

        drawRect(285, yPosition, 20, rowHeight, [0, 0, 0]);
        if (!detalle.fueAtendido) addText("X", 295, yPosition + 8, 12, true);

        // Presentó mejoría
        drawRect(305, yPosition, 40, rowHeight, [0, 0, 0]);
        addText(
          detalle.presentoMejoria ? "Sí" : "No",
          315,
          yPosition + 8,
          10,
          false
        );

        yPosition += rowHeight;
      });
    } else {
      // Si no hay detalles, mostrar mensaje
      addText(
        "No hay alumnos registrados en esta tutoría",
        20,
        yPosition + 10,
        12,
        false,
        secondaryColor
      );
    }

    // Observaciones
    yPosition += 20;
    drawRect(20, yPosition, 250, 40, [0, 0, 0]);
    addText("Observaciones (opcional):", 22, yPosition + 8, 12, true);
    if (tutoria.observaciones) {
      addText(tutoria.observaciones, 22, yPosition + 20, 10, false);
    }

    // Pie de página
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      addText(
        `Página ${i} de ${pageCount}`,
        20,
        190,
        10,
        false,
        secondaryColor
      );
      addText(
        `Generado el: ${new Date().toLocaleDateString("es-MX")}`,
        200,
        190,
        10,
        false,
        secondaryColor
      );
    }

    // Guardar el PDF
    const fileName = `Tutoria_${tutoria.grupo}_${tutoria.cuatrimestre.replace(
      /\s+/g,
      "_"
    )}.pdf`;
    doc.save(fileName);
  };

  return (
    <Button
      onClick={generatePDF}
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
    >
      <Download className="h-4 w-4" />
      Descargar PDF
    </Button>
  );
}
