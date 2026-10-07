import * as bg from "@bgord/ui";
import { CalendarDay } from "../services/calendar-day";
import { Clock } from "../services/clock";
import { DateFormat } from "../services/date-format";
import { useTimeZone } from "./use-time-zone";

export function useDateFormat() {
  const language = bg.useLanguage();
  const timeZone = useTimeZone();

  return new DateFormat({ language, timeZone, today: CalendarDay.today(timeZone), now: Clock.now() });
}
