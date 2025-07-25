import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import EventsView from "./components/EventsView";
import HighlightedCalendar from "./components/HighlightedCalendar";
import { Event } from "./types/event";

const App = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<(Event & { id: number })[]>([]);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const fetchedEvents = await getEvents();
        setEvents(
          fetchedEvents.sort((a, b) => {
            if (a.series.name < b.series.name) return -1;
            if (a.series.name > b.series.name) return 1;
            return 0;
          })
        );
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    }
    fetchEvents();
  }, [refresh]);

  const eventDates = events.map((event) => new Date(event.date));

  const handleDeleteEvent = async (event: Event & { id: number }) => {
    try {
      await deleteEvent(event.id);
      setRefresh((x) => x + 1); // Trigger useEffect to refetch events
    } catch (error) {
      console.error("Failed to delete event:", error);
    }
  };

  const handleEditEvent = async (
    id: number,
    updateData: Partial<Event>
  ): Promise<void> => {
    try {
      await editEvent(id, updateData);
      setRefresh((x) => x + 1); // Trigger useEffect to refetch events
    } catch (error) {
      console.error("Failed to edit event:", error);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, padding: 2 }}>
      <HighlightedCalendar
        highlightedDates={eventDates}
        value={selectedDate}
        onChange={(value) => setSelectedDate(value)}
        minDate={new Date(2000, 0, 15)}
        maxDate={new Date(2025, 11, 31)}
        views={["year", "month", "day"]}
        disableHighlightToday={true}
      />
      {selectedDate && (
        <EventsView
          date={selectedDate}
          events={events}
          onDelete={handleDeleteEvent}
          onBlur={handleEditEvent}
        />
      )}
    </Box>
  );
};

async function getEvents(): Promise<(Event & { id: number })[]> {
  const res = await fetch("http://localhost:3001/events?include=series");
  if (!res.ok) {
    throw new Error(`Failed to fetch events: ${res}`);
  }
  const events = await res.json();
  return events.map((event: any) => ({
    ...event,
    date: new Date(event.date.substring(0, 10)),
  })) as (Event & { id: number })[];
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

async function deleteEvent(id: number) {
  const res = await fetch(`http://localhost:3001/events/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error(`Failed to delete event: ${res}`);
  }
}

async function editEvent(id: number, updateData: Partial<Event>) {
  const res = await fetch(`http://localhost:3001/events/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updateData),
  });
  if (!res.ok) {
    throw new Error(`Failed to edit event: ${res}`);
  }
}

export default App;
