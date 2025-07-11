import { Box } from "@mui/material";
import { differenceInDays, max } from "date-fns";
import { useState } from "react";
import EditableTable from "./components/EditableTable";
import HighlightedCalendar from "./components/HighlightedCalendar";
import ClickController from "./components/ClickController";

function App() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const engagementDates = [
    new Date(2025, 4, 3),
    new Date(2025, 4, 1),
    new Date(2025, 3, 16),
    new Date(2025, 3, 17),
    new Date(2025, 3, 18),
    new Date(2025, 3, 20),
  ];
  const lastEngagement = max(engagementDates);
  const numDaysSinceLastEngagement = differenceInDays(
    new Date(),
    lastEngagement
  );

  const [rows, setRows] = useState([
    ["habit", "value", "unit", "notes"],
    ["reading", "10", "pages", ""],
    ["mood", "7", "out of 10", ""],
    ["exercise", "30", "minutes", "running"],
  ]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, padding: 2 }}>
      <ClickController onOutsideClick={() => setSelectedDate(null)}>
        <HighlightedCalendar
          highlightedDates={engagementDates}
          value={selectedDate}
          onChange={(value) => setSelectedDate(value)}
          minDate={new Date(2000, 0, 15)}
          maxDate={new Date()}
          views={["year", "month", "day"]}
          disableHighlightToday={true}
          disableFuture={true}
        />
      </ClickController>
      <h2>{selectedDate?.toDateString() || "No date selected"}</h2>
      <h2>
        Last Engagement: {lastEngagement.toDateString()} (
        {numDaysSinceLastEngagement} Days Ago)
      </h2>
      <Box sx={{ height: "400px", width: "800px", overflow: "auto" }}>
        <EditableTable
          rows={rows}
          setRows={setRows}
          columnConfig={[
            { isLocked: true },
            { type: "number" },
            { isLocked: true },
          ]}
        />
      </Box>
    </Box>
  );
}

export default App;
