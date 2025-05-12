import { Box } from "@mui/material";
import { differenceInDays, max } from "date-fns";
import { useState } from "react";
import EditableTable from "./components/EditableTable";
import HighlightedDateCalendar from "./components/HighlightedDateCalendar";

function App() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const engagements = [
    new Date(2025, 4, 3),
    new Date(2025, 4, 1),
    new Date(2025, 3, 16),
    new Date(2025, 3, 17),
    new Date(2025, 3, 18),
    new Date(2025, 3, 20),
  ];
  const habits = [
    "Excercise (minutes)",
    "Meditation (minutes)",
    "Reading (minutes)",
    "# Drinks",
  ];
  const lastEngagement = max(engagements);
  const numDaysSinceLastEngagement = differenceInDays(
    new Date(),
    lastEngagement
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, padding: 2 }}>
      <HighlightedDateCalendar
        highlightedDates={engagements}
        value={selectedDate}
        onChange={(value) => setSelectedDate(value)}
        minDate={new Date(2000, 0, 15)}
        maxDate={new Date()}
        onOutsideClick={() => setSelectedDate(null)}
        views={["year", "month", "day"]}
        disableHighlightToday={true}
        disableFuture={true}
      />
      <h2>{selectedDate?.toDateString() || "No date selected"}</h2>
      <h2>
        Last Engagement: {lastEngagement.toDateString()} (
        {numDaysSinceLastEngagement} Days Ago)
      </h2>
      <Box sx={{ height: "400px", width: "800px", overflow: "auto" }}>
        <EditableTable />
      </Box>
    </Box>
  );
}

export default App;
