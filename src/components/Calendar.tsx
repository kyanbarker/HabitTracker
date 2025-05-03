import { useState, useEffect } from "react";

// Define types for our state and parameters
type CalendarDay = number | null;
type CalendarWeek = CalendarDay[];

interface CalendarProps {
  // Using Date object for input
  date?: Date;
  // Optional callback for when a day is clicked
  onDayClick?: (day: Date | null) => void;
}

const Calendar: React.FC<CalendarProps> = ({
  date = new Date(),
  onDayClick,
}) => {
  const month = date.getMonth();
  const year = date.getFullYear();

  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);

  useEffect(() => {
    // Calculate days in month (i.e. the day of the month of the last day of the month)
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Get the day of the week of the first day of the month (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const calendarDays: CalendarDay[] = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) calendarDays.push(null);

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) calendarDays.push(day);

    // Add empty cells for days after the last day of the month
    while (calendarDays.length % 7 !== 0) calendarDays.push(null);

    setCalendarDays(calendarDays);
  }, [year, month]);

  const weeks: CalendarWeek[] = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
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

  const handleDayClick = (day: CalendarDay) => {
    if (!onDayClick) return;
    if (day === null) {
      onDayClick(null);
      return;
    }
    // If we reach this point, we know that day !== null and onDayClick is truthy
    // Create a new Date object for the clicked day
    const clickedDate = new Date(year, month, day);
    onDayClick(clickedDate);
  };

  // Calculate if we need all weeks or can display fewer
  const visibleWeeks = weeks.filter((week, index) => {
    if (index === 5) {
      return week.some((day) => day !== null);
    }
    return true;
  });

  const calendarHeader = (
    <div className="bg-blue-600 text-white p-4">
      <h2 className="font-bold text-xl">
        {date.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        })}
      </h2>
    </div>
  );

  const daysOfWeekHeader = (
    <div className="grid grid-cols-7 border-b">
      {daysOfWeek.map((day, index) => (
        <div
          key={index}
          className="p-2 w-16 text-center font-medium text-gray-800 text-sm"
        >
          {day}
        </div>
      ))}
    </div>
  );

  const dayGrid = (
    <div>
      {visibleWeeks.map((week, weekIndex) => (
        <div
          key={weekIndex}
          className="grid grid-cols-7 border-b last:border-b-0"
        >
          {week.map((day, dayIndex) => (
            <div
              key={dayIndex}
              className={`
                p-2 w-16 h-16 border-r last:border-r-0 relative 
                ${
                  day
                    ? "bg-white hover:bg-gray-100 cursor-pointer"
                    : "bg-gray-50"
                }`}
              onClick={() => handleDayClick(day)}
            >
              {day && (
                <div
                  className={`${
                    day === date.getDate()
                      ? "h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center"
                      : "text-gray-700"
                  }`}
                >
                  {day}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  return (
    <div className="rounded-lg shadow-lg bg-white overflow-hidden inline-block">
      <div onClick={() => handleDayClick(null)}>
        {calendarHeader}
        {daysOfWeekHeader}
      </div>
      {dayGrid}
    </div>
  );
};

export default Calendar;
