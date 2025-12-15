import { Series } from "./series";

export interface Event {
  series: Series;
  value: number;
  date: Date;
  notes: string;
  id: number;
}
