const DAY: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" };
const TIME: Intl.DateTimeFormatOptions = { hour: "2-digit", hour12: false, minute: "2-digit" };

const plain = (date: string) => {
  const [year, month, day] = date.split("-").map(Number);

  // biome-ignore lint: lint/style/noRestrictedGlobals
  return new Date(year!, month! - 1, day!);
};

const zoned = (timestamp: number) =>
  // biome-ignore lint: lint/style/noRestrictedGlobals
  new Date(timestamp);

// biome-ignore lint: lint/style/noRestrictedGlobals
const iso = (date: Date) =>
  [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");

const format = (language: string, moment: string | number, options: Intl.DateTimeFormatOptions) =>
  (typeof moment === "number" ? zoned(moment) : plain(moment)).toLocaleString(language, options);

export const DateFormat = {
  todayISO: () =>
    // biome-ignore lint: lint/style/noRestrictedGlobals
    iso(new Date()),

  addDays: (date: string, days: number) => {
    const moment = plain(date);
    moment.setDate(moment.getDate() + days);

    return iso(moment);
  },

  instant: (timestamp: number) => zoned(timestamp).toISOString(),

  day: (language: string, moment: string | number) => format(language, moment, DAY),

  plainDay: (language: string, date: string) => format(language, date, DAY),

  month: (language: string, date: string) => format(language, date, { month: "long", year: "numeric" }),

  weekday: (language: string, date: string) => format(language, date, { weekday: "short" }),

  shortDay: (language: string, date: string) => format(language, date, { day: "numeric", month: "short" }),

  weekdayWithDay: (language: string, date: string) =>
    format(language, date, { weekday: "short", day: "numeric", month: "short" }),

  dayWithWeekday: (language: string, date: string) => format(language, date, { ...DAY, weekday: "short" }),

  dayWithTime: (language: string, timestamp: number) => format(language, timestamp, { ...DAY, ...TIME }),

  time: (language: string, timestamp: number) => format(language, timestamp, TIME),
};
