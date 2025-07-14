import { Box } from "@mui/material";
import { useState } from "react";
import ClickController from "./components/ClickController";
import HighlightedCalendar from "./components/HighlightedCalendar";

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
    </Box>
  );
}

export default App;
