import { isSameDay } from "date-fns";
import { useEffect, useState } from "react";

type CalendarCell = number | null;
type CalendarRow = CalendarCell[];

interface CalendarProps {
  initialDate?: Date;
  // Optional callback for when this calendar is clicked
  onClick?: (day: Date | null) => void;
  datesToHighlight?: Date[];
}

const Calendar: React.FC<CalendarProps> = ({
  initialDate = new Date(),
  onClick,
  datesToHighlight,
}) => {
  // State to track the current viewed month and year
  const [currentDate, setCurrentDate] = useState(initialDate);

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  const [calendarCells, setCalendarCells] = useState<CalendarCell[]>([]);

  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  useEffect(() => {
    // Calculate days in month (i.e. the day of the month of the last day of the month)
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Get the day of the week of the first day of the month (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const calendarCells: CalendarCell[] = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) calendarCells.push(null);

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) calendarCells.push(day);

    // Add empty cells to fill the last row of the grid
    while (calendarCells.length % 7 !== 0) calendarCells.push(null);

    setCalendarCells(calendarCells);
  }, [year, month]); // Now this will re-run whenever the month or year changes

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

  const handleClick = (day: CalendarCell) => {
    if (!onClick) return;
    if (day === null) {
      onClick(null);
      return;
    }
    // If we reach this point, we know that day !== null and onDayClick is truthy
    // Create a new Date object for the clicked day
    const clickedDate = new Date(year, month, day);
    onClick(clickedDate);
  };

  // Calculate if we need all rows or can display fewer
  const visibleRows = rows.filter((row, index) => {
    if (index === 5) {
      return row.some((cell) => cell !== null);
    }
    return true;
  });

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

  const calendarHeader = (
    <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
      {previousMonthButton}
      <h2 className="font-bold text-xl">
        {currentDate.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        })}
      </h2>
      {nextMonthButton}
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
  const CellLabel = ({ day }: { day: number }) => (
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

  const Cell = ({ day }: { day: number | null }) => (
    <div
      className={`
        p-2 w-16 h-16 border-r last:border-r-0 relative 
        ${
          day === null
            ? "bg-gray-50"
            : shouldHighlight(day)
            ? "bg-blue-100 hover:bg-blue-200 cursor-pointer"
            : "bg-white hover:bg-gray-100 cursor-pointer"
        }`}
      onClick={() => handleClick(day)}
    >
      {day && <CellLabel day={day} />}
    </div>
  );

  const grid = (
    <div>
      {visibleRows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="grid grid-cols-7 border-b last:border-b-0"
        >
          {row.map((day, dayIndex) => (
            <Cell day={day} key={dayIndex} />
          ))}
        </div>
      ))}
    </div>
  );

  return (
    <div className="rounded-lg shadow-lg bg-white overflow-hidden inline-block">
      <div onClick={() => handleClick(null)}>
        {calendarHeader}
        {daysOfWeekHeader}
      </div>
      {grid}
    </div>
  );
};

export default Calendar;
