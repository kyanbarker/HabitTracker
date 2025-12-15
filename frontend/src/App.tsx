import { Box } from "@mui/material";
import RequestAndResponseView from "./components/RequestAndResponseView";
import { SeriesCrudTable } from "./components/SeriesCrudTable";
import { EventCrudTable } from "./components/EventCrudTable";

const App = () => {
  return (
    <Box display={"flex"} flexDirection={"column"} gap={2} padding={2}>
      <RequestAndResponseView />
      <Box>
        <SeriesCrudTable />
        <EventCrudTable />
      </Box>
    </Box>
  );
};

export default App;
