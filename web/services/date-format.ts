const DAY_IN_MS = 24 * 60 * 60 * 1000;

const DAY: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" };

const relative = (language: string) => new Intl.RelativeTimeFormat(language, { numeric: "auto" });

const capitalize = (language: string, text: string) =>
  `${text.charAt(0).toLocaleUpperCase(language)}${text.slice(1)}`;

const plain = (date: string) => {
  const [year, month, day] = date.split("-").map(Number);

  // biome-ignore lint: lint/style/noRestrictedGlobals
  return Date.UTC(year!, month! - 1, day!);
};

const iso = (timestamp: number) =>
  // biome-ignore lint: lint/style/noRestrictedGlobals
  new Date(timestamp).toISOString().slice(0, 10);

const localDay = (timestamp: number, timeZone?: string) => {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(timestamp);
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((entry) => entry.type === type)!.value;

  return `${part("year")}-${part("month")}-${part("day")}`;
};

const format = (language: string, moment: string | number, options: Intl.DateTimeFormatOptions) =>
  typeof moment === "number"
    ? new Intl.DateTimeFormat(language, options).format(moment)
    : new Intl.DateTimeFormat(language, { ...options, timeZone: "UTC" }).format(plain(moment));

const year = (date: string) => date.slice(0, 4);

const months = (date: string) => Number(date.slice(0, 4)) * 12 + Number(date.slice(5, 7));

const SHORT: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };

const short = (language: string, date: string, today: string, options: Intl.DateTimeFormatOptions) =>
  format(language, date, year(date) === year(today) ? options : { ...options, year: "numeric" });

const freshness = (language: string, date: string, today: string) => {
  const days = (plain(date) - plain(today)) / DAY_IN_MS;
  const weeks = Math.sign(days) * Math.round(Math.abs(days) / 7);
  const difference = months(date) - months(today);

  if (Math.abs(days) < 7) return relative(language).format(days, "day");
  if (Math.abs(days) < 35) return relative(language).format(weeks, "week");
  if (Math.abs(difference) < 12) return relative(language).format(difference, "month");
  return relative(language).format(Math.trunc(difference / 12), "year");
};

export const DateFormat = {
  todayISO: (timeZone?: string) => localDay(DateFormat.now(), timeZone),

  now: () =>
    // biome-ignore lint: lint/style/noRestrictedGlobals
    Date.now(),

  addDays: (date: string, days: number) => iso(plain(date) + days * DAY_IN_MS),

  instantIso: (timestamp: number) =>
    // biome-ignore lint: lint/style/noRestrictedGlobals
    new Date(timestamp).toISOString(),

  month: (language: string, date: string) => format(language, date, { month: "long", year: "numeric" }),

  full: (language: string, date: string) => format(language, date, DAY),

  short: (language: string, date: string, today: string) => short(language, date, today, SHORT),

  list: (language: string, date: string, today: string) =>
    short(language, date, today, { ...SHORT, weekday: "short" }),

  dayLabel: (language: string, date: string, today: string) => {
    const days = (plain(date) - plain(today)) / DAY_IN_MS;

    if (Math.abs(days) <= 1) return capitalize(language, relative(language).format(days, "day"));
    return DateFormat.list(language, date, today);
  },

  freshness,

  range: (language: string, from: string, to: string) =>
    new Intl.DateTimeFormat(language, { ...DAY, timeZone: "UTC" }).formatRange(plain(from), plain(to)),

  parts: (language: string, date: string) => ({
    month: format(language, date, { month: "short" }),
    day: format(language, date, { day: "numeric" }),
    weekday: format(language, date, { weekday: "short" }),
  }),

  ago: (language: string, timestamp: number, now: number, timeZone?: string) => {
    const seconds = Math.round((timestamp - now) / 1000);
    const minutes = Math.trunc(seconds / 60);
    const hours = Math.trunc(seconds / 3600);

    if (Math.abs(seconds) < 60) return relative(language).format(0, "second");
    if (Math.abs(minutes) < 60) return relative(language).format(minutes, "minute");
    if (Math.abs(hours) < 24) return relative(language).format(hours, "hour");
    return freshness(language, localDay(timestamp, timeZone), localDay(now, timeZone));
  },

  instantFull: (language: string, timestamp: number, timeZone?: string) =>
    format(language, timestamp, { dateStyle: "medium", timeStyle: "short", timeZone }),
};
