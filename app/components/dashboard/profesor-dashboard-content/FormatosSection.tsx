import { FileText } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { FormatoCard } from "./FormatoCard";
import type { FormatoCard as FormatoCardType } from "~/types/formatos";

interface FormatosSectionProps {
  formatos: FormatoCardType[];
}

export function FormatosSection({ formatos }: FormatosSectionProps) {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Formatos ISO Disponibles"
        description="Accede a los diferentes formatos de seguimiento y reportes académicos"
        icon={<FileText />}
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {formatos.map((formato) => (
          <FormatoCard key={formato.id} formato={formato} />
        ))}
      </div>
    </div>
  );
}
