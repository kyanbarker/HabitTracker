import { ReactNode, useEffect, useState } from "react";
import { CrudApi } from "../util/api";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { OmitId } from "src/util/util";

interface CrudTableProps<I, O, V extends { id: number }> {
  columns: GridColDef[];
  api: CrudApi<I, O>;
  initialFormState: OmitId<V>;
  title: string;
  responseToRows: (response: O) => V;
  /** Transform form data to API payload for create/update */
  formToPayload?: (form: OmitId<V>) => Promise<I>;
  /** Custom render function for specific form fields */
  renderCustomField?: (
    field: string,
    value: any,
    onChange: (value: any) => void,
    form: OmitId<V>
  ) => ReactNode | null;
}

// I : the type we provide to the API when creating/updating
// O : the type we receive from the API when fetching
// R : the type we use in the table rows and form (may differ from O)
export function CrudTable<I, O, R extends { id: number }>({
  columns,
  api,
  initialFormState,
  title,
  responseToRows,
  formToPayload,
  renderCustomField,
}: CrudTableProps<I, O, R>) {
  const [rows, setRows] = useState<R[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<OmitId<R>>(initialFormState);
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchRows = async () => {
    const data: O[] = await api.findMany();
    setRows(data.map(responseToRows));
  };

  useEffect(() => {
    fetchRows();
    // eslint-disable-next-line
  }, []);

  const handleOpen = async (row?: R) => {
    if (row) {
      setForm(row);
      setEditingId(row.id);
    } else {
      setForm(initialFormState);
      setEditingId(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setForm(initialFormState);
    setEditingId(null);
  };

  const handleChange = (key: keyof OmitId<R>, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const renderFormField = (col: GridColDef) => {
    const fieldName = col.field as keyof OmitId<R>;
    const fieldValue = form[fieldName];

    // Check if there's a custom renderer for this field
    if (renderCustomField) {
      const customField = renderCustomField(
        col.field,
        fieldValue,
        (value) => handleChange(fieldName, value),
        form
      );
      if (customField !== null) {
        return customField;
      }
    }

    // Special handling for date fields
    if (col.field === "date" || col.type === "date") {
      return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label={col.headerName}
            value={
              fieldValue instanceof Date
                ? fieldValue
                : fieldValue
                ? new Date(fieldValue as string)
                : null
            }
            onChange={(newValue) => handleChange(fieldName, newValue)}
            slotProps={{
              textField: {
                margin: "dense",
                fullWidth: true,
              },
            }}
          />
        </LocalizationProvider>
      );
    }

    // Default text/number field
    return (
      <TextField
        key={col.field}
        margin="dense"
        label={col.headerName}
        fullWidth
        value={fieldValue ?? ""}
        onChange={(e) => handleChange(fieldName, e.target.value)}
        type={col.type === "number" ? "number" : "text"}
      />
    );
  };

  const handleSubmit = async () => {
    const payload = formToPayload ? await formToPayload(form) : (form as any);
    if (editingId != null) {
      await api.update(editingId, payload);
    } else {
      await api.create(payload);
    }
    handleClose();
    fetchRows();
  };

  const handleDelete = async (id: number) => {
    await api.delete(id);
    fetchRows();
  };

  const actionColumn: GridColDef = {
    field: "actions",
    type: "actions",
    headerName: "Actions",
    width: 120,
    getActions: (params) => [
      <GridActionsCellItem
        label="Edit"
        onClick={() => handleOpen(params.row)}
        showInMenu
      />,
      <GridActionsCellItem
        label="Delete"
        onClick={() => handleDelete(params.row.id)}
        showInMenu
      />,
    ],
  };

  return (
    <Box sx={{ my: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h4" component="h2">
          {title}
        </Typography>
        <Button variant="contained" onClick={() => handleOpen()}>
          Add
        </Button>
      </Box>
      <DataGrid
        rows={rows}
        columns={[...columns, actionColumn]}
        autoHeight
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10, 20]}
        disableRowSelectionOnClick
      />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {editingId != null ? "Edit" : "Add"} {title}
        </DialogTitle>
        <DialogContent>
          {columns
            .filter((col) => col.field !== "id" && col.field !== "actions")
            .map((col) => (
              <Box key={col.field} sx={{ mb: 2 }}>
                {renderFormField(col)}
              </Box>
            ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
