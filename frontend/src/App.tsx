import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import ClickController from "./components/ClickController";
import { EventForm } from "./components/EventForm";
import { EventsView } from "./components/EventsView";
import HighlightedCalendar from "./components/HighlightedCalendar";
import { Event } from "./types/event";

const App = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<(Event & { id: number })[]>([]);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    async function fetchEvents() {
      try {
        setEvents(await getEvents());
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    }
    fetchEvents();
  }, [refresh]);

  const eventDates = events.map((event) => new Date(event.date));

  const handleAddEvent = async (newEvent: Event) => {
    try {
      await addEvent(newEvent);
      setRefresh((x) => x + 1); // Trigger useEffect to refetch events
    } catch (error) {
      console.error("Failed to add event:", error);
    }
  };

  const handleDeleteEvent = async (event: Event) => {
    try {
      await deleteEvent(event);
      setRefresh((x) => x + 1); // Trigger useEffect to refetch events
    }
    catch (error) {
      console.error("Failed to delete event:", error);
    }
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, padding: 2 }}>
      <EventForm onSubmit={handleAddEvent} />
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
      {selectedDate && (
        <EventsView
          date={selectedDate}
          events={events}
          onDelete={handleDeleteEvent}
        />
      )}
    </Box>
  );
};

async function getEvents(): Promise<(Event & { id: number })[]> {
  const res = await fetch("http://localhost:3001/events");
  if (!res.ok) {
    throw new Error(`Failed to fetch events: ${res}`);
  }
  return res.json();
}

async function addEvent(event: Event) {
  const res = await fetch("http://localhost:3001/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
  });
  if (!res.ok) {
    throw new Error(`Failed to add event: ${res}`);
  }
}

async function deleteEvent(event: Event) {
  const res = await fetch(`http://localhost:3001/events/${event.id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error(`Failed to delete event: ${res}`);
  }
}

export default App;
