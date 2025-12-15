import { Autocomplete, TextField } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import {
  EventInput,
  EventOutput,
  EventRow,
  SeriesOutput,
} from "@series-tracker/shared";
import { useEffect, useState } from "react";
import { eventApi, seriesApi } from "../util/api";
import { CrudTable } from "./CrudTable";
import { OmitId } from "src/util/util";

const eventColumns: GridColDef[] = [
  { field: "id", headerName: "ID", type: "number" },
  { field: "seriesName", headerName: "Series Name", type: "string" },
  { field: "value", headerName: "Value", type: "number" },
  {
    field: "date",
    headerName: "Date",
    type: "date",
    valueGetter: (data) => new Date(data),
  },
  { field: "notes", headerName: "Notes", type: "string" },
];

export function EventCrudTable() {
  // we have to call it seriesList because an element of the list is a series
  // if we called the list series, it would be confusing
  const [seriesList, setSeriesList] = useState<SeriesOutput[] | null>(null);

  useEffect(() => {
    const fetchSeries = async () => {
      const data = await seriesApi.findMany();
      setSeriesList(data);
    };
    fetchSeries();
  }, []);

  if (seriesList === null) {
    return <div>Loading...</div>;
  }

  const formToPayload = async (form: OmitId<EventRow>): Promise<EventInput> => {
    // Transform EventForm back to Event by looking up series ID
    const series = seriesList.find((s) => s.name === form.seriesName);
    if (!series) {
      throw new Error(
        `Series "${form.seriesName}" not found. Please create it first.`
      );
    }
    return {
      seriesId: series.id,
      value: Number(form.value),
      date: form.date,
      notes: form.notes,
    };
  };

  const responseToRows = (event: EventOutput): EventRow => {
    const series = seriesList.find((s) => s.id === event.seriesId);
    if (!series) {
      throw new Error(`Series with ID "${event.seriesId}" not found.`);
    }
    return {
      id: event.id,
      seriesName: series.name,
      value: event.value,
      date: event.date,
      notes: event.notes,
    };
  };

  const renderCustomField = (
    field: string,
    value: any,
    onChange: (value: any) => void,
    form: OmitId<EventRow>
  ) => {
    if (field === "seriesName") {
      console.log(value);
      return (
        <Autocomplete
          options={seriesList.map((s) => s.name)}
          onChange={(_, newValue) => onChange(newValue || "")}
          value={value}
          freeSolo
          renderInput={(params) => (
            <TextField
              {...params}
              label="Series"
              margin="dense"
              fullWidth
              helperText="Select existing series or type a new name (you'll be prompted to create it)"
            />
          )}
        />
      );
    }
    return null; // Use default rendering for other fields
  };

  return (
    <CrudTable<EventInput, EventOutput, EventRow>
      columns={eventColumns}
      api={eventApi}
      initialFormState={{
        seriesName: "",
        value: 0,
        date: new Date(),
        notes: "",
      }}
      title="Events"
      responseToRows={responseToRows}
      formToPayload={formToPayload}
      renderCustomField={renderCustomField}
    />
  );
}
