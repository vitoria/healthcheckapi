import * as React from "react"
import PhoneNumberInput, { Props } from "react-phone-number-input/input"

import { cn } from "./utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        className={cn(
          "flex h-9 w-full rounded-md border border-slate-300 bg-transparent py-2 px-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-50 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Input.displayName = "Input"

export type PhoneInputProps = Props<
  Omit<React.ComponentProps<"input">, "onChange">
>

const PhoneInput = ({
  defaultCountry = "BR",
  minLength = 14,
  maxLength = 15,
  ...props
}: PhoneInputProps) => {
  return (
    <PhoneNumberInput
      defaultCountry={defaultCountry}
      inputComponent={Input}
      minLength={minLength}
      maxLength={maxLength}
      {...props}
    />
  )
}

PhoneInput.displayName = "PhoneInput"

export { Input, PhoneInput }
