import { cn } from "./utils"

type AlertProps = {
  variant?: "error" | "success" | "info"
  title: string
  description?: string
}

export const Alert = ({ title, description, variant = "info" }: AlertProps) => {
  const MESSAGE = {
    error: "Erro",
    success: "Sucesso",
    info: "Info",
  }

  return (
    <div
      className={cn("mb-4 flex flex-col rounded border p-2 text-sm", {
        "border-red-500": variant === "error",
        "border-green-500": variant === "success",
        "border-blue-500": variant === "info",
      })}
    >
      <div
        className={cn("flex items-center rounded p-1", {
          "bg-red-100": variant === "error",
          "bg-green-100": variant === "success",
          "bg-blue-100": variant === "info",
          "mb-2": !!description,
        })}
      >
        <span
          className={cn("rounded px-2 py-0.5 text-white", {
            "bg-red-500": variant === "error",
            "bg-green-500": variant === "success",
            "bg-blue-500": variant === "info",
          })}
        >
          {(MESSAGE as any)[variant]}
        </span>
        <span
          className={cn("ml-2", {
            "text-red-800": variant === "error",
            "text-green-800": variant === "success",
            "text-blue-800": variant === "info",
          })}
        >
          {title}
        </span>
      </div>
      {description && (
        <span
          className={cn("ml-2", {
            "text-red-800": variant === "error",
            "text-green-800": variant === "success",
            "text-blue-800": variant === "info",
          })}
        >
          {description}
        </span>
      )}
    </div>
  )
}
