import { isAfter, isBefore, isSameDay, isSameMonth } from "date-fns";
import { useEffect, useState } from "react";
import { isBetween } from "../util/date-util";

type CalendarCell = { day: number } | null;
type CalendarRow = CalendarCell[];

const EMPTY_CELL = null;
const isEmptyCell = (cell: CalendarCell) => cell === EMPTY_CELL;
const isDayCell = (cell: CalendarCell) => cell !== EMPTY_CELL;

interface CalendarProps {
  initialViewDate?: Date;
  // Optional callback for when this calendar is clicked
  onClick?: (day: Date | null) => void;
  datesToHighlight?: Date[];
  startDate?: Date;
  endDate?: Date;
}

const Calendar: React.FC<CalendarProps> = ({
  initialViewDate = new Date(),
  onClick,
  datesToHighlight,
  startDate,
  endDate,
}) => {
  const [viewDate, setViewDate] = useState(initialViewDate);

  const month = viewDate.getMonth();
  const year = viewDate.getFullYear();

  const [calendarCells, setCalendarCells] = useState<CalendarCell[]>([]);

  const goToPreviousMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  useEffect(() => {
    // Calculate num days in month (i.e. the day of the month of the last day of the month)
    const numDaysInMonth = new Date(year, month + 1, 0).getDate();

    // Get the day of the week of the first day of the month (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const calendarCells: CalendarCell[] = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarCells.push(EMPTY_CELL);
    }

    // Add days of the month
    for (let day = 1; day <= numDaysInMonth; day++) {
      const date = new Date(year, month, day);
      if (startDate && endDate) {
        calendarCells.push(
          isBetween(date, startDate, endDate) ? { day } : EMPTY_CELL
        );
      } else if (startDate && !endDate) {
        calendarCells.push(!isBefore(date, startDate) ? { day } : EMPTY_CELL);
      } else if (!startDate && endDate) {
        calendarCells.push(!isAfter(date, endDate) ? { day } : EMPTY_CELL);
      } else {
        calendarCells.push({ day });
      }
    }

    // Add empty cells to fill the last row of the grid
    while (calendarCells.length % 7 !== 0) {
      calendarCells.push(EMPTY_CELL);
    }

    setCalendarCells(calendarCells);
  }, [year, month, startDate, endDate]);

  const rows: CalendarRow[] = [];
  for (let i = 0; i < calendarCells.length; i += 7) {
    rows.push(calendarCells.slice(i, i + 7));
  }

  const daysOfWeek: string[] = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ];

  const handleCellClick = (cell: CalendarCell) => {
    if (!onClick) return;
    onClick(isEmptyCell(cell) ? null : new Date(year, month, cell!.day));
  };
  const handleClickOutsideGrid = () => {
    if (!onClick) return;
    onClick(null);
  };

  const previousMonthButton = (
    <button
      onClick={goToPreviousMonth}
      className="text-white hover:bg-blue-700 rounded-full p-1"
      aria-label="Previous month"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </button>
  );

  const nextMonthButton = (
    <button
      onClick={goToNextMonth}
      className="text-white hover:bg-blue-700 rounded-full p-1"
      aria-label="Next month"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </button>
  );

  const shouldShowPreviousMonthButton =
    !startDate || !isSameMonth(viewDate, startDate);

  const shouldShowNextMonthButton = !endDate || !isSameMonth(viewDate, endDate);

  const calendarHeader = (
    <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
      {shouldShowPreviousMonthButton ? (
        previousMonthButton
      ) : (
        <div className="w-6" />
      )}
      <h2 className="font-bold text-xl">
        {viewDate.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        })}
      </h2>
      {shouldShowNextMonthButton ? nextMonthButton : <div className="w-6" />}
    </div>
  );

  const daysOfWeekHeader = (
    <div className="grid grid-cols-7 border-b">
      {daysOfWeek.map((day, index) => (
        <div
          key={index}
          className="p-2 w-16 text-center font-medium text-gray-800 text-sm border-r last:border-r-0"
        >
          {day}
        </div>
      ))}
    </div>
  );

  const today = new Date();
  const isToday = (day: number) => isSameDay(today, new Date(year, month, day));

  const DayCellLabel = ({ day }: { day: number }) => (
    <div
      className={`${
        isToday(day)
          ? "h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center"
          : "text-gray-700"
      }`}
    >
      {day}
    </div>
  );

  const shouldHighlight = (day: number) =>
    datesToHighlight?.some((dateToHighlight) =>
      isSameDay(dateToHighlight, new Date(year, month, day))
    );

  const Cell = ({ cell }: { cell: CalendarCell }) => (
    <div
      className={`
        p-2 w-16 h-16 border-r last:border-r-0 relative 
        ${
          isEmptyCell(cell)
            ? "bg-gray-50"
            : shouldHighlight(cell!.day)
            ? "bg-blue-100 hover:bg-blue-200 cursor-pointer"
            : "bg-white hover:bg-gray-100 cursor-pointer"
        }`}
      onClick={() => handleCellClick(cell)}
    >
      {isDayCell(cell) && <DayCellLabel day={cell!.day} />}
    </div>
  );

  const grid = (
    <div>
      {rows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="grid grid-cols-7 border-b last:border-b-0"
        >
          {row.map((cell, cellIndex) => (
            <Cell cell={cell} key={cellIndex} />
          ))}
        </div>
      ))}
    </div>
  );

  return (
    <div className="rounded-lg shadow-lg bg-white overflow-hidden inline-block">
      <div onClick={() => handleClickOutsideGrid()}>
        {calendarHeader}
        {daysOfWeekHeader}
      </div>
      {grid}
    </div>
  );
};

export default Calendar;
