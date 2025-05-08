import { differenceInDays, max } from "date-fns";
import { useState } from "react";
import Calendar from "./components/Calendar";

function App() {
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const engagements = [
    new Date(2025, 4, 3),
    new Date(2025, 4, 1),
    new Date(2025, 3, 16),
    new Date(2025, 3, 17),
    new Date(2025, 3, 18),
    new Date(2025, 3, 20),
  ];
  const lastEngagement = max(engagements);
  const numDaysSinceLastEngagement = differenceInDays(
    new Date(),
    lastEngagement
  );
  return (
    <div className="p-8">
      <Calendar
        initialViewDate={new Date(2025, 4)}
        onClick={(day) => setSelectedDay(day)}
        datesToHighlight={engagements}
        startDate={new Date(2025, 0, 11)}
        endDate={new Date(2026, 0, 2)}
      />
      <h2>{selectedDay?.toDateString()}</h2>
      <h2>
        Last Engagement: {lastEngagement.toDateString()} (
        {numDaysSinceLastEngagement} Days Ago)
      </h2>
    </div>
  );
}

export default App;
