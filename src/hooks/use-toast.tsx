
import * as React from "react"
import { toast as sonnerToast } from "sonner"

type ToasterToast = {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  variant?: "default" | "destructive"
}

export const toasts: ToasterToast[] = []

export function useToast() {
  const [toastList, setToastList] = React.useState<ToasterToast[]>([])

  React.useEffect(() => {
    setToastList([...toasts])
  }, [toasts])

  return {
    toast: sonnerToast,
    toasts: toastList,
    dismiss: (id: string) => {
      toasts.splice(
        toasts.findIndex((toast) => toast.id === id),
        1
      )
      setToastList([...toasts])
    },
  }
}

export const toast = sonnerToast
