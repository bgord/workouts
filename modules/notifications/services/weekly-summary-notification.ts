import type * as bg from "@bgord/bun";
import type { WeeklySummaryStat } from "./weekly-summary-body-weight";
import type { WeeklySummaryTile } from "./weekly-summary-totals";

export type WeeklySummaryNotificationContent = {
  title: string;
  totals: ReadonlyArray<WeeklySummaryTile>;
  bodyWeight?: WeeklySummaryStat;
  footer: { before: string; link: string; after: string; url: string };
  signature: string;
};

export type WeeklySummaryEmailRenderer = {
  render(content: WeeklySummaryNotificationContent): Promise<bg.MailerContentHtmlType>;
};
