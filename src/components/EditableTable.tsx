import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import React from "react";

interface ColumnConfig {
  type?: "text" | "number" | "select";
  isLocked?: boolean;
  options?: string[];
}

interface EditableTableProps {
  rows: string[][];
  setRows: React.Dispatch<React.SetStateAction<string[][]>>;
  columnConfig?: ColumnConfig[];
}

const EditableTable: React.FC<EditableTableProps> = ({
  rows,
  setRows,
  columnConfig = [],
}) => {
  if (rows.length === 0) return null;

  const headers = rows[0];
  const dataRows = rows.slice(1);

  const handleCellChange = (
    rowIndex: number,
    colIndex: number,
    value: string
  ) => {
    setRows((prevRows) => {
      const newRows = [...prevRows];
      newRows[rowIndex + 1] = [...newRows[rowIndex + 1]];
      newRows[rowIndex + 1][colIndex] = value;
      return newRows;
    });
  };

  return (
    <TableContainer>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {headers.map((header, index) => (
              <TableCell key={index}>{header}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {dataRows.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {row.map((value, colIndex) => {
                const config = columnConfig[colIndex] || {};

                let cellComponent = null;

                if (config.isLocked) {
                  cellComponent = value;
                } else if (config.type === "select" && config.options) {
                  cellComponent = (
                    <Select
                      variant="standard"
                      value={value}
                      onChange={(e) =>
                        handleCellChange(rowIndex, colIndex, e.target.value)
                      }
                      fullWidth
                    >
                      {config.options.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  );
                } else {
                  cellComponent = (
                    <TextField
                      variant="standard"
                      type={config.type || "text"}
                      value={value}
                      onChange={(e) =>
                        handleCellChange(rowIndex, colIndex, e.target.value)
                      }
                      fullWidth
                    />
                  );
                }

                return <TableCell key={colIndex}>{cellComponent}</TableCell>;
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default EditableTable;
