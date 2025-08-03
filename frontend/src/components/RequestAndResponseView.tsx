import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from "@mui/material";
import React, { useState } from "react";

interface Header {
  key: string;
  value: string;
}

interface RequestData {
  url: string;
  method: string;
  headers: Header[];
  body: string;
}

interface ResponseData {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: any;
  time: number;
  error?: string;
}

const RequestView: React.FC<{
  onSend: (request: RequestData) => void;
  loading: boolean;
}> = ({ onSend, loading }) => {
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("GET");
  const [headers, setHeaders] = useState<Header[]>([{ key: "", value: "" }]);
  const [body, setBody] = useState("");

  const httpMethods = [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "HEAD",
    "OPTIONS",
  ];

  const handleAddHeader = () => {
    setHeaders([...headers, { key: "", value: "" }]);
  };

  const handleRemoveHeader = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  const handleHeaderChange = (
    index: number,
    field: "key" | "value",
    value: string
  ) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);
  };

  const handleSend = () => {
    const validHeaders = headers.filter((h) => h.key && h.value);
    onSend({
      url,
      method,
      headers: validHeaders,
      body,
    });
  };

  const isBodyAllowed = !["GET", "HEAD"].includes(method);

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Request
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Method</InputLabel>
          <Select
            value={method}
            label="Method"
            onChange={(e) => setMethod(e.target.value)}
          >
            {httpMethods.map((m) => (
              <MenuItem key={m} value={m}>
                {m}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="http://localhost:3001/endpoint"
        />
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography
          variant="subtitle2"
          gutterBottom
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          Headers
          <IconButton size="small" onClick={handleAddHeader} color="primary">
            <AddIcon />
          </IconButton>
        </Typography>

        {headers.map((header, index) => (
          <Box key={index} sx={{ display: "flex", gap: 1, mb: 1 }}>
            <TextField
              size="small"
              label="Key"
              value={header.key}
              onChange={(e) => handleHeaderChange(index, "key", e.target.value)}
              sx={{ flex: 1 }}
            />
            <TextField
              size="small"
              label="Value"
              value={header.value}
              onChange={(e) =>
                handleHeaderChange(index, "value", e.target.value)
              }
              sx={{ flex: 1 }}
            />
            <IconButton
              size="small"
              onClick={() => handleRemoveHeader(index)}
              disabled={headers.length === 1}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}
      </Box>

      {isBodyAllowed && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Body (JSON)
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={6}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder='{"key": "value"}'
            sx={{ fontFamily: "monospace" }}
          />
        </Box>
      )}

      <Button
        variant="contained"
        fullWidth
        onClick={handleSend}
        disabled={!url || loading}
        startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
      >
        {loading ? "Sending..." : "Send Request"}
      </Button>
    </Paper>
  );
};

const ResponseView: React.FC<{ response: ResponseData | null }> = ({
  response,
}) => {
  if (!response) {
    return (
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Response
        </Typography>
        <Typography color="text.secondary">
          No response yet. Send a request to see the response here.
        </Typography>
      </Paper>
    );
  }

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return "success";
    if (status >= 300 && status < 400) return "info";
    if (status >= 400 && status < 500) return "warning";
    return "error";
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Response
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Chip
          label={`${response.status} ${response.statusText}`}
          color={getStatusColor(response.status)}
          sx={{ mr: 1 }}
        />
        <Chip label={`${response.time}ms`} variant="outlined" />
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Headers
        </Typography>
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Key</TableCell>
                <TableCell>Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(response.headers).map(([key, value]) => (
                <TableRow key={key}>
                  <TableCell>{key}</TableCell>
                  <TableCell>{value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Body
        </Typography>
        <Paper
          variant="outlined"
          sx={{ p: 2, maxHeight: 400, overflow: "auto" }}
        >
          <pre
            style={{ margin: 0, fontFamily: "monospace", fontSize: "0.875rem" }}
          >
            {typeof response.body === "string"
              ? response.body
              : JSON.stringify(response.body, null, 2)}
          </pre>
        </Paper>
      </Box>
    </Paper>
  );
};

const RequestAndResponseView: React.FC = () => {
  const [response, setResponse] = useState<ResponseData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendRequest = async (request: RequestData) => {
    setLoading(true);
    setError(null);
    const startTime = Date.now();

    try {
      // Parse body if it's not empty
      let parsedBody = null;
      if (
        request.body &&
        request.method !== "GET" &&
        request.method !== "HEAD"
      ) {
        try {
          parsedBody = JSON.parse(request.body);
        } catch (e) {
          throw new Error("Invalid JSON in request body");
        }
      }

      // Convert headers array to object
      const headersObject: Record<string, string> = {};
      request.headers.forEach((h) => {
        headersObject[h.key] = h.value;
      });

      // Make the request
      const fetchOptions: RequestInit = {
        method: request.method,
        headers: headersObject,
      };

      if (parsedBody) {
        fetchOptions.body = JSON.stringify(parsedBody);
        if (!headersObject["Content-Type"]) {
          fetchOptions.headers = {
            ...headersObject,
            "Content-Type": "application/json",
          };
        }
      }

      const res = await fetch(request.url, fetchOptions);
      const endTime = Date.now();

      // Get response headers
      const responseHeaders: Record<string, string> = {};
      res.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      // Parse response body
      let responseBody;
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        responseBody = await res.json();
      } else {
        responseBody = await res.text();
      }

      setResponse({
        status: res.status,
        statusText: res.statusText,
        headers: responseHeaders,
        body: responseBody,
        time: endTime - startTime,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={3}>
        <Grid>
          <RequestView onSend={handleSendRequest} loading={loading} />
        </Grid>
        <Grid>
          <ResponseView response={response} />
        </Grid>
      </Grid>

      {/* Error Dialog */}
      <Dialog open={!!error} onClose={() => setError(null)}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <Alert severity="error">{error}</Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setError(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export { RequestAndResponseView, RequestView, ResponseView };
export default RequestAndResponseView;
