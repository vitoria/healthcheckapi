import { Icons, cn } from "ui"

type StepperProps = {
  currentStep: number
  steps: Step[]
}

type Step = {
  title: string
}

type StepProps = {
  isChecked: boolean
  isCurent: boolean
  label: string
} & Step

const StepperItem = ({ title, label, isChecked, isCurent }: StepProps) => {
  return (
    <div className="flex flex-col items-center space-x-2">
      <div className="h-8 w-7">
        {isChecked ? (
          <Icons.checkCircle className="text-green-500" />
        ) : (
          <div
            className={cn("flex justify-center rounded-full border-2", {
              "border-green-500 text-green-500": isChecked,
              "border-green-500 text-green-600": !isChecked && isCurent,
              "border-gray-300 text-gray-500": !isChecked && !isCurent,
            })}
          >
            {label}
          </div>
        )}
      </div>
      <h1>{title}</h1>
    </div>
  )
}

const Stepper = ({ steps, currentStep }: StepperProps) => {
  return (
    <div className="flex items-center justify-center space-x-4">
      {steps.map((step, index) => (
        <>
          <StepperItem
            key={`step-${index}`}
            label={(index + 1).toString()}
            title={step.title}
            isChecked={index < currentStep}
            isCurent={index === currentStep}
          />
          {index < steps.length - 1 && (
            <div className="mb-6 h-px w-32 bg-gray-300"></div>
          )}
        </>
      ))}
    </div>
  )
}

export default Stepper
