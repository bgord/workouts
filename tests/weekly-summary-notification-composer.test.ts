/* cSpell:disable */
import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
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
      numbers: {
        ...mocks.weeklySummary.numbers,
        workouts: {
          current: tools.Int.nonNegative(0),
          previous: tools.Int.nonNegative(0),
          delta: 0,
          direction: Notifications.VO.ComparisonDirections.flat,
        },
      },
      highlights: [],
    });

    expect(notification.content.numbers).toEqual({ empty: "No workouts completed this week." });
    expect(notification.content.highlights).toEqual({ heading: "Progress", rows: [] });
  });

  test("compose - body weight without previous week", () => {
    const notification = en.compose({
      ...mocks.weeklySummary,
      bodyWeight: {
        average: {
          current: 80500,
          previous: undefined,
          delta: 0,
          direction: Notifications.VO.ComparisonDirections.unknown,
        },
        count: tools.Int.positive(2),
      },
    });

    expect(notification.content.bodyWeight).toEqual({
      heading: "Body weight",
      value: "80.5 kg",
      caption: "average, 2 measurements",
      note: undefined,
    });
  });

  test("compose - body weight unchanged vs previous week", () => {
    const notification = en.compose({
      ...mocks.weeklySummary,
      bodyWeight: {
        average: {
          current: 80500,
          previous: 80500,
          delta: 0,
          direction: Notifications.VO.ComparisonDirections.flat,
        },
        count: tools.Int.positive(2),
      },
    });

    expect(notification.content.bodyWeight?.note).toEqual("unchanged vs last week");
  });

  test("compose - body weight down vs previous week", () => {
    const notification = en.compose({
      ...mocks.weeklySummary,
      bodyWeight: {
        average: {
          current: 80500,
          previous: 80800,
          delta: -300,
          direction: Notifications.VO.ComparisonDirections.down,
        },
        count: tools.Int.positive(2),
      },
    });

    expect(notification.content.bodyWeight?.note).toEqual("-0.3 kg vs last week");
  });

  test("compose - polish plural forms", () => {
    const notification = pl.compose({
      ...mocks.weeklySummary,
      numbers: {
        ...mocks.weeklySummary.numbers,
        workouts: { ...mocks.weeklySummary.numbers.workouts, current: tools.Int.nonNegative(5) },
      },
      bodyWeight: {
        average: {
          current: 80500,
          previous: undefined,
          delta: 0,
          direction: Notifications.VO.ComparisonDirections.unknown,
        },
        count: tools.Int.positive(3),
      },
    });

    expect(notification.content.numbers).toMatchObject({
      tiles: [{ value: "5", label: "treningów" }, { label: "serie" }, { label: "objętość (kg)" }],
    });
    expect(notification.content.bodyWeight?.caption).toEqual("średnio, 3 pomiary");
  });
});
