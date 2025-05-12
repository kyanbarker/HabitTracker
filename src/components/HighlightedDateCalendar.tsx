import { Box } from "@mui/material";
import Badge from "@mui/material/Badge";
import { blue } from "@mui/material/colors";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import { isSameDay } from "date-fns";
import { useEffect, useRef } from "react";

interface HighlightedDateCalendarProps
  extends Omit<React.ComponentProps<typeof DateCalendar>, "slots"> {
  highlightedDates: Date[];
  onOutsideClick?: () => void;
}

const HighlightedDateCalendar: React.FC<HighlightedDateCalendarProps> = ({
  highlightedDates,
  onOutsideClick,
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Add click outside detection
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const isClickOutside =
        containerRef.current &&
        !containerRef.current.contains(event.target as Node);

      if (isClickOutside) {
        onOutsideClick?.();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [onOutsideClick]);

  const HighlightedDay = (
    pickersDayProps: React.ComponentProps<typeof PickersDay>
  ) => {
    const { day, outsideCurrentMonth, ...other } = pickersDayProps;

    const shouldHighlight =
      !outsideCurrentMonth &&
      highlightedDates.some((date) => isSameDay(date, day));

    return shouldHighlight ? (
      <Badge key={day.toString()}>
        <PickersDay
          day={day}
          outsideCurrentMonth={outsideCurrentMonth}
          {...other}
          sx={{
            backgroundColor: blue[400],
            color: "white",
            "&:hover": {
              backgroundColor: blue[400], // Override the default hover effect
            },
            ...(pickersDayProps.sx || {}),
          }}
        />
      </Badge>
    ) : (
      <PickersDay {...pickersDayProps} />
    );
  };

  return (
    <Box ref={containerRef} sx={{ width: "min-content" }}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DateCalendar
          {...props}
          slots={{
            day: HighlightedDay,
          }}
        />
      </LocalizationProvider>
    </Box>
  );
};

export default HighlightedDateCalendar;
