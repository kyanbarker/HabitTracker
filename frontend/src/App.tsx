import { Box } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { CrudTable } from "./components/CrudTable";
import RequestAndResponseView from "./components/RequestAndResponseView";
import { eventApi as eventsApi, seriesApi } from "./util/api";

const seriesColumns: GridColDef[] = [
  { field: "id", width: 70, type: "number" },
  { field: "name", width: 180, type: "string" },
];

const eventColumns: GridColDef[] = [
  { field: "id", width: 70, type: "number" },
  { field: "seriesName", width: 120, type: "string" },
  { field: "value", width: 120, type: "number" },
  { field: "date", width: 160, type: "date", valueGetter: (params) => new Date(params) },
  { field: "notes", width: 200, type: "string" },
];

const App = () => {
  return (
    <Box display={"flex"} flexDirection={"column"} gap={2} padding={2}>
      <RequestAndResponseView />
      {/* Generic CRUD tables for admin/advanced use */}
      <Box>
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
            seriesName: "",
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
