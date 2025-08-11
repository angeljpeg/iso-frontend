import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './dialog'
import { Button } from './Button'
import { cn } from '~/lib/utils'

const modalVariants = cva(
  "w-full",
  {
    variants: {
      size: {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        "2xl": "max-w-2xl",
        "3xl": "max-w-3xl",
        "4xl": "max-w-4xl",
        full: "max-w-[95vw] h-[95vh]"
      },
      variant: {
        default: "",
        destructive: "border-destructive",
        success: "border-green-500",
        warning: "border-yellow-500"
      }
    },
    defaultVariants: {
      size: "md",
      variant: "default"
    }
  }
)

export interface ModalProps extends VariantProps<typeof modalVariants> {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children?: React.ReactNode
  footer?: React.ReactNode
  showCloseButton?: boolean
  closeOnOverlayClick?: boolean
  className?: string
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  showCloseButton = true,
  closeOnOverlayClick = true,
  size,
  variant,
  className,
  ...props
}: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={closeOnOverlayClick ? onClose : undefined}>
      <DialogContent 
        className={cn(modalVariants({ size, variant }), className)}
        onPointerDownOutside={closeOnOverlayClick ? undefined : (e) => e.preventDefault()}
        {...props}
      >
        {(title || description) && (
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
        )}
        
        {children}
        
        {footer && (
          <DialogFooter>
            {footer}
          </DialogFooter>
        )}
        
        {!footer && showCloseButton && !title && (
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cerrar
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}