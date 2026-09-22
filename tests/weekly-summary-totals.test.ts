/* cSpell:disable */
import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Notifications from "+notifications";
import * as Workouts from "+workouts";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("WeeklySummaryTotals", async () => {
  const di = await bootstrap();

  const en = bg.TranslatorService.use(await di.Tools.TranslationsProvider.getTranslationsFor("en"));
  const pl = bg.TranslatorService.use(await di.Tools.TranslationsProvider.getTranslationsFor("pl"));

  test("tiles - en", () => {
    const totals = new Notifications.Services.WeeklySummaryTotals(
      [mocks.weekCompletedWorkout],
      [],
      en,
      "en",
    );

    expect(totals.tiles()).toEqual([
      { value: "1", label: "workout", delta: "+1 vs last week" },
      { value: "2", label: "sets", delta: "+2 vs last week" },
      { value: "1,350", label: "volume (kg)", delta: "+1,350 vs last week" },
    ]);
  });

  test("tiles - pl", () => {
    const totals = new Notifications.Services.WeeklySummaryTotals(
      [mocks.weekCompletedWorkout],
      [],
      pl,
      "pl",
    );

    expect(totals.tiles()).toEqual([
      { value: "1", label: "trening", delta: "+1 vs poprzedni" },
      { value: "2", label: "serie", delta: "+2 vs poprzedni" },
      { value: "1 350", label: "objętość (kg)", delta: "+1 350 vs poprzedni" },
    ]);
  });

  test("tiles - a lighter week than the previous one", () => {
    const totals = new Notifications.Services.WeeklySummaryTotals(
      [mocks.weekCompletedWorkout],
      [mocks.weekCompletedWorkout, mocks.weekCompletedWorkout],
      en,
      "en",
    );

    expect(totals.tiles()).toEqual([
      { value: "1", label: "workout", delta: "-1 vs last week" },
      { value: "2", label: "sets", delta: "-2 vs last week" },
      { value: "1,350", label: "volume (kg)", delta: "-1,350 vs last week" },
    ]);
  });

  test("tiles - an identical week", () => {
    const totals = new Notifications.Services.WeeklySummaryTotals(
      [mocks.weekCompletedWorkout],
      [mocks.weekCompletedWorkout],
      en,
      "en",
    );

    expect(totals.tiles()).toEqual([
      { value: "1", label: "workout", delta: "+0 vs last week" },
      { value: "2", label: "sets", delta: "+0 vs last week" },
      { value: "1,350", label: "volume (kg)", delta: "+0 vs last week" },
    ]);
  });

  test("tiles - polish plural forms", () => {
    const totals = new Notifications.Services.WeeklySummaryTotals(
      [
        mocks.weekCompletedWorkout,
        mocks.weekCompletedWorkout,
        mocks.weekCompletedWorkout,
        mocks.weekCompletedWorkout,
        mocks.weekCompletedWorkout,
      ],
      [mocks.weekCompletedWorkout, mocks.weekCompletedWorkout],
      pl,
      "pl",
    );

    expect(totals.tiles()[0]).toEqual({ value: "5", label: "treningów", delta: "+3 vs poprzedni" });
  });

  test("tiles - volume rounds to whole kilograms", () => {
    const totals = new Notifications.Services.WeeklySummaryTotals(
      [
        {
          ...mocks.weekCompletedWorkout,
          sets: [
            {
              reps: v.parse(Workouts.VO.Reps, 1),
              load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(0.4).get()),
            },
          ],
        },
      ],
      [],
      en,
      "en",
    );

    expect(totals.tiles()[2]).toEqual({ value: "0", label: "volume (kg)", delta: "+0 vs last week" });
  });
});
