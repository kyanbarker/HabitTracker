import express, { Request, Response } from "express";
import cors from "cors";
import { PrismaClient } from "../generated/prisma_client";

const app = express();
const prisma = new PrismaClient();

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;

app.get("/events", async (req: Request, res: Response) => {
  try {
    const events = await prisma.event.findMany();
    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

app.post("/events", async (req: Request, res: Response) => {
  const { series, value, units, date, notes } = req.body;
  try {
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
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json(error);
  }
});

app.delete("/events/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.event.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ error: "Failed to delete event" });
  }
});

app.delete("/events", async (req: Request, res: Response) => {
  try {
    await prisma.event.deleteMany();
    res.status(204).send();
  } catch (error) {
    console.error("Error clearing events:", error);
    res.status(500).json({ error: "Failed to clear events" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
