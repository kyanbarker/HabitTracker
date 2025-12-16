import { EventInput, Event, SeriesInput, Series } from "@series-tracker/shared";

const API_BASE = "http://localhost:3001/api";

export class CrudApi<I, O> {
  base: string;
  constructor(base: string) {
    this.base = base;
  }
  async findMany(): Promise<O[]> {
    const res = await fetch(`${API_BASE}/${this.base}`);
    return res.json();
  }
  async create(data: I): Promise<O> {
    const res = await fetch(`${API_BASE}/${this.base}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  }
  async update(id: number, data: I): Promise<O> {
    const res = await fetch(`${API_BASE}/${this.base}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  }
  async delete(id: number): Promise<void> {
    await fetch(`${API_BASE}/${this.base}/${id}`, { method: "DELETE" });
  }
}

export class SeriesApi extends CrudApi<SeriesInput, Series> {
  constructor() {
    super("series");
  }
}

export class EventApi extends CrudApi<EventInput, Event> {
  constructor() {
    super("events");
  }
}

export const seriesApi = new SeriesApi();
export const eventApi = new EventApi();
