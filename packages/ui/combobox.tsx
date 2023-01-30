import * as React from "react"
import { PopoverProps } from "@radix-ui/react-popover"
import { Command, useCommandState } from "cmdk"
import { Plus } from "lucide-react"

import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { cn } from "./utils"

export type ComboboxProps = Pick<PopoverProps, "open" | "onOpenChange"> & {
  placeholder: string
  title: string
  data: any
  onChange: (data: any) => void
  keyExtractor: (data: any) => string
  onCreate?: (value: string) => void
  loading?: boolean
  disabled?: boolean
  renderItem: (data: any, key?: string, index?: number) => JSX.Element
}

const List = (props: ComboboxProps) => {
  const count = useCommandState((state) => state.filtered.count)
  const isEmpty = count === 0
  const value = useCommandState((state) => state.value)
  const [search, setSearch] = React.useState("")

  return (
    <>
      <Command.Input
        placeholder={props.placeholder}
        value={search}
        onValueChange={setSearch}
        className={cn(
          "w-full border-black/5 bg-transparent p-4 text-lg font-light placeholder:text-gray-500 focus:outline-none sm:py-2 sm:px-3 sm:text-sm",
          { "border-b": !isEmpty }
        )}
      />
      <Command.List
        className={cn("max-h-[200px] overflow-y-auto", {
          "p-2 sm:p-1": !isEmpty,
        })}
      >
        {props.loading && <Command.Loading>Carregando...</Command.Loading>}
        {props.data.map((item: any, index: number) => (
          <Command.Item
            key={props.keyExtractor(item)}
            onSelect={() => props.onChange(item)}
            className="combobox-item text-body animation flex h-10 cursor-pointer items-center justify-between rounded px-2 text-sm hover:bg-black/5 sm:h-9"
          >
            {props.renderItem(item, props.keyExtractor(item), index)}
          </Command.Item>
        ))}
        <Command.Item
          value={search}
          onSelect={() => props.onCreate?.(search)}
          className={cn(
            "combobox-item text-body animation flex h-10 cursor-pointer items-center justify-between rounded px-2 text-sm hover:bg-black/5 sm:h-9",
            {
              flex: value === search && count === 1,
              hidden: count > 1 || !props.onCreate,
            }
          )}
        >
          <div className="flex items-center space-x-2">
            <Plus className="h-4 w-4 stroke-2 text-gray-400" />
            <span>{`Criar ${props.title.toLowerCase()} "${search}"`}</span>
          </div>
        </Command.Item>
      </Command.List>
    </>
  )
}

export const Combobox = (props: React.PropsWithChildren<ComboboxProps>) => {
  return (
    <Popover open={props.open} onOpenChange={props.onOpenChange}>
      <PopoverTrigger asChild disabled={props.disabled}>
        {props.children}
      </PopoverTrigger>
      <PopoverContent align="start" combo>
        <Command>
          <div className="mt-4 ml-4 w-fit rounded bg-gray-100 py-1 px-2 text-xs text-gray-400 sm:hidden">
            {props.title}
          </div>
          <List {...props} />
        </Command>
      </PopoverContent>
    </Popover>
  )
}

Combobox.displayName = "Combobox"
