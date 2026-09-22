import * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";
import * as v from "valibot";

export type PasswordResetNotificationContent = {
  intro: string;
  cta: string;
  url: tools.UrlWithoutSlashType;
  note: string;
};

export type PasswordResetNotification = {
  subject: bg.MailerSubjectType;
  content: PasswordResetNotificationContent;
};

export class PasswordResetNotificationComposer {
  compose(url: tools.UrlWithoutSlashType): PasswordResetNotification {
    return {
      subject: v.parse(bg.MailerSubject, "Reset your Workouts password"),
      content: {
        intro:
          "We received a request to reset the password for this account. Choose a new one using the button below.",
        cta: "Reset password",
        url,
        note: "The link expires in 1 hour. If you didn't ask for a reset, ignore this email — your password stays the same.",
      },
    };
  }
}
