import { Event, Series } from "@series-tracker/shared";

const API_BASE = "http://localhost:3001/api";

export class CrudApi<T> {
  base: string;
  constructor(base: string) {
    this.base = base;
  }
  async findMany(): Promise<T[]> {
    const res = await fetch(`${API_BASE}/${this.base}`);
    return res.json();
  }
  async create(data: Omit<T, "id">): Promise<T> {
    const res = await fetch(`${API_BASE}/${this.base}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  }
  async update(id: number, data: Omit<T, "id">): Promise<T> {
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

export class SeriesApi extends CrudApi<Series> {
  constructor() {
    super("series");
  }
}

export class EventApi extends CrudApi<Event> {
  constructor() {
    super("events");
  }
}

export const seriesApi = new SeriesApi();
export const eventApi = new EventApi();
