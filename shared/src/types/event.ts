export interface EventInput {
  seriesId: number;
  value: number;
  date: Date;
  notes: string;
}

export interface EventOutput {
  seriesId: number;
  value: number;
  date: Date;
  notes: string;
  id: number;
}

export interface EventRow {
  seriesName: string;
  value: number;
  date: Date;
  notes: string;
  id: number;
}