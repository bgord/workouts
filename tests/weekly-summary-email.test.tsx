import { describe, expect, test } from "bun:test";
import * as Emails from "+emails";
import * as mocks from "./mocks";

describe("WeeklySummaryEmail", () => {
  test("render - full", async () => {
    const html = await Emails.renderEmail(Emails.WeeklySummaryEmail, mocks.weeklySummaryNotificationContent);

    expect(html).toContain(">30 Dec – 5 Jan<");
    expect(html).toContain(">Weekly summary</p>");
    expect(html).toContain(">30 Dec – 5 Jan</p>");
    expect(html).toContain(">1</div>");
    expect(html).toContain(">workout</div>");
    expect(html).toContain(">+1 vs last week</div>");
    expect(html).toContain(">1,350</div>");
    expect(html).toContain(">Progress</p>");
    expect(html).toContain(`>${mocks.exerciseName}</td>`);
    expect(html).toContain("1 × 5 × 80 kg");
    expect(html).toContain(">2 × 5 × 90 kg</span>");
    expect(html).toContain(">Body weight</p>");
    expect(html).toContain(">80.5 kg</span>");
    expect(html).toContain("> average, 4 measurements</span>");
    expect(html).toContain(">-0.3 kg vs last week · on track for cut</p>");
    expect(html).toContain(">3 workouts completed this month, 3 this year.</p>");
    expect(html).toContain('href="http://localhost:3000/profile"');
    expect(html).toContain(">profile</a>");
    expect(html).toContain(">— Workouts</p>");
  });

  test("render - empty week without highlights or body weight", async () => {
    const html = await Emails.renderEmail(Emails.WeeklySummaryEmail, {
      ...mocks.weeklySummaryNotificationContent,
      numbers: { empty: "No workouts completed this week." },
      highlights: { heading: "Progress", rows: [] },
      bodyWeight: undefined,
    });

    expect(html).toContain(">No workouts completed this week.</p>");
    expect(html).not.toContain("vs last week");
    expect(html).not.toContain(">Progress</p>");
    expect(html).not.toContain(">Body weight</p>");
  });

  test("render - escapes user content", async () => {
    const html = await Emails.renderEmail(Emails.WeeklySummaryEmail, {
      ...mocks.weeklySummaryNotificationContent,
      highlights: {
        heading: "Progress",
        rows: [{ name: "<b>Bench</b> & co", previous: "1 × 5 × 80 kg", current: "2 × 5 × 90 kg" }],
      },
    });

    expect(html).toContain("&lt;b&gt;Bench&lt;/b&gt; &amp; co");
    expect(html).not.toContain("<b>Bench</b>");
  });
});
