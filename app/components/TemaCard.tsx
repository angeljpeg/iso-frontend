import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "./ui/Card";
import { Badge } from "./ui/badge";
import {
  BookOpenIcon,
  CalendarIcon,
  HashIcon,
  ChevronRightIcon,
} from "lucide-react";
import type { Tema } from "../types/carga-academica";

interface TemaCardProps {
  tema: Tema;
  onClick: (tema: Tema) => void;
}

export function TemaCard({ tema, onClick }: TemaCardProps) {
  const handleClick = () => {
    onClick(tema);
  };

  return (
    <Card
      onClick={handleClick}
      role="button"
      tabIndex={0}
      className="h-full cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] group border-border/50 hover:border-green-500/50"
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="flex gap-2 items-center text-lg font-semibold transition-colors duration-200 text-foreground group-hover:text-foreground">
            <BookOpenIcon className="w-5 h-5 text-muted-foreground" />
            {tema.nombre}
          </CardTitle>
          <ChevronRightIcon className="w-4 h-4 text-muted-foreground group-hover:text-green-600 group-hover:translate-x-1 transition-all duration-200" />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Unidad */}
        <div className="flex gap-3 items-center p-3 rounded-lg border border-border bg-muted/30 group-hover:bg-muted/50 transition-colors duration-200">
          <HashIcon className="flex-shrink-0 w-5 h-5 text-muted-foreground" />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground">Unidad {tema.unidad}</p>
          </div>
        </div>

        {/* Semana programada */}
        <div className="flex gap-3 items-center">
          <CalendarIcon className="w-4 h-4 text-muted-foreground" />
          <Badge variant="secondary" className="text-xs font-medium">
            Semana {tema.semanaProgramada}
          </Badge>
        </div>
      </CardContent>

      <CardFooter className="pt-3 border-t border-border/50">
        <div className="flex justify-between items-center w-full">
          <Badge variant="outline" className="text-xs">
            Tema
          </Badge>
          <div className="flex gap-1 items-center text-xs text-muted-foreground group-hover:text-green-600 transition-colors duration-200">
            <span>Ver detalles</span>
            <ChevronRightIcon className="w-3 h-3" />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
