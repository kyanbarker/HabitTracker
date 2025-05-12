import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";

interface Row {
  index: number;
  name: string;
  value: string;
  notes: string;
}

const initialRows: Row[] = Array.from(
  { length: 20 },
  (_, index) =>
    ({
      index: index,
      name: `Name ${index}`,
      value: `${index}`,
      notes: `Notes ${index}`,
    } as Row)
);

const EditableTable: React.FC = () => {
  const [rows, setRows] = useState<Row[]>(initialRows);

  const handleCellEdit = (index: number, field: keyof Row, value: string) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.index === index ? { ...row, [field]: value } : row
      )
    );
  };

  return (
    <TableContainer>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Habit</TableCell>
            <TableCell></TableCell>
            <TableCell>Notes</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.index}>
              <TableCell>{row.name}</TableCell>
              <TableCell sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <TextField
                  variant="standard"
                  type="number"
                  value={row.value}
                  onChange={(e) =>
                    handleCellEdit(row.index, "value", e.target.value)
                  }
                  sx={{ width: "60px" }}
                />
                <Typography>minutes</Typography>
              </TableCell>
              <TableCell>
                <TextField
                  variant="standard"
                  value={row.notes}
                  onChange={(e) =>
                    handleCellEdit(row.index, "notes", e.target.value)
                  }
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default EditableTable;
