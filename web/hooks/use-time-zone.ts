import { createContext, useContext } from "react";
import { TimeZone } from "../api/time-zone.api";
import { CalendarDay } from "../services/calendar-day";

export const TimeZoneContext = createContext(TimeZone.DEFAULT);

export function useTimeZone() {
  return useContext(TimeZoneContext);
}

export function useToday() {
  return CalendarDay.today(useTimeZone());
}
