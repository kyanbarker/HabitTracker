import { isAfter, isBefore } from "date-fns";

export const isBetween = (date: Date, startDate: Date, endDate: Date) => {
  return !isBefore(date, startDate) && !isAfter(date, endDate);
};
