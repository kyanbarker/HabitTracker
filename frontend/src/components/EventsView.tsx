import { Box, Typography, List, ListItem } from "@mui/material";
import { Event } from "../types/event";

export interface EventsViewProps {
  date: Date;
  events: Event[];
}

export const EventsView = ({ date, events }: EventsViewProps) => (
  <Box sx={{ marginTop: 2 }}>
    <Typography variant="h6">Selected Date: {date.toLocaleDateString()}</Typography>
    <List>
      {events
        .filter((event) => new Date(event.date).toDateString() === date.toDateString())
        .map((event, index) => (
          <ListItem key={index}>
            <Typography>
              {event.series}: {event.value} {event.units} - {event.notes}
            </Typography>
          </ListItem>
        ))}
    </List>
  </Box>
);