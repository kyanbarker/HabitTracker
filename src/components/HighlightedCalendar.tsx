import Badge from "@mui/material/Badge";
import { blue } from "@mui/material/colors";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import { isSameDay } from "date-fns";
import React from "react";

/**
 * Props for a highlighted date component.
 * Used for custom rendering of highlighted dates.
 */
interface HighlightedDateComponentProps
  extends React.ComponentProps<typeof PickersDay> {
  highlightedDates: Date[];
}

const DefaultHighlightedDateComponent: React.FC<
  HighlightedDateComponentProps
> = ({ highlightedDates, ...pickersDayProps }) => {
  const { day, outsideCurrentMonth, sx, ...other } = pickersDayProps;

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
            backgroundColor: blue[400], // Nullify the default hover effect
          },
          ...(sx || {}), // Preserve any additional styles passed in
        }}
      />
    </Badge>
  ) : (
    <PickersDay {...pickersDayProps} />
  );
};

/**
 * `HighlightedCalendarProps` extends `DateCalendarProps`
 * but omits the `slots` property from `DateCalendarProps`,
 * since `HighlightedCalendar` is simply a `DateCalendar` with a value for `slots` supplied;
 * hence, it would not make since for the client to specify a value for `slots`.
 *
 * @param highlightedDates - the list of dates to highlight in this calendar
 * @param highlightedDateComponent - optional custom component for highlighted dates
 */
interface HighlightedCalendarProps
  extends Omit<React.ComponentProps<typeof DateCalendar>, "slots"> {
  highlightedDates: Date[];
  HighlightedDateComponent?: React.FC<HighlightedDateComponentProps>;
}

const HighlightedCalendar: React.FC<HighlightedCalendarProps> = ({
  highlightedDates,
  HighlightedDateComponent,
  ...props
}) => (
  <LocalizationProvider dateAdapter={AdapterDateFns}>
    <DateCalendar
      {...props}
      slots={{
        day: (pickersDayProps: React.ComponentProps<typeof PickersDay>) =>
          HighlightedDateComponent ? (
            <HighlightedDateComponent
              {...pickersDayProps}
              highlightedDates={highlightedDates}
            />
          ) : (
            <DefaultHighlightedDateComponent
              {...pickersDayProps}
              highlightedDates={highlightedDates}
            />
          ),
      }}
    />
  </LocalizationProvider>
);

export default HighlightedCalendar;
