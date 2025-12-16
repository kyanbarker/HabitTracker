import { GridColDef } from "@mui/x-data-grid";
import { Series, SeriesInput } from "@series-tracker/shared";
import { seriesApi } from "../util/api";
import { CrudTable } from "./CrudTable";

const seriesColumns: GridColDef[] = [
  { field: "id", headerName: "ID", type: "number" },
  { field: "name", headerName: "Name", type: "string" },
];

export function SeriesCrudTable() {
  return (
    <CrudTable<SeriesInput, Series, Series>
      columns={seriesColumns}
      api={seriesApi}
      initialFormState={{
        name: "",
      }}
      title="Series"
      responseToRows={(x) => x}
    />
  );
}
