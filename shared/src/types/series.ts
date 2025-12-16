
export interface Series {
  id: number;
  name: string;
}

export interface SeriesInput extends Omit<Series, "id"> {}
