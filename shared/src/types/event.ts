export interface Event {
  seriesId: number;
  value: number;
  date: Date;
  notes: string;
  id: number;
}

export interface EventInput extends Omit<Event, "id"> {}

export interface EventRow extends Omit<Event, "seriesId"> {
  seriesName: string;
}
