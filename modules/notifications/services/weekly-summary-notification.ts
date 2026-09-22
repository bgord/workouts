import type * as bg from "@bgord/bun";

export enum WeeklySummaryBlockKinds {
  heading = "heading",
  tiles = "tiles",
  text = "text",
  changes = "changes",
  stat = "stat",
}

export type WeeklySummaryNotificationTile = { value: string; label: string; delta: string };

export type WeeklySummaryNotificationChange = { name: string; previous: string; current: string };

export type WeeklySummaryNotificationHeadingBlock = {
  kind: WeeklySummaryBlockKinds.heading;
  text: string;
};

export type WeeklySummaryNotificationTilesBlock = {
  kind: WeeklySummaryBlockKinds.tiles;
  tiles: ReadonlyArray<WeeklySummaryNotificationTile>;
};

export type WeeklySummaryNotificationTextBlock = { kind: WeeklySummaryBlockKinds.text; text: string };

export type WeeklySummaryNotificationChangesBlock = {
  kind: WeeklySummaryBlockKinds.changes;
  rows: ReadonlyArray<WeeklySummaryNotificationChange>;
};

export type WeeklySummaryNotificationStatBlock = {
  kind: WeeklySummaryBlockKinds.stat;
  value: string;
  caption: string;
  note?: string;
};

export type WeeklySummaryNotificationBlock =
  | WeeklySummaryNotificationHeadingBlock
  | WeeklySummaryNotificationTilesBlock
  | WeeklySummaryNotificationTextBlock
  | WeeklySummaryNotificationChangesBlock
  | WeeklySummaryNotificationStatBlock;

export type WeeklySummaryNotificationContent = {
  eyebrow: string;
  title: string;
  blocks: ReadonlyArray<WeeklySummaryNotificationBlock>;
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
