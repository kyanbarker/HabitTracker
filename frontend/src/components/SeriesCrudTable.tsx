import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { Series, SeriesInput } from "@series-tracker/shared";
import { eventApi, seriesApi } from "../util/api";
import { eventBus, SERIES_CHANGED_EVENT } from "../util/eventBus";
import { CrudTable } from "./CrudTable";
import { useCallback, useMemo, useState } from "react";

const seriesColumns: GridColDef[] = [
  { field: "id", headerName: "ID", type: "number" },
  { field: "name", headerName: "Name", type: "string" },
];

export function SeriesCrudTable() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [seriesToDelete, setSeriesToDelete] = useState<Series | null>(null);
  const [eventCount, setEventCount] = useState<number>(0);
  const [reassignTarget, setReassignTarget] = useState<Series | null>(null);
  const [allSeries, setAllSeries] = useState<Series[]>([]);
  const [busy, setBusy] = useState(false);

  const openDeleteDialog = useCallback(async (row: Series) => {
    setSeriesToDelete(row);
    setBusy(true);
    try {
      const [events, seriesList] = await Promise.all([
        eventApi.findMany(),
        seriesApi.findMany(),
      ]);
      setAllSeries(seriesList);
      setEventCount(events.filter((e) => e.seriesId === row.id).length);
      setReassignTarget(seriesList.find((s) => s.id !== row.id) ?? null);
      setDeleteDialogOpen(true);
    } finally {
      setBusy(false);
    }
  }, []);

  const closeDeleteDialog = useCallback(() => {
    setDeleteDialogOpen(false);
    setSeriesToDelete(null);
    setEventCount(0);
    setReassignTarget(null);
  }, []);

  const handleDeleteCascade = useCallback(async () => {
    if (!seriesToDelete) return;
    setBusy(true);
    try {
      await seriesApi.delete(seriesToDelete.id);
      setRefreshKey((k) => k + 1);
      eventBus.emit(SERIES_CHANGED_EVENT);
      closeDeleteDialog();
    } finally {
      setBusy(false);
    }
  }, [seriesToDelete, closeDeleteDialog]);

  const handleReassignThenDelete = useCallback(async () => {
    if (!seriesToDelete || !reassignTarget) return;
    if (reassignTarget.id === seriesToDelete.id) return;
    setBusy(true);
    try {
      const events = await eventApi.findMany();
      const toMove = events.filter((e) => e.seriesId === seriesToDelete.id);
      for (const ev of toMove) {
        await eventApi.update(ev.id, { seriesId: reassignTarget.id });
      }
      await seriesApi.delete(seriesToDelete.id);
      setRefreshKey((k) => k + 1);
      eventBus.emit(SERIES_CHANGED_EVENT);
      closeDeleteDialog();
    } finally {
      setBusy(false);
    }
  }, [seriesToDelete, reassignTarget, closeDeleteDialog]);

  const reassignOptions = useMemo(() => allSeries.filter(s => s.id !== seriesToDelete?.id), [allSeries, seriesToDelete]);

  return (
    <>
      <CrudTable<SeriesInput, Series, Series>
        columns={seriesColumns}
        api={seriesApi}
        initialFormState={{
          name: "",
        }}
        title="Series"
        responseToRows={(x) => x}
        onAfterMutate={() => eventBus.emit(SERIES_CHANGED_EVENT)}
        refreshKey={refreshKey}
        onRequestDelete={(row) => openDeleteDialog(row)}
      />

      <Dialog open={deleteDialogOpen} onClose={busy ? undefined : closeDeleteDialog} fullWidth maxWidth="sm">
        <DialogTitle>
          {seriesToDelete ? `Delete series "${seriesToDelete.name}"` : "Delete series"}
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            {seriesToDelete ? `You are attempting to delete the series ${seriesToDelete.name}.` : ""}
          </Typography>
          <Typography sx={{ mb: 2 }}>
            {seriesToDelete ? `There ${eventCount === 1 ? "is" : "are"} ${eventCount} ${seriesToDelete.name} event${eventCount === 1 ? "" : "s"}.` : ""}
          </Typography>

          <Box sx={{ p: 1, border: '1px solid #ddd', borderRadius: 1, mb: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>Option 1</Typography>
            <Typography sx={{ mb: 1 }}>
              Delete the series and all associated events.
            </Typography>
            <Button variant="contained" color="error" onClick={handleDeleteCascade} disabled={busy}>
              Delete series and {eventCount} event{eventCount === 1 ? '' : 's'}
            </Button>
          </Box>

          <Box sx={{ p: 1, border: '1px solid #ddd', borderRadius: 1 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>Option 2</Typography>
            <Typography sx={{ mb: 1 }}>
              Change all {seriesToDelete?.name} events to another series, then delete {seriesToDelete?.name}.
            </Typography>
            <Autocomplete
              options={reassignOptions}
              getOptionLabel={(s) => s.name}
              value={reassignTarget ?? undefined}
              onChange={(_, v) => setReassignTarget(v)}
              renderInput={(params) => <TextField {...params} label="New series" margin="dense" fullWidth />}
              disableClearable
            />
            <Box sx={{ mt: 1 }}>
              <Button variant="outlined" onClick={handleReassignThenDelete} disabled={busy || !reassignTarget || (reassignTarget && reassignTarget.id === seriesToDelete?.id)}>
                Reassign {eventCount} event{eventCount === 1 ? '' : 's'} and delete series
              </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} disabled={busy}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

