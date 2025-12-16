import cors from "cors";
import express from "express";
import { Request, Response } from "express";
import { CrudController } from "./crudController";
import { prisma } from "./prisma";
import { LoggingCrudController } from "./loggingCrudController";
import { EventController } from "./eventController";

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// ============================================================================
// series
// ============================================================================

const seriesController = new LoggingCrudController(
  new CrudController(prisma.series)
);
app.get("/api/series", seriesController.findMany);
app.post("/api/series", seriesController.create);
app.delete("/api/series/:id", seriesController.delete);
app.delete("/api/series", seriesController.deleteMany);
app.patch("/api/series/:id", seriesController.update);

// ============================================================================
// events
// ============================================================================

const eventController = new LoggingCrudController(
  new EventController(prisma.event)
);
app.get("/api/events", eventController.findMany);
app.post("/api/events", eventController.create);
app.delete("/api/events/:id", eventController.delete);
app.delete("/api/events", eventController.deleteMany);
app.patch("/api/events/:id", eventController.update);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
