import { Series } from "./series";

export interface Event {
  id?: number; // Events that have not been created yet won't have an id
  series: Series;
  value: number;
  date: Date;
  notes: string;
}
