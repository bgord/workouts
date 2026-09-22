import type * as bg from "@bgord/bun";

export type CallToActionNotificationContent = { intro: string; cta: string; url: string; note: string };

export type CallToActionNotification = {
  subject: bg.MailerSubjectType;
  content: CallToActionNotificationContent;
};
