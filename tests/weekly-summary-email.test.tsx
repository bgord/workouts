import { describe, expect, test } from "bun:test";
import * as Emails from "+emails";
import * as mocks from "./mocks";

describe("WeeklySummaryEmail", () => {
  test("render - happy path", async () => {
    const html = await Emails.renderEmail(Emails.WeeklySummaryEmail, mocks.weeklySummaryNotificationContent);

    expect(html).toContain(">30 Dec – 5 Jan<");
    expect(html).toContain(">30 Dec – 5 Jan</p>");
    expect(html).toContain(">1</div>");
    expect(html).toContain(">workout</div>");
    expect(html).toContain(">+1 vs last week</div>");
    expect(html).toContain(">2</div>");
    expect(html).toContain(">sets</div>");
    expect(html).toContain(">1,350</div>");
    expect(html).toContain(">volume (kg)</div>");
    expect(html).toContain(">+1,350 vs last week</div>");
    expect(html).toContain('href="http://localhost:3000/profile"');
    expect(html).toContain(">profile</a>");
    expect(html).toContain(">— Workouts</p>");
  });

  test("render - body weight", async () => {
    const html = await Emails.renderEmail(Emails.WeeklySummaryEmail, {
      ...mocks.weeklySummaryNotificationContent,
      bodyWeight: {
        heading: "Body weight",
        value: "80.5 kg",
        caption: "average, 4 measurements",
        note: "-0.3 vs last week",
      },
    });

    expect(html).toContain(">Body weight</p>");
    expect(html).toContain(">80.5 kg</span>");
    expect(html).toContain("> average, 4 measurements</span>");
    expect(html).toContain(">-0.3 vs last week</p>");
  });

  test("render - body weight without a note", async () => {
    const html = await Emails.renderEmail(Emails.WeeklySummaryEmail, {
      ...mocks.weeklySummaryNotificationContent,
      bodyWeight: { heading: "Body weight", value: "80.5 kg", caption: "average, 4 measurements" },
    });

    expect(html).toContain(">80.5 kg</span>");
    expect(html).not.toContain("vs last week</p>");
  });

  test("render - without body weight", async () => {
    const html = await Emails.renderEmail(Emails.WeeklySummaryEmail, mocks.weeklySummaryNotificationContent);

    expect(html).not.toContain(">Body weight</p>");
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
