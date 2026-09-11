import { describe, expect, test } from "bun:test";
import * as Workouts from "+workouts";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("WorkoutExportFileCsv", async () => {
  const di = await bootstrap();

  test("generates a CSV", async () => {
    const file = new Workouts.Services.WorkoutExportFileCsv([mocks.workoutExportRow], di.Adapters.System);

    const result = await file.create();

    expect(result).toEqualIgnoringWhitespace(mocks.workoutCsv);
  });
});
