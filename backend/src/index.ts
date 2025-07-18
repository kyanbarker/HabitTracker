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

app.get("/events", async (req: Request, res: Response) => {
  handleError(req, res, async () => {
    const events = await prisma.event.findMany();
    res.json(events);
  });
});

app.post("/events", async (req: Request, res: Response) => {
  handleError(req, res, async () => {
    const { series, value, units, date, notes } = req.body;
    const newEvent = await prisma.event.create({
      data: {
        series,
        value,
        units,
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
