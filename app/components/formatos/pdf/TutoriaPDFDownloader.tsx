import { Button } from "~/components/ui/button";
import { Download } from "lucide-react";
import jsPDF from "jspdf";
import type { Tutoria } from "~/types/tutorias";

interface TutoriaPDFDownloaderProps {
  tutoria: Tutoria;
}

export function TutoriaPDFDownloader({ tutoria }: TutoriaPDFDownloaderProps) {
  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Configuración de fuentes y colores
    const primaryColor = [0, 100, 0]; // Verde UTN
    const secondaryColor = [128, 128, 128]; // Gris para texto secundario
    
    // Función para agregar texto con estilo
    const addText = (text: string, x: number, y: number, fontSize: number = 12, isBold: boolean = false, color: number[] = [0, 0, 0]) => {
      doc.setFontSize(fontSize);
      doc.setFont(undefined, isBold ? 'bold' : 'normal');
      doc.setTextColor(color[0], color[1], color[2]);
      doc.text(text, x, y);
    };

    // Función para dibujar rectángulo
    const drawRect = (x: number, y: number, width: number, height: number, color: number[] = [0, 0, 0]) => {
      doc.setDrawColor(color[0], color[1], color[2]);
      doc.setLineWidth(0.5);
      doc.rect(x, y, width, height);
    };

    // Función para dibujar línea
    const drawLine = (x1: number, y1: number, x2: number, y2: number, color: number[] = [0, 0, 0]) => {
      doc.setDrawColor(color[0], color[1], color[2]);
      doc.setLineWidth(0.5);
      doc.line(x1, y1, x2, y2);
    };

    // Encabezado
    // Logo UTN (simulado con un rectángulo verde)
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(20, 20, 30, 30, 'F');
    addText("UTN", 30, 37, 14, true, [255, 255, 255]);
    
    // Título principal
    addText("UNIVERSIDAD TECNOLÓGICA DE NOGALES, SONORA", 60, 30, 16, true, primaryColor);
    addText("REPORTE BIMESTRAL DEL TUTOR", 60, 40, 14, true, [0, 0, 0]);
    
    // Logo de certificación (simulado)
    doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.circle(180, 35, 15, 'F');
    addText("ISO", 175, 40, 8, true, [255, 255, 255]);
    addText("9001", 175, 45, 8, true, [255, 255, 255]);

    // Información del reporte
    let yPosition = 70;
    
    // Línea separadora
    drawLine(20, yPosition - 5, 190, yPosition - 5, [0, 0, 0]);
    
    // Campos de información
    const infoFields = [
      { label: "CUATRIMESTRE:", value: tutoria.cuatrimestre },
      { label: "NOMBRE DEL TUTOR:", value: tutoria.nombreTutor || "No especificado" },
      { label: "PROGRAMA EDUCATIVO:", value: tutoria.carrera },
      { label: "GRUPO:", value: tutoria.grupo },
      { label: "FECHA:", value: tutoria.fecha }
    ];

    infoFields.forEach((field, index) => {
      addText(field.label, 20, yPosition + (index * 8), 10, true);
      addText(field.value, 80, yPosition + (index * 8), 10, false);
    });

    yPosition += 50;

    // Tabla principal
    // Encabezados de la tabla
    const headers = [
      { text: "No.", width: 15, x: 20 },
      { text: "Nombre del alumno", width: 40, x: 35 },
      { text: "Marque con una \"X\" el tipo de vulnerabilidad que presentó el alumno", width: 60, x: 75 },
      { text: "¿A qué área(s) fue canalizado para la atención del problema?", width: 50, x: 135 },
      { text: "¿Fue atendido por el área donde fue canalizado: Si o No?", width: 40, x: 185 }
    ];

    // Dibujar encabezados
    headers.forEach(header => {
      drawRect(header.x, yPosition, header.width, 8, [0, 0, 0]);
      addText(header.text, header.x + 2, yPosition + 6, 6, true);
    });

    yPosition += 8;

    // Subencabezados para vulnerabilidad
    const vulnerabilidadHeaders = [
      { text: "Académica", x: 75, width: 20 },
      { text: "Personal", x: 95, width: 20 },
      { text: "Socio-económica", x: 115, width: 20 }
    ];

    vulnerabilidadHeaders.forEach(header => {
      drawRect(header.x, yPosition, header.width, 6, [0, 0, 0]);
      addText(header.text, header.x + 2, yPosition + 4, 5, false);
    });

    // Subencabezados para área de canalización
    const areaHeaders = [
      { text: "1.Asesoría", x: 135, width: 15 },
      { text: "2.Médico", x: 150, width: 15 },
      { text: "3.Psicólogo", x: 165, width: 15 },
      { text: "4.Estudiantiles", x: 180, width: 15 },
      { text: "5.Admón", x: 195, width: 15 },
      { text: "6.Vinculación", x: 210, width: 15 },
      { text: "7.Dir.Carrera", x: 225, width: 15 },
      { text: "8.Otra", x: 240, width: 15 }
    ];

    areaHeaders.forEach(header => {
      drawRect(header.x, yPosition, header.width, 6, [0, 0, 0]);
      addText(header.text, header.x + 1, yPosition + 4, 4, false);
    });

    yPosition += 6;

    // Filas de datos de alumnos
    if (tutoria.detalles && tutoria.detalles.length > 0) {
      tutoria.detalles.forEach((detalle, index) => {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }

        const rowHeight = 8;
        
        // Número
        drawRect(20, yPosition, 15, rowHeight, [0, 0, 0]);
        addText((index + 1).toString(), 25, yPosition + 6, 8, false);
        
        // Nombre del alumno
        drawRect(35, yPosition, 40, rowHeight, [0, 0, 0]);
        addText(detalle.nombreAlumno, 37, yPosition + 6, 7, false);
        
        // Vulnerabilidad
        drawRect(75, yPosition, 20, rowHeight, [0, 0, 0]);
        if (detalle.vulnerabilidad === "academica") addText("X", 82, yPosition + 6, 8, true);
        
        drawRect(95, yPosition, 20, rowHeight, [0, 0, 0]);
        if (detalle.vulnerabilidad === "personal") addText("X", 102, yPosition + 6, 8, true);
        
        drawRect(115, yPosition, 20, rowHeight, [0, 0, 0]);
        if (detalle.vulnerabilidad === "socioeconomica") addText("X", 122, yPosition + 6, 8, true);
        
        // Área de canalización
        drawRect(135, yPosition, 50, rowHeight, [0, 0, 0]);
        addText(detalle.areaCanalizacion, 137, yPosition + 6, 7, false);
        
        // Fue atendido
        drawRect(185, yPosition, 40, rowHeight, [0, 0, 0]);
        addText(detalle.fueAtendido ? "Sí" : "No", 195, yPosition + 6, 8, false);
        
        yPosition += rowHeight;
      });
    } else {
      // Si no hay detalles, mostrar mensaje
      addText("No hay alumnos registrados en esta tutoría", 20, yPosition + 10, 10, false, secondaryColor);
    }

    // Observaciones
    yPosition += 20;
    drawRect(20, yPosition, 170, 30, [0, 0, 0]);
    addText("Observaciones (opcional):", 22, yPosition + 5, 10, true);
    if (tutoria.observaciones) {
      addText(tutoria.observaciones, 22, yPosition + 15, 9, false);
    }

    // Pie de página
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      addText(`Página ${i} de ${pageCount}`, 20, 280, 8, false, secondaryColor);
      addText(`Generado el: ${new Date().toLocaleDateString('es-MX')}`, 120, 280, 8, false, secondaryColor);
    }

    // Guardar el PDF
    const fileName = `Tutoria_${tutoria.grupo}_${tutoria.cuatrimestre.replace(/\s+/g, '_')}.pdf`;
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
