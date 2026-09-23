/* cSpell:disable */
import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Measurements from "+measurements";
import * as Notifications from "+notifications";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("WeeklySummaryBodyWeight", async () => {
  const di = await bootstrap();

  const en = bg.TranslatorService.use(await di.Tools.TranslationsProvider.getTranslationsFor("en"));
  const pl = bg.TranslatorService.use(await di.Tools.TranslationsProvider.getTranslationsFor("pl"));

  const heavier = v.parse(Measurements.VO.BodyWeight, tools.Weight.fromKilograms(82).get());
  const previousWeekMeasuredOn = v.parse(Measurements.VO.BodyWeightMeasuredOn, "2024-12-27");

  test("stat - no measurements in the week", () => {
    const bodyWeight = new Notifications.Services.WeeklySummaryBodyWeight([], mocks.week, en, "en");

    expect(bodyWeight.stat()).toEqual(undefined);
  });

  test("stat - without a previous week", () => {
    const bodyWeight = new Notifications.Services.WeeklySummaryBodyWeight(
      [mocks.bodyWeightMeasurement],
      mocks.week,
      en,
      "en",
    );

    expect(bodyWeight.stat()).toEqual({
      heading: "Body weight",
      value: "80.0 kg",
      caption: "average, 1 measurement",
      note: undefined,
    });
  });

  test("stat - down against the previous week", () => {
    const bodyWeight = new Notifications.Services.WeeklySummaryBodyWeight(
      [
        mocks.bodyWeightMeasurement,
        { ...mocks.bodyWeightMeasurement, weight: heavier, measuredOn: previousWeekMeasuredOn },
      ],
      mocks.week,
      en,
      "en",
    );

    expect(bodyWeight.stat()).toEqual({
      heading: "Body weight",
      value: "80.0 kg",
      caption: "average, 1 measurement",
      note: "-2.0 vs last week",
    });
  });

  test("stat - unchanged against the previous week", () => {
    const bodyWeight = new Notifications.Services.WeeklySummaryBodyWeight(
      [mocks.bodyWeightMeasurement, { ...mocks.bodyWeightMeasurement, measuredOn: previousWeekMeasuredOn }],
      mocks.week,
      en,
      "en",
    );

    expect(bodyWeight.stat()?.note).toEqual("unchanged vs last week");
  });

  test("stat - averages the measurements within the week", () => {
    const bodyWeight = new Notifications.Services.WeeklySummaryBodyWeight(
      [
        mocks.bodyWeightMeasurement,
        { ...mocks.bodyWeightMeasurement, weight: heavier, measuredOn: mocks.anotherBodyWeightMeasuredOn },
      ],
      mocks.week,
      en,
      "en",
    );

    expect(bodyWeight.stat()).toEqual({
      heading: "Body weight",
      value: "81.0 kg",
      caption: "average, 2 measurements",
      note: undefined,
    });
  });

  test("stat - pl", () => {
    const bodyWeight = new Notifications.Services.WeeklySummaryBodyWeight(
      [
        mocks.bodyWeightMeasurement,
        { ...mocks.bodyWeightMeasurement, weight: heavier, measuredOn: mocks.anotherBodyWeightMeasuredOn },
      ],
      mocks.week,
      pl,
      "pl",
    );

    expect(bodyWeight.stat()).toEqual({
      heading: "Masa ciała",
      value: "81,0 kg",
      caption: "średnio, 2 pomiary",
      note: undefined,
    });
  });
});
