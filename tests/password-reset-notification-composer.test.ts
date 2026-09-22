import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Auth from "+auth";

const url = v.parse(tools.UrlWithoutSlash, "http://example.com");

describe("PasswordResetNotificationComposer", () => {
  test("compose", () => {
    const composer = new Auth.Services.PasswordResetNotificationComposer();
    const notification = composer.compose(url);

    expect(notification).toEqual({
      subject: v.parse(bg.MailerSubject, "Reset your Workouts password"),
      content: {
        intro:
          "We received a request to reset the password for this account. Choose a new one using the button below.",
        cta: "Reset password",
        url,
        note: "The link expires in 1 hour. If you didn't ask for a reset, ignore this email — your password stays the same.",
      },
    });
  });
});
