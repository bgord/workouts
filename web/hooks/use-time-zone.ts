import { createContext, useContext } from "react";
import { DateFormat } from "../services/date-format";

export const TimeZoneContext = createContext("UTC");

export function useTimeZone() {
  return useContext(TimeZoneContext);
}

export function useToday() {
  return DateFormat.todayISO(useTimeZone());
}
