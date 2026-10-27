import { describe, expect, spyOn, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as Workouts from "+workouts";
import { bootstrap } from "+infra/bootstrap";
import { createServer } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const url = "/api/workouts/list";

describe(`QUERY ${url}`, async () => {
  const di = await bootstrap();
  const server = createServer(di);

  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "QUERY" }, mocks.ip);

    await testcases.assertAuthResponse(response);
  });

  test("validation - filter - invalid", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));

    const response = await server.request(
      url,
      { method: "QUERY", body: JSON.stringify({ filter: "ok" }) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 400, "workout.list.filter.invalid");
  });

  test("validation - incorrect cursor", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));

    const response = await server.request(
      url,
      { method: "QUERY", body: JSON.stringify({ cursor: "abc" }) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 400, "workout.list.cursor.invalid");
  });

  test("validation - incorrect cursor scheduledFor", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));

    const response = await server.request(
      url,
      { method: "QUERY", body: JSON.stringify({ cursor: { scheduledFor: "abc", id: mocks.workoutId } }) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 400, "day.iso.id.bad.chars");
  });

  test("validation - incorrect cursor id", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));

    const response = await server.request(
      url,
      {
        method: "QUERY",
        body: JSON.stringify({ cursor: { scheduledFor: mocks.workoutScheduledFor, id: "abc" } }),
      },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 400, "uuid.type");
  });

  test("happy path", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    const listWorkouts = spies.use(
      spyOn(di.Adapters.Workouts.ListWorkoutsQuery, "execute").mockResolvedValue({
        data: { entries: [mocks.workoutSummary], next: null },
        matching: tools.Int.nonNegative(1),
        sections: [{ id: mocks.planSectionId, name: mocks.workoutPlanSectionName }],
        plan: mocks.workoutListPlan,
        actions: {
          create: { available: true, enabled: false, hints: ["workout.draft.limit.for.owner"] },
        },
      }),
    );
    const total = spies.use(
      spyOn(di.Adapters.Workouts.GetWorkoutForOwnerCountQuery, "execute").mockResolvedValue(
        tools.Int.nonNegative(3),
      ),
    );

    const response = await server.request(
      url,
      {
        method: "QUERY",
        body: JSON.stringify({ filter: Workouts.VO.WorkoutListFilterOptions.last_week }),
      },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(200);
    expect(json).toEqual({
      data: { entries: [mocks.workoutSummary], next: null },
      count: { matching: 1, total: 3 },
      sections: [{ id: mocks.planSectionId, name: mocks.workoutPlanSectionName }],
      plan: mocks.workoutListPlan,
      actions: { create: { available: true, enabled: false, hints: ["workout.draft.limit.for.owner"] } },
    });
    expect(listWorkouts).toHaveBeenCalledWith(
      mocks.userId,
      {
        filter: Workouts.VO.WorkoutListFilterOptions.last_week,
        section: undefined,
        cursor: undefined,
        limit: tools.Int.positive(20),
      },
      expect.any(tools.Timestamp),
    );
    expect(total).toHaveBeenCalledWith(mocks.userId);
  });

  test("happy path - section and cursor", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    const listWorkouts = spies.use(
      spyOn(di.Adapters.Workouts.ListWorkoutsQuery, "execute").mockResolvedValue({
        data: { entries: [mocks.workoutSummary], next: mocks.workoutListCursor },
        matching: tools.Int.nonNegative(21),
        sections: [{ id: mocks.planSectionId, name: mocks.workoutPlanSectionName }],
        plan: mocks.workoutListPlan,
        actions: { create: { available: true, enabled: true, hints: [] } },
      }),
    );
    spies.use(
      spyOn(di.Adapters.Workouts.GetWorkoutForOwnerCountQuery, "execute").mockResolvedValue(
        tools.Int.nonNegative(30),
      ),
    );

    const response = await server.request(
      url,
      {
        method: "QUERY",
        body: JSON.stringify({
          filter: Workouts.VO.WorkoutListFilterOptions.all_time,
          section: mocks.planSectionId,
          cursor: mocks.workoutListCursor,
        }),
      },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(200);
    expect(json).toEqual({
      data: { entries: [mocks.workoutSummary], next: mocks.workoutListCursor },
      count: { matching: 21, total: 30 },
      sections: [{ id: mocks.planSectionId, name: mocks.workoutPlanSectionName }],
      plan: mocks.workoutListPlan,
      actions: { create: { available: true, enabled: true, hints: [] } },
    });
    expect(listWorkouts).toHaveBeenCalledWith(
      mocks.userId,
      {
        filter: Workouts.VO.WorkoutListFilterOptions.all_time,
        section: mocks.planSectionId,
        cursor: mocks.workoutListCursor,
        limit: tools.Int.positive(20),
      },
      expect.any(tools.Timestamp),
    );
  });

  test("happy path - empty", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies.use(
      spyOn(di.Adapters.Workouts.ListWorkoutsQuery, "execute").mockResolvedValue({
        data: { entries: [], next: null },
        matching: tools.Int.nonNegative(0),
        sections: [],
        plan: null,
        actions: { create: { available: true, enabled: true, hints: [] } },
      }),
    );
    spies.use(
      spyOn(di.Adapters.Workouts.GetWorkoutForOwnerCountQuery, "execute").mockResolvedValue(
        tools.Int.nonNegative(0),
      ),
    );

    const response = await server.request(
      url,
      {
        method: "QUERY",
        body: JSON.stringify({ filter: Workouts.VO.WorkoutListFilterOptions.last_week }),
      },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(200);
    expect(json).toEqual({
      data: { entries: [], next: null },
      count: { matching: 0, total: 0 },
      sections: [],
      plan: null,
      actions: { create: { available: true, enabled: true, hints: [] } },
    });
  });
});
