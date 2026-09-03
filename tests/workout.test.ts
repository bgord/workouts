import { describe, expect, test } from "bun:test";
import * as Workouts from "+workouts";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("Workout", async () => {
  const di = await bootstrap();
  const deps = { ...di.Adapters.System, ...di.Tools };

  test("build", () => {
    const facility = Workouts.Aggregates.Workout.build(mocks.workoutId, [], deps);

    expect(facility.pullEvents()).toEqual([]);
  });
});
