import cors from "cors";
import express from "express";
import { CrudController } from "./crudController";
import { prisma } from "./prisma";
import { LoggingCrudController } from "./loggingCrudController";

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// ============================================================================
// series
// ============================================================================

const seriesController = new LoggingCrudController(
  new CrudController(prisma.series)
);
app.get("/api/series", seriesController.getAll);
app.post("/api/series", seriesController.add);
app.delete("/api/series/:id", seriesController.delete);
app.delete("/api/series", seriesController.deleteAll);
app.patch("/api/series/:id", seriesController.edit);

// ============================================================================
// events
// ============================================================================

const eventController = new LoggingCrudController(
  new CrudController(prisma.event)
);
app.get("/api/events", eventController.getAll);
app.post("/api/events", eventController.add);
app.delete("/api/events/:id", eventController.delete);
app.delete("/api/events", eventController.deleteAll);
app.patch("/api/events/:id", eventController.edit);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
