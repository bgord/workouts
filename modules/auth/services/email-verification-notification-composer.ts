import * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";
import * as v from "valibot";
import type { CallToActionNotification } from "./call-to-action-notification";

export class EmailVerificationNotificationComposer {
  constructor(private readonly BETTER_AUTH_URL: tools.UrlWithoutSlashType) {}

  compose(url: tools.UrlWithoutSlashType): CallToActionNotification {
    const callbackUrl = new URL(url);
    callbackUrl.searchParams.set("callbackURL", `${this.BETTER_AUTH_URL}/auth/login`);

    return {
      subject: v.parse(bg.MailerSubject, "Verify your Workouts account"),
      content: {
        intro: "Thanks for signing up. Confirm this email address to finish creating your Workouts account.",
        cta: "Verify email",
        url: callbackUrl.toString(),
        note: "The link expires in 1 hour. If you didn't create an account, you can ignore this email.",
      },
    };
  }
}
