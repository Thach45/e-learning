"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { TCourseInfo } from "@/types"

interface SearchableDropdownProps {
  items: TCourseInfo[] | undefined | null
  placeholder?: string
  emptyMessage?: string
  onChange?: (value: string) => void
}

export function SearchableDropdown({
  items,
  placeholder = "Select an item...",
  emptyMessage = "No items found.",
  onChange,
}: SearchableDropdownProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
          {value ? items!.find((item) => item._id === value)?.title : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search items..." />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {items!.map((item) => (
                <CommandItem
                  key={item._id}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : item._id)
                    onChange?.(currentValue === value ? "" : item._id)
                    setOpen(false)
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", value === item._id ? "opacity-100" : "opacity-0")} />
                  {item.title}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

