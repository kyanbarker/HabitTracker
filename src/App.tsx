import { differenceInDays, max } from "date-fns";
import { useState } from "react";
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
  const habits = ["Excercise", "Meditation", "Reading", "Drinking"]
  const lastEngagement = max(engagements);
  const numDaysSinceLastEngagement = differenceInDays(
    new Date(),
    lastEngagement
  );

  // Handler for clicks outside the calendar
  const handleOutsideClick = () => {
    setSelectedDate(null);
  };

  return (
    <div className="p-8">
      <HighlightedDateCalendar
        highlightedDates={engagements}
        defaultValue={new Date()}
        value={selectedDate}
        onChange={(value) => setSelectedDate(value)}
        minDate={new Date(2000, 0, 15)}
        maxDate={new Date()}
        onOutsideClick={handleOutsideClick}
        views={["year", "month", "day"]}
        disableHighlightToday={true}
        disableFuture={true}
      />
      <h2>{selectedDate?.toDateString() || "No date selected"}</h2>
      <h2>
        Last Engagement: {lastEngagement.toDateString()} (
        {numDaysSinceLastEngagement} Days Ago)
      </h2>
    </div>
  );
}

export default App;
