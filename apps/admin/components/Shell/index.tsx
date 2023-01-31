import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  type PropsWithChildren,
} from "react"
import Head from "next/head"
import * as Toast from "@radix-ui/react-toast"
import { Icons, cn } from "ui"

import Sidebar from "./Sidebar"

type ToastParams = {
  title: string
  description?: string
  variant: "success" | "info" | "error"
}

type ToastState = ToastParams & {
  open: boolean
}

type Response = {
  onToast: (params: ToastParams) => void
}

const TOAST_VALUES: ToastState = {
  title: "",
  description: undefined,
  open: false,
  variant: "info",
}

const ShellContext = createContext<Response>(null as any)

const Shell = ({ children }: PropsWithChildren) => {
  const [toast, setToast] = useReducer(
    (prev: ToastState, next: Partial<ToastState>) => {
      return { ...prev, ...next }
    },
    TOAST_VALUES
  )

  const onToast = (params: ToastParams) => {
    setToast({ open: true, ...params })
  }

  const iconStatus = useMemo(() => {
    if (toast.variant === "error") {
      return "close"
    }

    if (toast.variant === "success") {
      return "check"
    }

    return "check"
  }, [toast.variant])

  const ToastIcon = Icons[iconStatus]

  return (
    <>
      <Head>
        <title>Projects • HealthCheckAPI</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </Head>

      <Toast.Provider swipeDirection="right">
        <Toast.Root
          className="flex space-x-3 rounded-md border p-4 shadow-lg"
          open={toast.open}
          onOpenChange={(open) => setToast({ open })}
        >
          <div
            className={cn(
              "flex h-5 w-5 items-center justify-center rounded-full text-white",
              {
                "bg-green-400": toast.variant === "success",
                "bg-red-400": toast.variant === "error",
                "bg-blue-400": toast.variant === "info",
              }
            )}
          >
            <ToastIcon className="h-3 w-3 stroke-[4px]" />
          </div>
          <div className="flex flex-col">
            <Toast.Title className="text-sm font-medium">
              {toast.title}
            </Toast.Title>
            {toast.description && (
              <Toast.Description>{toast.description}</Toast.Description>
            )}
          </div>
        </Toast.Root>

        <Toast.Viewport className="fixed bottom-0 right-0 z-50 flex w-full max-w-xs flex-col p-8" />
        <ShellContext.Provider value={{ onToast }}>
          <div className="fixed inset-0 grid select-none grid-cols-1 overflow-hidden bg-white sm:grid-cols-[240px,1fr]">
            <Sidebar />
            <div className="flex flex-1 flex-col overflow-auto">{children}</div>
          </div>
        </ShellContext.Provider>
      </Toast.Provider>
    </>
  )
}

export default Shell

export const useShell = () => {
  const context = useContext(ShellContext)
  if (context === undefined) {
    throw new Error("useShell must be used within a Shell")
  }
  return context
}
