import React, { useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
  TextField,
} from "@mui/material";
import { Event } from "../types/event";

interface EventsViewProps {
  date: Date;
  events: (Event & { id: number })[];
  onDelete: (event: Event & { id: number }) => void;
  onEdit: (id: number, updateData: Partial<Event>) => void;
}

const EventsView = ({ date, events, onDelete, onEdit }: EventsViewProps) => {
  // Local state for editable fields
  const [editValues, setEditValues] = useState<
    Record<number, { value: string; notes: string }>
  >({});

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
    <Box sx={{ marginTop: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Selected Date: {date.toLocaleDateString()}
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Series</TableCell>
              <TableCell>Value</TableCell>
              <TableCell>Units</TableCell>
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
                  <TableCell>{event.series}</TableCell>
                  <TableCell>
                    <TextField
                      variant="standard"
                      value={editValues[event.id]?.value ?? ""}
                      onChange={(e) =>
                        setEditValues((prev) => ({
                          ...prev,
                          [event.id]: {
                            ...prev[event.id],
                            value: e.target.value,
                          },
                        }))
                      }
                      onBlur={() =>
                        onEdit(event.id, {
                          value: editValues[event.id]?.value ?? "",
                        })
                      }
                    />
                  </TableCell>
                  <TableCell>{event.units}</TableCell>
                  <TableCell>
                    <TextField
                      variant="standard"
                      value={editValues[event.id]?.notes ?? ""}
                      onChange={(e) =>
                        setEditValues((prev) => ({
                          ...prev,
                          [event.id]: {
                            ...prev[event.id],
                            notes: e.target.value,
                          },
                        }))
                      }
                      onBlur={() =>
                        onEdit(event.id, {
                          notes: editValues[event.id]?.notes ?? "",
                        })
                      }
                    />
                  </TableCell>
                  <TableCell align="right">
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
    </Box>
  );
};

export default EventsView;
