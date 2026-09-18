import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Auth from "+auth";
import { bootstrap } from "+infra/bootstrap";

describe("EmailVerificationNotificationComposer", async () => {
  const di = await bootstrap();

  test("compose", () => {
    const composer = new Auth.Services.EmailVerificationNotificationComposer(di.Env.BETTER_AUTH_URL);
    const notification = composer.compose(v.parse(tools.UrlWithoutSlash, "http://example.com"));

    expect(notification).toEqual({
      subject: v.parse(bg.MailerSubject, "Verify your Workouts account"),
      html: v.parse(
        bg.MailerContentHtml,
        Auth.Services.NotificationLayout.render({
          intro:
            "Thanks for signing up. Confirm this email address to finish creating your Workouts account.",
          cta: "Verify email",
          url: "http://example.com/?callbackURL=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Flogin",
          note: "The link expires in 1 hour. If you didn't create an account, you can ignore this email.",
        }),
      ),
    });
  });
});
