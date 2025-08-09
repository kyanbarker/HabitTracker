import {
  Button,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField
} from "@mui/material";
import React, { useState } from "react";
import { useEditableField } from "../hooks/useEditableFields";
import { Event } from "../../../shared/types/event";
import { Series } from "../../../shared/types/series";

interface EventsViewProps {
  date: Date;
  events: (Event & { id: number })[];
  onDelete: (event: Event & { id: number }) => void;
  onBlur: (id: number, updateData: Partial<Event>) => void;
}

const EventsView = ({ date, events, onDelete, onBlur }: EventsViewProps) => {
  // Local state for editable fields
  const [editValues, setEditValues] = useState<
    Record<number, { value: string; notes: string }>
  >({});

  // Use the custom hook
  const createFieldHandlers = useEditableField(
    editValues,
    setEditValues,
    onBlur
  );

  // Initialize local state when events change
  React.useEffect(() => {
    const initial: Record<number, { value: string; notes: string }> = {};
    events.forEach((event) => {
      initial[event.id] = {
        value: event.value,
        notes: event.notes,
      };
    });
    setEditValues(initial);
  }, [events]);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Series</TableCell>
            <TableCell>Value</TableCell>
            <TableCell>Notes</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {events
            .filter(
              (event) =>
                new Date(event.date).toDateString() === date.toDateString()
            )
            .map((event) => (
              <TableRow key={event.id}>
                <TableCell key={"series"}>{event.series.name}</TableCell>
                <TableCell key={"value"}>
                  <TextField
                    variant="standard"
                    value={editValues[event.id]?.value ?? ""}
                    type={getType(event.series)}
                    select={event.series.eventValueType === "SELECTION"}
                    {...createFieldHandlers(event.id, "value")}
                  >
                    {event.series.eventValueType === "SELECTION" &&
                      event.series.eventValueSelectionOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                  </TextField>
                </TableCell>
                <TableCell key={"notes"}>
                  <TextField
                    variant="standard"
                    value={editValues[event.id]?.notes ?? ""}
                    {...createFieldHandlers(event.id, "notes")}
                  />
                </TableCell>
                <TableCell align="right" key={"actions"}>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => onDelete(event)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  function getType(series: Series) {
    switch (series.eventValueType) {
      case "STRING":
        return "text";
      case "NUMBER":
        return "number";
      case "SELECTION":
        return "select";
      case "BOOLEAN":
        return "checkbox";
      default:
        return "text"; // Fallback to text if type is unknown
    }
  }
};

export default EventsView;
