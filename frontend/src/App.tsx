import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import ClickController from "./components/ClickController";
import { EventForm } from "./components/EventForm";
import { EventsView } from "./components/EventsView";
import HighlightedCalendar from "./components/HighlightedCalendar";
import { Event } from "./types/event";

const App = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    fetch("http://localhost:3001/events")
      .then((res) => res.json())
      .then((events) => setEvents(events))
      .catch((err) => console.error("Failed to fetch events:", err));
  }, [refresh]);

  const eventDates = events.map((event) => new Date(event.date));

  const handleAddEvent = async (newEvent: Event) => {
    try {
      const res = await addEvent(newEvent);
      if (res.ok) {
        setRefresh((x) => x + 1); // Trigger useEffect to refetch events
      } else {
        console.error("Failed to add event to DB");
      }
    } catch (err) {
      console.error("Failed to add event:", err);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, padding: 2 }}>
      <EventForm onSubmit={handleAddEvent} />
      <ClickController onOutsideClick={() => setSelectedDate(null)}>
        <HighlightedCalendar
          highlightedDates={eventDates}
          value={selectedDate}
          onChange={(value) => setSelectedDate(value)}
          minDate={new Date(2000, 0, 15)}
          maxDate={new Date()}
          views={["year", "month", "day"]}
          disableHighlightToday={true}
          disableFuture={true}
        />
      </ClickController>
      {selectedDate && <EventsView date={selectedDate} events={events} />}
    </Box>
  );
};

function addEvent(event: Event) {
  return fetch("http://localhost:3001/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
  });
}

export default App;
