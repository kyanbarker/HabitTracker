import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import { Event } from "../types/event";

interface EventFormProps {
  onSubmit: (event: Event) => void;
}

const EventForm = ({ onSubmit }: EventFormProps) => {
  const [form, setForm] = useState({
    series: "",
    value: "",
    units: "",
    date: "",
    notes: "",
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      onSubmit({ ...form, date: form.date ? new Date(form.date) : new Date() });
      setForm({
        series: "",
        value: "",
        units: "",
        date: "",
        notes: "",
      }); // Reset form after submission
    } catch (error) {
      console.error("Failed to add event:", error);
    }
  };

  return (
    <Box
      component="form"
      sx={{ display: "flex", gap: 2, alignItems: "center", marginBottom: 2 }}
      onSubmit={handleSubmit}
    >
      <TextField
        label="Series"
        name="series"
        value={form.series}
        onChange={handleFormChange}
        required
      />
      <TextField
        label="Value"
        name="value"
        value={form.value}
        onChange={handleFormChange}
        required
      />
      <TextField
        label="Units"
        name="units"
        value={form.units}
        onChange={handleFormChange}
        // required
      />
      <TextField
        label="Date"
        name="date"
        type="date"
        value={form.date}
        onChange={handleFormChange}
        slotProps={{ inputLabel: { shrink: true } }}
      />
      <TextField
        label="Notes"
        name="notes"
        value={form.notes}
        onChange={handleFormChange}
      />
      <Button type="submit" variant="contained">
        Add Event
      </Button>
    </Box>
  );
};

export default EventForm;
