import * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";
import * as v from "valibot";
import { NotificationLayout } from "./notification-layout";

export class EmailVerificationNotificationComposer {
  constructor(private readonly BETTER_AUTH_URL: tools.UrlWithoutSlashType) {}

  compose(url: tools.UrlWithoutSlashType): bg.MailerTemplateMessage {
    const callbackUrl = new URL(url);
    callbackUrl.searchParams.set("callbackURL", `${this.BETTER_AUTH_URL}/auth/login`);

    return {
      subject: v.parse(bg.MailerSubject, "Verify your Workouts account"),
      html: v.parse(
        bg.MailerContentHtml,
        NotificationLayout.render({
          intro:
            "Thanks for signing up. Confirm this email address to finish creating your Workouts account.",
          cta: "Verify email",
          url: callbackUrl.toString(),
          note: "The link expires in 1 hour. If you didn't create an account, you can ignore this email.",
        }),
      ),
    };
  }
}
