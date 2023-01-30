import { useEffect, useState } from "react"
import {
  add,
  addMonths,
  format,
  getDate,
  getDay,
  getMonth,
  getYear,
  isEqual,
  isToday,
  sub,
  subMonths,
} from "date-fns"

import { Button } from "./button"
import { Icons } from "./icons"
import { cn } from "./utils"

function getDaysInMonth(month: number, year: number) {
  const date = new Date(year, month, 1)
  const days = []
  while (date.getMonth() === month) {
    days.push(new Date(date))
    date.setDate(date.getDate() + 1)
  }
  return days
}

function weekdayNames(
  locale: string | string[],
  weekStart = 0,
  type: Intl.DateTimeFormatOptions["weekday"] = "narrow"
) {
  return Array.from(Array(7).keys()).map((d) =>
    nameOfDay(locale, d + weekStart, type)
  )
}

function nameOfDay(
  locale: string | string[] | undefined,
  day: number,
  type: Intl.DateTimeFormatOptions["weekday"] = "narrow"
) {
  return new Intl.DateTimeFormat(locale, { weekday: type })
    .format(new Date(1998, 0, day + 4))
    .replace(".", "")
}

const formatDatetime = (date: Date) => {
  return `${new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    timeZone: "America/Sao_Paulo",
  }).format(date)} de ${new Intl.DateTimeFormat("pt-BR", {
    year: "numeric",
    timeZone: "America/Sao_Paulo",
  }).format(date)}`
}

export const getCalendarDates = (date: Date) => {
  const currentMonth = getDaysInMonth(getMonth(date), getYear(date))
  const previousMonth = getDaysInMonth(
    getMonth(subMonths(date, 1)),
    getYear(date)
  )
  const nextMonth = getDaysInMonth(getMonth(addMonths(date, 1)), getYear(date))
  const previousDates = previousMonth.slice(
    previousMonth.length - getDay(currentMonth[0])
  )
  const previousAndCurrent = [...previousDates, ...currentMonth]
  const nextDates = nextMonth.slice(0, 42 - previousAndCurrent.length)
  const allDates = [...previousAndCurrent, ...nextDates]
  return {
    currentMonth,
    nextDates,
    previousDates,
    allDates,
    firstDate: allDates[0],
    lastDate: allDates[allDates.length - 1],
  }
}

export type CalendarProps = {
  date: Date
  onChange: (date: Date) => void
  onChangeMonth?: (date: Date) => void
  availableDates?: string[] | "all" | "none"
}

export const Calendar = ({
  date: globalDate,
  onChange,
  availableDates = "all",
  onChangeMonth,
}: CalendarProps) => {
  const [date, setDate] = useState(globalDate)
  const [dates, setDates] = useState<Date[] | null>(null)
  const [previousMonthDates, setPreviousMonthDates] = useState<Date[] | null>(
    null
  )
  const [nextMonthDates, setNextMonthDates] = useState<Date[] | null>(null)

  useEffect(() => {
    setDate(globalDate)
  }, [globalDate])

  useEffect(() => {
    const { previousDates, nextDates, allDates } = getCalendarDates(date)
    setPreviousMonthDates(previousDates)
    setNextMonthDates(nextDates)
    setDates(allDates)
    if (onChangeMonth) {
      onChangeMonth(date)
    }
  }, [date, onChangeMonth])

  const onPreviousMonth = () => setDate(sub(date, { months: 1 }))
  const onNextMonth = () => setDate(add(date, { months: 1 }))

  const getVariant = (date: Date) => {
    if (isEqual(date, globalDate)) return "default"
    if (isToday(date)) return "subtle"
    return "ghost"
  }

  return (
    <>
      <div className="flex items-center justify-between space-x-2 py-2 pl-4 pr-2">
        <span className="cap cursor-default text-sm font-medium">
          {formatDatetime(date)}
        </span>
        <div className="flex space-x-1">
          <Button onClick={onPreviousMonth} variant="ghost" size="sm">
            <Icons.chevron.left className="h-4 w-4" />
          </Button>
          <Button onClick={onNextMonth} variant="ghost" size="sm">
            <Icons.chevron.right className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-7 border-b px-2 pt-2 pb-4">
        {weekdayNames("pt-BR", 0).map((weekDay, index) => (
          <span
            className="text-center text-xs text-gray-500"
            key={`${weekDay}-${index}`}
          >
            {weekDay}
          </span>
        ))}
      </div>
      <div className="my-4 mx-2 grid grid-cols-7 gap-y-1">
        {dates?.map((date, index) => {
          if (date) {
            return (
              <div className="flex justify-center">
                <Button
                  key={index}
                  onClick={() => onChange(date)}
                  size="sm"
                  variant={getVariant(date)}
                  disabled={
                    availableDates === "none" ||
                    !availableDates?.includes(format(date, "yyyy-MM-dd"))
                  }
                  autoFocus={isEqual(date, globalDate) ?? isToday(date)}
                  className={cn("disabled:opacity-10", {
                    "opacity-50":
                      previousMonthDates?.includes(date) ||
                      nextMonthDates?.includes(date),
                  })}
                  style={{ aspectRatio: "1 / 1" }}
                >
                  {getDate(date)}
                </Button>
              </div>
            )
          }
        })}
      </div>
    </>
  )
}
