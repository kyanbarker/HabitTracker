import cors from "cors";
import express from "express";
import { CrudController } from "./crudController";
import { prisma } from "./prisma";

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// ============================================================================
// series
// ============================================================================

const seriesController = new CrudController(prisma.series);
app.get("/series", seriesController.getAll);
app.post("/series", seriesController.add);
app.delete("/series/:id", seriesController.delete);
app.delete("/series", seriesController.deleteAll);
app.patch("/series/:id", seriesController.edit);

// ============================================================================
// events
// ============================================================================

const eventController = new CrudController(prisma.event);
app.get("/events", eventController.getAll);
app.post("/events", eventController.add);
app.delete("/events/:id", eventController.delete);
app.delete("/events", eventController.deleteAll);
app.patch("/events/:id", eventController.edit);

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
