export interface Event {
  id?: number; // Events that have not been created yet won't have an id
  series: string;
  value: string;
  units: string;
  date: Date;
  notes: string;
}
