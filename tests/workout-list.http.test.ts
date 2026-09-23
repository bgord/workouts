import { describe, expect, spyOn, test } from "bun:test";
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
    const spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));

    const response = await server.request(
      url,
      { method: "QUERY", body: JSON.stringify({ filter: "ok" }) },
      mocks.ip,
    );
    await testcases.assertErrorResponse(response, 400, "workout.list.filter.invalid");
  });

  test("happy path", async () => {
    const spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies.use(
      spyOn(di.Adapters.Workouts.ListWorkoutsQuery, "execute").mockResolvedValue({
        data: [mocks.workoutSummary],
        sections: [{ id: mocks.planSectionId, name: mocks.planSectionName }],
        plan: mocks.workoutListPlan,
        actions: {
          create: { available: true, enabled: false, hints: ["workout.draft.limit.for.owner"] },
        },
      }),
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
      data: [mocks.workoutSummary],
      sections: [{ id: mocks.planSectionId, name: mocks.planSectionName }],
      plan: mocks.workoutListPlan,
      actions: { create: { available: true, enabled: false, hints: ["workout.draft.limit.for.owner"] } },
    });
  });

  test("happy path - empty", async () => {
    const spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies.use(
      spyOn(di.Adapters.Workouts.ListWorkoutsQuery, "execute").mockResolvedValue({
        data: [],
        sections: [],
        plan: null,
        actions: { create: { available: true, enabled: true, hints: [] } },
      }),
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
      data: [],
      sections: [],
      plan: null,
      actions: { create: { available: true, enabled: true, hints: [] } },
    });
  });
});
