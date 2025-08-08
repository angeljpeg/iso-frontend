import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { ConfirmationModal } from "~/components/ui/modals/confirmation-modal";

interface ModalContextType {
  showConfirmation: (options: ConfirmationOptions) => Promise<boolean>;
  showAlert: (title: string, description?: string) => void;
}

interface ConfirmationOptions {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive" | "success";
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function useModalContext() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModalContext must be used within a ModalProvider");
  }
  return context;
}

interface ModalProviderProps {
  children: ReactNode;
}

export function ModalProvider({ children }: ModalProviderProps) {
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    options: ConfirmationOptions;
    resolve?: (value: boolean) => void;
  }>({ isOpen: false, options: { title: "" } });

  const showConfirmation = (options: ConfirmationOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmationModal({
        isOpen: true,
        options,
        resolve,
      });
    });
  };

  const showAlert = (title: string, description?: string) => {
    showConfirmation({
      title,
      description,
      confirmText: "Aceptar",
      cancelText: "",
    });
  };

  const handleConfirm = () => {
    confirmationModal.resolve?.(true);
    setConfirmationModal({ isOpen: false, options: { title: "" } });
  };

  const handleCancel = () => {
    confirmationModal.resolve?.(false);
    setConfirmationModal({ isOpen: false, options: { title: "" } });
  };

  return (
    <ModalContext.Provider value={{ showConfirmation, showAlert }}>
      {children}

      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={handleCancel}
        onConfirm={handleConfirm}
        title={confirmationModal.options.title}
        description={confirmationModal.options.description}
        confirmText={confirmationModal.options.confirmText}
        cancelText={confirmationModal.options.cancelText}
        variant={confirmationModal.options.variant}
      />
    </ModalContext.Provider>
  );
}
