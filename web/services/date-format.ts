const DAY: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" };
const TIME: Intl.DateTimeFormatOptions = { hour: "2-digit", hour12: false, minute: "2-digit" };

export const DateFormat = {
  zoned: (timestamp: number) => new Date(timestamp),

  day: (language: string, date: Date) => date.toLocaleDateString(language, DAY),

  plainDay: (language: string, date: Date) => date.toLocaleDateString(language, DAY),

  dayWithWeekday: (language: string, date: Date) =>
    date.toLocaleDateString(language, { ...DAY, weekday: "short" }),

  dayWithTime: (language: string, date: Date) => date.toLocaleString(language, { ...DAY, ...TIME }),

  time: (language: string, date: Date) => date.toLocaleTimeString(language, TIME),
};
