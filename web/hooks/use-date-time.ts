import * as bg from "@bgord/ui";
import { DateFormat } from "../services/date-format";
import { useHydrated } from "./use-hydrated";

export type UseDateTimeOptions =
  | { value: string; format: "dayLabel" | "freshness" | "list" | "short" }
  | { value: number; format: "ago" };

export function useDateTime(options: UseDateTimeOptions) {
  const language = bg.useLanguage();
  const hydrated = useHydrated();

  if (options.format === "ago") {
    const full = DateFormat.instantFull(language, options.value, hydrated ? undefined : "UTC");

    return {
      text: hydrated ? DateFormat.ago(language, options.value, DateFormat.now()) : full,
      full,
      dateTime: DateFormat.instantIso(options.value),
    };
  }

  const full = DateFormat.full(language, options.value);

  return {
    text: hydrated ? DateFormat[options.format](language, options.value, DateFormat.todayISO()) : full,
    full,
    dateTime: options.value,
  };
}
