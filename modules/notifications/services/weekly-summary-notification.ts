import type * as bg from "@bgord/bun";

export type WeeklySummaryNotificationTile = { value: string; label: string; delta: string };

export type WeeklySummaryNotificationContent = {
  eyebrow: string;
  title: string;
  numbers: { tiles: ReadonlyArray<WeeklySummaryNotificationTile> } | { empty: string };
  highlights: { heading: string; rows: ReadonlyArray<{ name: string; previous: string; current: string }> };
  bodyWeight?: { heading: string; value: string; caption: string; note?: string };
  footer: { before: string; link: string; after: string; url: string };
  signature: string;
};

export type WeeklySummaryNotification = {
  subject: bg.MailerSubjectType;
  content: WeeklySummaryNotificationContent;
};

export type WeeklySummaryEmailRenderer = {
  render(content: WeeklySummaryNotificationContent): Promise<bg.MailerContentHtmlType>;
};
