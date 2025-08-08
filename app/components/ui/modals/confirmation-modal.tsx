import React from 'react'
import { Modal } from '../modal'
import { Button } from '../Button'
import { AlertTriangleIcon, CheckCircleIcon, XCircleIcon } from 'lucide-react'

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'destructive' | 'success'
  isLoading?: boolean
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'default',
  isLoading = false
}: ConfirmationModalProps) {
  const getIcon = () => {
    switch (variant) {
      case 'destructive':
        return <XCircleIcon className="h-6 w-6 text-red-600" />
      case 'success':
        return <CheckCircleIcon className="h-6 w-6 text-green-600" />
      default:
        return <AlertTriangleIcon className="h-6 w-6 text-yellow-600" />
    }
  }

  const getConfirmButtonVariant = () => {
    switch (variant) {
      case 'destructive':
        return 'destructive'
      case 'success':
        return 'default'
      default:
        return 'default'
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      variant={variant}
      showCloseButton={false}
    >
      <div className="flex items-center space-x-3">
        {getIcon()}
        <div>
          <h3 className="text-lg font-medium">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 mt-6">
        <Button variant="outline" onClick={onClose} disabled={isLoading}>
          {cancelText}
        </Button>
        <Button 
          variant={getConfirmButtonVariant()} 
          onClick={onConfirm}
          disabled={isLoading}
        >
          {isLoading ? 'Procesando...' : confirmText}
        </Button>
      </div>
    </Modal>
  )
}