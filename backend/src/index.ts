import express, { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma_client";

const app = express();
const prisma = new PrismaClient();

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
        date: new Date(date),
        notes,
      },
    });
    res.status(201).json(newEvent);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
