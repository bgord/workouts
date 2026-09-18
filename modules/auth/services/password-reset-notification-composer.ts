import * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";
import * as v from "valibot";
import { NotificationLayout } from "./notification-layout";

export class PasswordResetNotificationComposer {
  compose(url: tools.UrlWithoutSlashType): bg.MailerTemplateMessage {
    return {
      subject: v.parse(bg.MailerSubject, "Reset your Workouts password"),
      html: v.parse(
        bg.MailerContentHtml,
        NotificationLayout.render({
          intro: "We received a request to reset the password for this account. Choose a new one using the button below.",
          cta: "Reset password",
          url,
          note: "The link expires in 1 hour. If you didn't ask for a reset, ignore this email — your password stays the same.",
        }),
      ),
    };
  }
}
