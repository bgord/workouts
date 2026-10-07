import * as bg from "@bgord/ui";
import { useHydrated } from "../hooks/use-hydrated";
import { DateFormat } from "../services/date-format";

export function DateTime({
  value,
  format,
  ...props
}: (
  | { value: string; format: "dayLabel" | "freshness" | "list" | "short" }
  | { value: number; format: "ago" }
) &
  React.JSX.IntrinsicElements["time"]) {
  const language = bg.useLanguage();
  const hydrated = useHydrated();

  if (format === "ago") {
    const full = DateFormat.instantFull(language, value, hydrated ? undefined : "UTC");

    return (
      <time dateTime={DateFormat.instantIso(value)} title={full} {...props}>
        {hydrated ? DateFormat.ago(language, value, DateFormat.now()) : full}
      </time>
    );
  }

  const full = DateFormat.full(language, value);

  return (
    <time dateTime={value} title={full} {...props}>
      {hydrated ? DateFormat[format](language, value, DateFormat.todayISO()) : full}
    </time>
  );
}
