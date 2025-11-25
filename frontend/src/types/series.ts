export enum EventValueType {
  STRING = "STRING",
  NUMBER = "NUMBER",
  SELECTION = "SELECTION",
  BOOLEAN = "BOOLEAN",
}

export interface Series {
  id?: number; // Series that have not been created yet won't have an id
  name: string;
  eventValueSelectionOptions: string[];
  eventValueType: EventValueType;
}
