import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import Badge from "@mui/material/Badge";
import { isSameDay } from "date-fns";
import { useEffect, useRef } from "react";

// Define the props for our component without generic type parameters
interface HighlightedDateCalendarProps
  extends Omit<React.ComponentProps<typeof DateCalendar>, "slots"> {
  highlightedDates: Date[];
  slots?: Omit<React.ComponentProps<typeof DateCalendar>["slots"], "day"> & {
    day?: React.ComponentType<React.ComponentProps<typeof PickersDay>>;
  };
  onOutsideClick?: () => void;
}

const HighlightedDateCalendar: React.FC<HighlightedDateCalendarProps> = ({
  highlightedDates,
  slots: userSlots,
  onOutsideClick,
  ...otherProps
}) => {
  // Create a reference to track the calendar element
  const calendarRef = useRef<HTMLDivElement>(null);

  // Add click outside detection
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        onOutsideClick?.();
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onOutsideClick]);

  // Get the user's custom day component or fall back to PickersDay
  const UserDayComponent = userSlots?.day || PickersDay;

  // Create a day component that adds highlighting
  const HighlightedDay = (props: React.ComponentProps<typeof PickersDay>) => {
    const { day, outsideCurrentMonth, ...other } = props;

    // Check if the current day should be highlighted
    const isHighlighted =
      !outsideCurrentMonth &&
      highlightedDates.some((date) => isSameDay(date, day));

    // If highlighted, wrap in Badge, otherwise just render the day component
    return isHighlighted ? (
      <Badge
        key={day.toString()}
        overlap="circular"
        // badgeContent="1"
        color="primary"
      >
        <UserDayComponent
          day={day}
          outsideCurrentMonth={outsideCurrentMonth}
          {...other}
          sx={{
            ...(isHighlighted
              ? {
                  backgroundColor: "primary.light",
                  color: "primary.contrastText",
                  "&:hover": {
                    backgroundColor: "primary.main",
                  },
                }
              : {}),
            ...(props.sx || {}),
          }}
        />
      </Badge>
    ) : (
      <UserDayComponent {...props} />
    );
  };

  return (
    <div ref={calendarRef} className="w-min">
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DateCalendar
          {...otherProps}
          slots={{
            ...(userSlots || {}),
            day: HighlightedDay,
          }}
        />
      </LocalizationProvider>
    </div>
  );
};

export default HighlightedDateCalendar;
