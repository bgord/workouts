import * as bg from "@bgord/ui";
import { DateFormat } from "../services/date-format";
import { useTimeZone, useToday } from "./use-time-zone";

export type UseDateTimeOptions =
  | { value: string; format: "dayLabel" | "freshness" | "list" | "short" }
  | { value: number; format: "ago" };

export function useDateTime(options: UseDateTimeOptions) {
  const language = bg.useLanguage();
  const timeZone = useTimeZone();
  const today = useToday();

  if (options.format === "ago") {
    return {
      text: DateFormat.ago(language, options.value, DateFormat.now(), timeZone),
      full: DateFormat.instantFull(language, options.value, timeZone),
      dateTime: DateFormat.instantIso(options.value),
    };
  }

  return {
    text: DateFormat[options.format](language, options.value, today),
    full: DateFormat.full(language, options.value),
    dateTime: options.value,
  };
}
