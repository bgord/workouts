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
        blocks: [
          {
            kind: Notifications.Services.WeeklySummaryBlockKinds.tiles,
            tiles: [
              { value: "1", label: "workout", delta: "+1 vs last week" },
              { value: "2", label: "sets", delta: "+2 vs last week" },
              { value: "1,350", label: "volume (kg)", delta: "+1,350 kg vs last week" },
            ],
          },
          { kind: Notifications.Services.WeeklySummaryBlockKinds.heading, text: "Progress" },
          {
            kind: Notifications.Services.WeeklySummaryBlockKinds.changes,
            rows: [{ name: mocks.exerciseName, previous: "1 × 5 × 80 kg", current: "2 × 5 × 90 kg" }],
          },
        ],
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
        blocks: [
          {
            kind: Notifications.Services.WeeklySummaryBlockKinds.tiles,
            tiles: [
              { value: "1", label: "trening", delta: "+1 vs poprzedni" },
              { value: "2", label: "serie", delta: "+2 vs poprzedni" },
              { value: "1 350", label: "objętość (kg)", delta: "+1 350 kg vs poprzedni" },
            ],
          },
          { kind: Notifications.Services.WeeklySummaryBlockKinds.heading, text: "Postępy" },
          {
            kind: Notifications.Services.WeeklySummaryBlockKinds.changes,
            rows: [{ name: mocks.exerciseName, previous: "1 × 5 × 80 kg", current: "2 × 5 × 90 kg" }],
          },
        ],
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
      sections: [mocks.weeklySummaryEmptyNumbersSection, mocks.weeklySummaryBodyWeightSection],
    });

    expect(notification.content.blocks[0]).toEqual({
      kind: Notifications.Services.WeeklySummaryBlockKinds.text,
      text: "No workouts completed this week.",
    });
  });

  test("compose - body weight without previous week", () => {
    const notification = en.compose({
      ...mocks.weeklySummary,
      sections: [mocks.weeklySummaryBodyWeightSection],
    });

    expect(notification.content.blocks).toEqual([
      { kind: Notifications.Services.WeeklySummaryBlockKinds.heading, text: "Body weight" },
      {
        kind: Notifications.Services.WeeklySummaryBlockKinds.stat,
        value: "80.5 kg",
        caption: "average, 2 measurements",
        note: undefined,
      },
    ]);
  });

  test("compose - body weight unchanged vs previous week", () => {
    const notification = en.compose({
      ...mocks.weeklySummary,
      sections: [
        {
          ...mocks.weeklySummaryBodyWeightSection,
          average: {
            current: 80500,
            previous: 80500,
            delta: 0,
            direction: Notifications.VO.ComparisonDirections.flat,
          },
        },
      ],
    });

    expect(notification.content.blocks[1]).toMatchObject({ note: "unchanged vs last week" });
  });

  test("compose - body weight down vs previous week", () => {
    const notification = en.compose({
      ...mocks.weeklySummary,
      sections: [
        {
          ...mocks.weeklySummaryBodyWeightSection,
          average: {
            current: 80500,
            previous: 80800,
            delta: -300,
            direction: Notifications.VO.ComparisonDirections.down,
          },
        },
      ],
    });

    expect(notification.content.blocks[1]).toMatchObject({ note: "-0.3 kg vs last week" });
  });

  test("compose - polish plural forms", () => {
    const notification = pl.compose({
      ...mocks.weeklySummary,
      sections: [
        {
          ...mocks.weeklySummaryNumbersSection,
          workouts: { ...mocks.weeklySummaryNumbersSection.workouts, current: tools.Int.nonNegative(5) },
        },
        { ...mocks.weeklySummaryBodyWeightSection, count: tools.Int.positive(3) },
      ],
    });

    expect(notification.content.blocks[0]).toMatchObject({
      tiles: [{ value: "5", label: "treningów" }, { label: "serie" }, { label: "objętość (kg)" }],
    });
    expect(notification.content.blocks[2]).toMatchObject({ caption: "średnio, 3 pomiary" });
  });
});
