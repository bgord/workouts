import { describe, expect, test } from "bun:test";
import * as Emails from "+emails";
import * as mocks from "./mocks";

describe("WeeklySummaryEmail", () => {
  test("render - happy path", async () => {
    const html = await Emails.renderEmail(Emails.WeeklySummaryEmail, mocks.weeklySummaryNotificationContent);

    expect(html).toContain(">30 Dec – 5 Jan<");
    expect(html).toContain(">30 Dec – 5 Jan</p>");
    expect(html).toContain('href="http://localhost:3000/profile"');
    expect(html).toContain(">profile</a>");
    expect(html).toContain(">— Workouts</p>");
  });

  test("render - escapes user content", async () => {
    const html = await Emails.renderEmail(Emails.WeeklySummaryEmail, {
      ...mocks.weeklySummaryNotificationContent,
      title: "<b>30 Dec</b> & co",
    });

    expect(html).toContain("&lt;b&gt;30 Dec&lt;/b&gt; &amp; co");
    expect(html).not.toContain("<b>30 Dec</b>");
  });
});
