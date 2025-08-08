import { useState, useCallback } from 'react'

export interface ModalState {
  isOpen: boolean
  data?: any
  type?: string
}

export function useModal(initialState: ModalState = { isOpen: false }) {
  const [modal, setModal] = useState<ModalState>(initialState)

  const openModal = useCallback((data?: any, type?: string) => {
    setModal({ isOpen: true, data, type })
  }, [])

  const closeModal = useCallback(() => {
    setModal({ isOpen: false, data: null, type: undefined })
  }, [])

  const updateModalData = useCallback((data: any) => {
    setModal(prev => ({ ...prev, data }))
  }, [])

  return {
    modal,
    openModal,
    closeModal,
    updateModalData,
    isOpen: modal.isOpen,
    data: modal.data,
    type: modal.type
  }
}