/* cSpell:disable */
import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Measurements from "+measurements";
import * as Notifications from "+notifications";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("WeeklySummaryNotificationComposer", async () => {
  const di = await bootstrap();

  const en = new Notifications.Services.WeeklySummaryNotificationComposer(
    di.Env.BETTER_AUTH_URL,
    await di.Tools.TranslationsProvider.getTranslationsFor("en"),
    "en",
  );
  const pl = new Notifications.Services.WeeklySummaryNotificationComposer(
    di.Env.BETTER_AUTH_URL,
    await di.Tools.TranslationsProvider.getTranslationsFor("pl"),
    "pl",
  );

  test("compose - en", () => {
    expect(en.compose(mocks.weeklySummary)).toEqual({
      subject: v.parse(bg.MailerSubject, "Your week in Workouts · 30 Dec – 5 Jan"),
      content: {
        eyebrow: "Weekly summary",
        title: "30 Dec – 5 Jan",
        numbers: {
          tiles: [
            { value: "1", label: "workout", delta: "+1 vs last week" },
            { value: "2", label: "sets", delta: "+2 vs last week" },
            { value: "1,350", label: "volume (kg)", delta: "+1,350 kg vs last week" },
          ],
        },
        highlights: {
          heading: "Progress",
          rows: [{ name: mocks.exerciseName, previous: "1 × 5 × 80 kg", current: "2 × 5 × 90 kg" }],
        },
        bodyWeight: undefined,
        footer: {
          before: "You get this every Monday. Turn it off in your ",
          link: "profile",
          after: ".",
          url: `${di.Env.BETTER_AUTH_URL}/profile`,
        },
        signature: "— Workouts",
      },
    });
  });

  test("compose - pl", () => {
    expect(pl.compose(mocks.weeklySummary)).toEqual({
      subject: v.parse(bg.MailerSubject, "Twój tydzień w Workouts · 30 gru – 5 sty"),
      content: {
        eyebrow: "Tygodniowe podsumowanie",
        title: "30 gru – 5 sty",
        numbers: {
          tiles: [
            { value: "1", label: "trening", delta: "+1 vs poprzedni" },
            { value: "2", label: "serie", delta: "+2 vs poprzedni" },
            { value: "1 350", label: "objętość (kg)", delta: "+1 350 kg vs poprzedni" },
          ],
        },
        highlights: {
          heading: "Postępy",
          rows: [{ name: mocks.exerciseName, previous: "1 × 5 × 80 kg", current: "2 × 5 × 90 kg" }],
        },
        bodyWeight: undefined,
        footer: {
          before: "Dostajesz to w każdy poniedziałek. Wyłącz w swoim ",
          link: "profilu",
          after: ".",
          url: `${di.Env.BETTER_AUTH_URL}/profile`,
        },
        signature: "— Workouts",
      },
    });
  });

  test("compose - no workouts", () => {
    const notification = en.compose({
      ...mocks.weeklySummary,
      numbers: { ...mocks.weeklySummary.numbers, current: mocks.weeklySummary.numbers.previous },
      highlights: [],
    });

    expect(notification.content.numbers).toEqual({ empty: "No workouts completed this week." });
    expect(notification.content.highlights).toEqual({ heading: "Progress", rows: [] });
  });

  test("compose - body weight on track for cut", () => {
    const notification = en.compose({
      ...mocks.weeklySummary,
      bodyWeight: {
        average: 80500,
        count: tools.Int.positive(4),
        previousAverage: 80800,
        goal: Measurements.VO.BodyWeightGoalOptions.cut,
      },
    });

    expect(notification.content.bodyWeight).toEqual({
      heading: "Body weight",
      value: "80.5 kg",
      caption: "average, 4 measurements",
      note: "-0.3 kg vs last week · on track for cut",
    });
  });

  test("compose - body weight drifting from bulk", () => {
    const notification = en.compose({
      ...mocks.weeklySummary,
      bodyWeight: {
        average: 80500,
        count: tools.Int.positive(1),
        previousAverage: 80800,
        goal: Measurements.VO.BodyWeightGoalOptions.bulk,
      },
    });

    expect(notification.content.bodyWeight).toEqual({
      heading: "Body weight",
      value: "80.5 kg",
      caption: "average, 1 measurement",
      note: "-0.3 kg vs last week · drifting from bulk",
    });
  });

  test("compose - body weight unchanged, maintain goal", () => {
    const notification = en.compose({
      ...mocks.weeklySummary,
      bodyWeight: {
        average: 80500,
        count: tools.Int.positive(2),
        previousAverage: 80520,
        goal: Measurements.VO.BodyWeightGoalOptions.maintain,
      },
    });

    expect(notification.content.bodyWeight?.note).toEqual("unchanged vs last week");
  });

  test("compose - body weight without previous week or goal", () => {
    const notification = en.compose({
      ...mocks.weeklySummary,
      bodyWeight: { average: 80500, count: tools.Int.positive(2) },
    });

    expect(notification.content.bodyWeight).toEqual({
      heading: "Body weight",
      value: "80.5 kg",
      caption: "average, 2 measurements",
      note: undefined,
    });
  });

  test("compose - polish plural forms", () => {
    const notification = pl.compose({
      ...mocks.weeklySummary,
      numbers: {
        ...mocks.weeklySummary.numbers,
        current: { ...mocks.weeklySummary.numbers.current, workouts: tools.Int.nonNegative(5) },
      },
      bodyWeight: { average: 80500, count: tools.Int.positive(3) },
    });

    expect(notification.content.numbers).toMatchObject({
      tiles: [{ value: "5", label: "treningów" }, { label: "serie" }, { label: "objętość (kg)" }],
    });
    expect(notification.content.bodyWeight?.caption).toEqual("średnio, 3 pomiary");
  });
});
