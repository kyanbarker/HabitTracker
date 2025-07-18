import { Box, Typography, List, ListItem, Button } from "@mui/material";
import { Event } from "../types/event";

export interface EventsViewProps {
  date: Date;
  events: Event[];
  onDelete: (event: Event) => void;
}

export const EventsView = ({ date, events, onDelete }: EventsViewProps) => (
  <Box sx={{ marginTop: 2 }}>
    <Typography variant="h6">Selected Date: {date.toLocaleDateString()}</Typography>
    <List>
      {events
        .filter((event) => new Date(event.date).toDateString() === date.toDateString())
        .map((event, index) => (
          <ListItem key={index} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography>
              {event.series}: {event.value} {event.units} - {event.notes}
            </Typography>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => onDelete(event)}
            >
              Delete
            </Button>
          </ListItem>
        ))}
    </List>
  </Box>
);