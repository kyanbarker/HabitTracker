import { Series } from "../types/series";
import { Event } from "../types/event";

const API_BASE = "http://localhost:3001";

export class CrudApi<T> {
  base: string;
  constructor(base: string) {
    this.base = base;
  }
  async getAll(): Promise<T[]> {
    const res = await fetch(`${API_BASE}/${this.base}`);
    return res.json();
  }
  async create(data: Partial<T>): Promise<T> {
    const res = await fetch(`${API_BASE}/${this.base}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  }
  async update(id: number, data: Partial<T>): Promise<T> {
    const res = await fetch(`${API_BASE}/${this.base}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  }
  async delete(id: number): Promise<void> {
    await fetch(`${API_BASE}/${this.base}/${id}`, { method: "DELETE" });
  }
}

export class SeriesApi extends CrudApi<Series & { id: number }> {
  constructor() {
    super("series");
  }
}

export class EventApi extends CrudApi<Event & { id: number }> {
  constructor() {
    super("event");
  }
}

export const seriesApi = new SeriesApi();
export const eventApi = new EventApi();
