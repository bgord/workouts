import { describe, expect, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Emails from "+emails";

const url = v.parse(tools.UrlWithoutSlash, "http://example.com/reset?token=abc&x=1");

describe("PasswordResetEmail", () => {
  test("render", async () => {
    const html = await Emails.renderEmail(Emails.PasswordResetEmail, {
      intro: "Intro <b>bold</b>",
      cta: "Reset password",
      url,
      note: "Note",
    });

    expect(html).toContain(">Hi,</p>");
    expect(html).toContain(">Intro &lt;b&gt;bold&lt;/b&gt;</p>");
    expect(html).toContain('href="http://example.com/reset?token=abc&amp;x=1"');
    expect(html).toContain("Reset password");
    expect(html).toContain(">Note</p>");
    expect(html).toContain("Button not working? Paste this into your browser:");
    expect(html).toContain(">http://example.com/reset?token=abc&amp;x=1</a>");
    expect(html).toContain(">— Workouts</p>");
  });
});
