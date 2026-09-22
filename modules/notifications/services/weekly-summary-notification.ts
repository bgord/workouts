import type * as bg from "@bgord/bun";

export type WeeklySummaryNotificationContent = {
  title: string;
  footer: { before: string; link: string; after: string; url: string };
  signature: string;
};

export type WeeklySummaryEmailRenderer = {
  render(content: WeeklySummaryNotificationContent): Promise<bg.MailerContentHtmlType>;
};
