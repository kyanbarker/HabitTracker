import { Autocomplete, TextField } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { Event, EventInput, Series } from "@series-tracker/shared";
import { useEffect, useState } from "react";
import { OmitId } from "src/util/util";
import { eventApi, seriesApi } from "../util/api";
import { CrudTable } from "./CrudTable";
import { eventBus, SERIES_CHANGED_EVENT } from "../util/eventBus";

const eventColumns: GridColDef[] = [
  { field: "id", headerName: "ID", type: "number" },
  { field: "seriesName", headerName: "Series", type: "string" },
  { field: "value", headerName: "Value", type: "number" },
  {
    field: "date",
    headerName: "Date",
    type: "date",
    valueGetter: (data) => new Date(data),
  },
  { field: "notes", headerName: "Notes", type: "string" },
];

export interface EventRow extends Omit<Event, "seriesId"> {
  seriesName: string;
}

export function EventCrudTable() {
  // we have to call it seriesList because an element of the list is a series
  // if we called the list series, it would be confusing
  const [seriesList, setSeriesList] = useState<Series[] | null>(null);
  const [seriesVersion, setSeriesVersion] = useState(0);

  useEffect(() => {
    const fetchSeries = async () => {
      const data = await seriesApi.findMany();
      setSeriesList(data);
      setSeriesVersion((v) => v + 1);
    };
    fetchSeries();
    const off = eventBus.on(SERIES_CHANGED_EVENT, fetchSeries);
    return () => off();
  }, []);

  // notice we return early if seriesList is null
  // notice we return after setting up the use effect
  // if we returned before setting up the use effect, the effect would never run
  if (seriesList === null) {
    return <div>Loading...</div>;
  }

  const formToInput = async (form: OmitId<EventRow>): Promise<EventInput> => {
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

  const responseToRows = (event: Event): EventRow => {
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
      return (
        <Autocomplete
          options={seriesList.map((s) => s.name)}
          onChange={(_, newValue) => onChange(newValue || "")}
          value={value}
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
    <CrudTable<EventInput, Event, EventRow>
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
      formToInput={formToInput}
      refreshKey={seriesVersion}
      renderCustomField={renderCustomField}
    />
  );
}
