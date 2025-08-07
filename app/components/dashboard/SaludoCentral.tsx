export interface SaludoCentralProps {
  title?: string;
  nombre: string;
  apellido: string;
}

export const SaludoCentral = ({
  title,
  nombre,
  apellido,
}: SaludoCentralProps) => {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Hola, {nombre} {apellido}!
          </h2>
          <p className="text-lg text-gray-600">Bienvenido de nuevo!</p>
          {title && (
            <p className="text-sm text-utn-primary font-medium mt-2">{title}</p>
          )}
        </div>
      </div>
    </div>
  );
};
