import { isAfter, isBefore } from "date-fns";

/**
 * Returns true if `date` is `startDate`, `endDate`, or in between `startDate` and `endDate`
 */
export const isBetween = (date: Date, startDate: Date, endDate: Date) => {
  return !isBefore(date, startDate) && !isAfter(date, endDate);
};
