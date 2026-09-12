const DAY: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" };
const TIME: Intl.DateTimeFormatOptions = { hour: "2-digit", hour12: false, minute: "2-digit" };

export const DateFormat = {
  zoned: (timestamp: number) =>
    Temporal.Instant.fromEpochMilliseconds(timestamp).toZonedDateTimeISO(Temporal.Now.timeZoneId()),

  day: (language: string, moment: Temporal.ZonedDateTime) => moment.toLocaleString(language, DAY),

  plainDay: (language: string, date: Temporal.PlainDate) => date.toLocaleString(language, DAY),

  dayWithWeekday: (language: string, date: Temporal.PlainDate) =>
    date.toLocaleString(language, { ...DAY, weekday: "short" }),

  dayWithTime: (language: string, moment: Temporal.ZonedDateTime) =>
    moment.toLocaleString(language, { ...DAY, ...TIME }),

  time: (language: string, moment: Temporal.ZonedDateTime) => moment.toLocaleString(language, TIME),
};
