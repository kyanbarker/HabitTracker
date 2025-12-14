import { Box, Button, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { isSameDay } from "date-fns";
import { useEffect, useState } from "react";
import { CrudTable } from "./components/CrudTable";
import EventsView from "./components/EventsView";
import HighlightedCalendar from "./components/HighlightedCalendar";
import RequestAndResponseView from "./components/RequestAndResponseView";
import { Event } from "./types/event";
import { eventApi as eventsApi, seriesApi } from "./util/api";

const seriesColumns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70, type: "number" },
  { field: "name", headerName: "Name", width: 180 },
];

const eventColumns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70, type: "number" },
  {
    field: "series",
    headerName: "Series",
    width: 120,
    valueGetter: (params: any) => params?.row?.series?.name || "",
  },
  { field: "value", headerName: "Value", width: 120 },
  { field: "date", headerName: "Date", width: 160 },
  { field: "notes", headerName: "Notes", width: 200 },
];

const App = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<(Event & { id: number })[]>([]);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const fetchedEvents = await eventsApi.getAll();
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
      await eventsApi.delete(event.id);
      setRefresh((x) => x + 1);
    } catch (error) {
      console.error("Failed to delete event:", error);
    }
  };

  const handleEditEvent = async (id: number, updateData: Partial<Event>) => {
    try {
      await eventsApi.update(id, updateData);
      setRefresh((x) => x + 1);
    } catch (error) {
      console.error("Failed to edit event:", error);
    }
  };

  return (
    <Box display={"flex"} flexDirection={"column"} gap={2} padding={2}>
      <RequestAndResponseView />
      <Box width={"min-content"}>
        <HighlightedCalendar
          highlightedDates={eventDates}
          value={selectedDate}
          onChange={(value) => setSelectedDate(value)}
          minDate={new Date(2000, 0, 15)}
          maxDate={new Date(2025, 11, 31)}
          views={["year", "month", "day"]}
          disableHighlightToday={true}
        />
      </Box>
      {selectedDate && (
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Selected Date: {selectedDate.toLocaleDateString()}
          </Typography>
          {eventDates.some((x) => isSameDay(x, selectedDate)) ? (
            <>
              <EventsView
                date={selectedDate}
                events={events}
                onDelete={handleDeleteEvent}
                onBlur={handleEditEvent}
              />
              <Button variant="contained" fullWidth>
                Add Event
              </Button>
            </>
          ) : (
            <Box
              gap={2}
              display={"flex"}
              flexDirection={"column"}
              alignItems={"flex-start"}
            >
              <Typography>
                No events on {selectedDate.toLocaleDateString()}
              </Typography>
              <Button variant="contained">Add Event</Button>
            </Box>
          )}
        </Box>
      )}

      {/* Generic CRUD tables for admin/advanced use */}
      <Box sx={{ maxWidth: 900, margin: "0 auto", padding: 4 }}>
        <CrudTable
          columns={seriesColumns}
          api={seriesApi}
          initialFormState={{
            name: "",
          }}
          title="Series"
        />
        <CrudTable
          columns={eventColumns}
          api={eventsApi}
          initialFormState={{
            series: {
              name: "",
            },
            value: 0,
            date: new Date(),
            notes: "",
          }}
          title="Event"
        />
      </Box>
    </Box>
  );
};

export default App;
