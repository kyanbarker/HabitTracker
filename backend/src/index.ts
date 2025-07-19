import express, { Request, Response } from "express";
import cors from "cors";
import { PrismaClient } from "../generated/prisma_client";

const app = express();
const prisma = new PrismaClient();

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;

async function handleError(
  req: Request,
  res: Response,
  func: (req: Request, res: Response) => Promise<void>
) {
  try {
    await func(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
}

// ============================================================================
// series
// ============================================================================

app.get("/series", async (req: Request, res: Response) => {
  handleError(req, res, async () => {
    const series = await prisma.series.findMany();
    res.json(series);
  });
});

app.post("/series", async (req: Request, res: Response) => {
  handleError(req, res, async () => {
    const { name, eventValueOptions, eventValueType } = req.body;
    const newSeries = await prisma.series.create({
      data: {
        name,
        eventValueOptions,
        eventValueType,
      },
    });
    res.status(201).json(newSeries);
  });
});

app.delete("/series/:id", async (req: Request, res: Response) => {
  handleError(req, res, async () => {
    const { id } = req.params;
    await prisma.series.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  });
});

app.delete("/series", async (req: Request, res: Response) => {
  handleError(req, res, async () => {
    await prisma.series.deleteMany();
    res.status(204).send();
  });
});

app.patch("/series/:id", async (req: Request, res: Response) => {
  handleError(req, res, async () => {
    const { id } = req.params;
    const updateData = req.body; // Contains subset of series properties to update

    const updatedSeries = await prisma.series.update({
      where: { id: Number(id) },
      data: updateData,
    });
    res.json(updatedSeries);
  });
});

// ============================================================================
// events
// ============================================================================

app.get("/events", async (req: Request, res: Response) => {
  handleError(req, res, async () => {
    const events = await prisma.event.findMany({ include: { series: true } });
    res.json(events);
  });
});

app.post("/events", async (req: Request, res: Response) => {
  handleError(req, res, async () => {
    const { seriesId, value, date, notes } = req.body;
    const newEvent = await prisma.event.create({
      data: {
        seriesId: parseInt(seriesId),
        value,
        date: date ? new Date(date) : new Date(),
        notes,
      },
    });
    res.status(201).json(newEvent);
  });
});

app.delete("/events/:id", async (req: Request, res: Response) => {
  handleError(req, res, async () => {
    const { id } = req.params;
    await prisma.event.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  });
});

app.delete("/events", async (req: Request, res: Response) => {
  handleError(req, res, async () => {
    await prisma.event.deleteMany();
    res.status(204).send();
  });
});

app.patch("/events/:id", async (req: Request, res: Response) => {
  handleError(req, res, async () => {
    const { id } = req.params;
    const updateData = req.body; // Contains subset of event properties to update

    const updatedEvent = await prisma.event.update({
      where: { id: Number(id) },
      data: updateData,
    });
    res.json(updatedEvent);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
