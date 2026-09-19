const DAY: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" };
const TIME: Intl.DateTimeFormatOptions = { hour: "2-digit", hour12: false, minute: "2-digit" };

export const DateFormat = {
  zoned: (timestamp: number) =>
    Temporal.Instant.fromEpochMilliseconds(timestamp).toZonedDateTimeISO(Temporal.Now.timeZoneId()),

  day: (language: string, moment: Temporal.PlainDate | Temporal.ZonedDateTime) =>
    moment.toLocaleString(language, DAY),

  plainDay: (language: string, date: Temporal.PlainDate) => date.toLocaleString(language, DAY),

  month: (language: string, date: Temporal.PlainDate) =>
    date.toLocaleString(language, { month: "long", year: "numeric" }),

  weekday: (language: string, date: Temporal.PlainDate) =>
    date.toLocaleString(language, { weekday: "short" }),

  shortDay: (language: string, date: Temporal.PlainDate) =>
    date.toLocaleString(language, { day: "numeric", month: "short" }),

  weekdayWithDay: (language: string, date: Temporal.PlainDate) =>
    date.toLocaleString(language, { weekday: "short", day: "numeric", month: "short" }),

  dayWithWeekday: (language: string, date: Temporal.PlainDate) =>
    date.toLocaleString(language, { ...DAY, weekday: "short" }),

  dayWithTime: (language: string, moment: Temporal.ZonedDateTime) =>
    moment.toLocaleString(language, { ...DAY, ...TIME }),

  time: (language: string, moment: Temporal.ZonedDateTime) => moment.toLocaleString(language, TIME),
};
