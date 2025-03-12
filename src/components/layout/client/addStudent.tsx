"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { getFullUser } from "@/lib/actions/user.actions"
import { TUser } from "@/database/user.model"
import { Badge } from "@/components/ui/badge"
interface IAddStudentsProps {
    setStudent: (students: string[]) => void
}
export function AddStudents({ setStudent }: IAddStudentsProps) {
  const [open, setOpen] = React.useState(false)
  const [selectedValues, setSelectedValues] = React.useState<string[]>([])
  const [students, setStudents] = React.useState<TUser[] | undefined | null>([])

  React.useEffect(() => {
    const fetch = async () => {
      const user = await getFullUser()
      setStudents(user)
      setStudent(selectedValues)
    }
    fetch()
  }, [selectedValues])

  const toggleSelection = (id: string) => {
    setSelectedValues((prev) => {
      const newValues = prev.includes(id)
        ? prev.filter((name) => name !== id) // Bỏ chọn nếu đã chọn trước đó
        : [...prev, id] // Thêm nếu chưa chọn
  
        return newValues // Cập nhật state
    })
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-[250px] justify-between">
            {selectedValues.length > 0 ? `${selectedValues.length} học viên đã chọn` : "Chọn học viên..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput placeholder="Tìm kiếm..." className="h-9" />
          <CommandList>
            <CommandEmpty>Không tìm thấy học viên.</CommandEmpty>
            <CommandGroup>
              {students!.map((student) => (
                <CommandItem
                  key={student._id as string}
                  value={student._id as string}
                  onSelect={() => toggleSelection(student._id as string)}
                >
                  {student.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      selectedValues.includes(student._id as string) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {student.role === "USER" ? <Badge>Học viên</Badge> : <Badge>Giáo viên</Badge>}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
