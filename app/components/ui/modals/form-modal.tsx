import React from 'react'
import { Modal } from '../modal'
import { Button } from '../Button'

interface FormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
  title: string
  description?: string
  children: React.ReactNode
  submitText?: string
  cancelText?: string
  isLoading?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
}

export function FormModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  description,
  children,
  submitText = 'Guardar',
  cancelText = 'Cancelar',
  isLoading = false,
  size = 'md'
}: FormModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      size={size}
      showCloseButton={false}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {children}
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Guardando...' : submitText}
          </Button>
        </div>
      </form>
    </Modal>
  )
}