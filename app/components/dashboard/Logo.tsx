import { FileText } from "lucide-react";

export const Logo = () => {
  return (
    <div className="flex h-16 items-center border-b px-6">
      <div className="flex items-center space-x-2">
        <div className="h-8 w-8 rounded-lg bg-utn-primary flex items-center justify-center">
          <FileText className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-900">ISO UTN</h1>
          <p className="text-xs text-gray-500">Gestión de Formatos</p>
        </div>
      </div>
    </div>
  );
};
