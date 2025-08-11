import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts";

interface GraficaBarrasProps {
  data: Array<{ name: string; value: number }>;
  title: string;
  description?: string;
  color?: string;
}

export function GraficaBarras({ data, title, description, color = "#3b82f6" }: GraficaBarrasProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill={color} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

interface GraficaPieProps {
  data: Array<{ name: string; value: number }>;
  title: string;
  description?: string;
  colors?: string[];
}

export function GraficaPie({ data, title, description, colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"] }: GraficaPieProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

interface GraficaLineaProps {
  data: Array<{ name: string; value: number }>;
  title: string;
  description?: string;
  color?: string;
}

export function GraficaLinea({ data, title, description, color = "#3b82f6" }: GraficaLineaProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

interface GraficaAreaProps {
  data: Array<{ name: string; value: number }>;
  title: string;
  description?: string;
  color?: string;
}

export function GraficaArea({ data, title, description, color = "#3b82f6" }: GraficaAreaProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="value" stroke={color} fill={color} fillOpacity={0.3} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// Componente para mostrar múltiples gráficas en una cuadrícula
interface GraficasGridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4;
}

export function GraficasGrid({ children, cols = 2 }: GraficasGridProps) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 lg:grid-cols-2",
    3: "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3",
    4: "grid-cols-1 lg:grid-cols-2 xl:grid-cols-4"
  };

  return (
    <div className={`grid ${gridCols[cols]} gap-6`}>
      {children}
    </div>
  );
}

// Componente para convertir datos de reportes a formato de gráficas
export function convertirDatosParaGrafica(
  datos: Record<string, number> | Record<string, any>,
  tipo: 'barras' | 'pie' | 'linea' | 'area' = 'barras'
) {
  if (!datos) return [];
  
  return Object.entries(datos).map(([key, value]) => ({
    name: key,
    value: typeof value === 'number' ? value : 
           typeof value === 'object' && value.porcentaje ? parseFloat(value.porcentaje) : 0
  }));
}

// Componente para mostrar estadísticas con iconos
interface EstadisticaCardProps {
  titulo: string;
  valor: string | number;
  descripcion?: string;
  icono?: React.ReactNode;
  color?: string;
  tendencia?: {
    valor: number;
    esPositiva: boolean;
  };
}

export function EstadisticaCard({ 
  titulo, 
  valor, 
  descripcion, 
  icono, 
  color = "#3b82f6",
  tendencia 
}: EstadisticaCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">{titulo}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{valor}</p>
            {descripcion && (
              <p className="text-sm text-gray-500 mt-1">{descripcion}</p>
            )}
            {tendencia && (
              <div className={`flex items-center mt-2 text-sm ${
                tendencia.esPositiva ? 'text-green-600' : 'text-red-600'
              }`}>
                <span className={tendencia.esPositiva ? '↗' : '↘'} className="mr-1">
                  {tendencia.esPositiva ? '↗' : '↘'}
                </span>
                {tendencia.valor}%
              </div>
            )}
          </div>
          {icono && (
            <div className="flex-shrink-0" style={{ color }}>
              {icono}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Componente para mostrar comparativas
interface ComparativaProps {
  titulo: string;
  datos: Array<{
    etiqueta: string;
    valor: number;
    total: number;
    color?: string;
  }>;
}

export function Comparativa({ titulo, datos }: ComparativaProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{titulo}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {datos.map((item, index) => {
            const porcentaje = item.total > 0 ? (item.valor / item.total) * 100 : 0;
            const color = item.color || "#3b82f6";
            
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700">{item.etiqueta}</span>
                  <span className="text-gray-600">
                    {item.valor} de {item.total} ({porcentaje.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-300" 
                    style={{ 
                      width: `${porcentaje}%`,
                      backgroundColor: color
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
