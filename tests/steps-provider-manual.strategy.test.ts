import { describe, expect, test } from "bun:test";
import * as Measurements from "+measurements";
import * as mocks from "./mocks";

describe("StepsProviderManualStrategy", () => {
  test("provide", async () => {
    const strategy = new Measurements.Services.StepsProviderManualStrategy({ count: mocks.stepsCount });

    const result = await strategy.provide();

    expect(result).toEqual(mocks.stepsCount);
  });
});
