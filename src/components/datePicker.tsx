import * as React from "react"
import { format, parse } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type DatePickerProps = {
  date?: string // Expecting "yyyy-MM-dd"
  onDateChange?: (date: string) => void
  placeholder?:string
}

export function DatePicker({ date: initialDate, onDateChange,placeholder }: DatePickerProps) {
    const [date, setDate] = React.useState<Date | undefined>(undefined)
    
    React.useEffect(()=>{
      const parsedInitialDate = initialDate ? parse(initialDate, "yyyy-MM-dd", new Date()) : undefined
        setDate(parsedInitialDate)
  },[initialDate])

  const handleSelect = (newDate: Date | undefined) => {
    setDate(newDate)
    if (newDate && onDateChange) {
      onDateChange(format(newDate, "yyyy-MM-dd"))
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!date}
          className={cn(
            "max-w-[200px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "yyyy-MM-dd") : <span>{placeholder?placeholder:"Pick a date"}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
        />
      </PopoverContent>
    </Popover>
  )
}
