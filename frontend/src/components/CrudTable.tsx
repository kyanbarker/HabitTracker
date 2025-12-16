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

interface CrudTableProps<Input, Model, Row extends { id: number }> {
  columns: GridColDef[];
  api: CrudApi<Input, Model>;
  initialFormState: OmitId<Row>;
  title: string;
  responseToRows: (response: Model) => Row;
  /** When this value changes, the table will re-fetch rows. */
  refreshKey?: any;
  /** Transform form data to API input arguments for create/update */
  formToInput?: (form: OmitId<Row>) => Promise<Input> | Input;
  /** Callback fired after create/update/delete succeeds */
  onAfterMutate?: () => void;
  /** Custom render function for specific form fields */
  renderCustomField?: (
    field: string,
    value: any,
    onChange: (value: any) => void,
    form: OmitId<Row>
  ) => ReactNode | null;
  /** Optional custom delete flow; if provided, it will be called instead of default delete */
  onRequestDelete?: (row: Row) => void | Promise<void>;
}

// I : the type we provide to the API when creating/updating
// O : the type we receive from the API when fetching
// R : the type we use in the table rows and form (may differ from O)
export function CrudTable<Input, Model, Row extends { id: number }>({
  columns,
  api,
  initialFormState,
  title,
  responseToRows,
  refreshKey,
  formToInput,
  onAfterMutate,
  renderCustomField,
  onRequestDelete,
}: CrudTableProps<Input, Model, Row>) {
  const [rows, setRows] = useState<Row[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<OmitId<Row>>(initialFormState);
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchRows = async () => {
    const data: Model[] = await api.findMany();
    setRows(data.map(responseToRows));
  };

  useEffect(() => {
    fetchRows();
    // eslint-disable-next-line
  }, [refreshKey]);

  const handleOpen = async (row?: Row) => {
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

  const handleChange = (key: keyof OmitId<Row>, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const renderFormField = (col: GridColDef) => {
    const fieldName = col.field as keyof OmitId<Row>;
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
    const inputArgs = formToInput ? await formToInput(form) : (form as any);
    if (editingId != null) {
      await api.update(editingId, inputArgs);
    } else {
      await api.create(inputArgs);
    }
    handleClose();
    fetchRows();
    onAfterMutate?.();
  };

  const handleDelete = async (id: number) => {
    await api.delete(id);
    fetchRows();
    onAfterMutate?.();
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
        onClick={async () => {
          if (onRequestDelete) {
            await onRequestDelete(params.row as Row);
          } else {
            await handleDelete(params.row.id);
          }
        }}
        showInMenu
      />,
    ],
  };

  // Ensure all non-action columns are left-aligned by default
  const alignedColumns = columns.map((col) =>
    col.field === "actions" || col.field === "id"
      ? col
      : { ...col, align: col.align ?? "left", headerAlign: col.headerAlign ?? "left" }
  );

  return (
    // how do i make it width min content
    <Box sx={{ my: 4, width: "min-content" }}>
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
        columns={[...alignedColumns, actionColumn]}
        autoHeight
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 20 },
          },
        }}
        pageSizeOptions={[5, 10, 20, 40]}
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
