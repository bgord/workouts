import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Exercises from "+exercises";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

const path = tools.FilePathRelative.fromString("infra/exercise-catalog.json");

const image = "exercise-catalog/bench-press-barbell-horizontal.webp";

const catalog = {
  exercises: [{ name: mocks.exerciseName, description: mocks.exerciseDescription, image }],
};

describe("ExerciseCatalogSeeder", async () => {
  const di = await bootstrap();

  const seeder = new Exercises.Services.ExerciseCatalogSeeder({
    ...di.Adapters.System,
    ...di.Tools,
    ListExercisesQuery: di.Adapters.Exercises.ListExercisesQuery,
  });

  test("malformed catalog", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.System.FileReaderJson, "read")).mockResolvedValue({});
    const commandBusEmit = spies.use(spyOn(di.Tools.CommandBus, "emit"));

    expect(async () => seeder.seed(path)).toThrow();
    expect(commandBusEmit).not.toHaveBeenCalled();
  });

  test("empty catalog", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.System.FileReaderJson, "read")).mockResolvedValue({ exercises: [] });
    const commandBusEmit = spies.use(spyOn(di.Tools.CommandBus, "emit"));
    spies.use(spyOn(di.Adapters.Exercises.ListExercisesQuery, "execute")).mockResolvedValue([]);

    const result = await seeder.seed(path);

    expect(result).toEqual({ exercisesCreated: 0 });
    expect(commandBusEmit).not.toHaveBeenCalled();
  });

  test("invalid exercise name", async () => {
    using spies = new DisposableStack();
    spies
      .use(spyOn(di.Adapters.System.FileReaderJson, "read"))
      .mockResolvedValue({ exercises: [{ ...catalog.exercises[0], name: "x" }] });
    const commandBusEmit = spies.use(spyOn(di.Tools.CommandBus, "emit"));

    expect(async () => seeder.seed(path)).toThrow("exercise.name.invalid");
    expect(commandBusEmit).not.toHaveBeenCalled();
  });

  test("unreadable image file", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.System.FileReaderJson, "read")).mockResolvedValue(catalog);
    spies.use(spyOn(di.Adapters.Exercises.ListExercisesQuery, "execute")).mockResolvedValue([]);
    spies
      .use(spyOn(di.Adapters.System.FileReaderRaw, "read"))
      .mockImplementation(mocks.throwIntentionalError);
    const commandBusEmit = spies.use(spyOn(di.Tools.CommandBus, "emit"));

    expect(async () => bg.CorrelationStorage.run(mocks.correlationId, () => seeder.seed(path))).toThrow(
      mocks.IntentionalError,
    );
    expect(commandBusEmit).not.toHaveBeenCalled();
  });

  test("happy path", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.System.FileReaderJson, "read")).mockResolvedValue(catalog);
    const commandBusEmit = spies.use(spyOn(di.Tools.CommandBus, "emit"));
    spies.use(spyOn(di.Adapters.Exercises.ListExercisesQuery, "execute")).mockResolvedValue([]);

    const result = await bg.CorrelationStorage.run(mocks.correlationId, () => seeder.seed(path));

    expect(result).toEqual({ exercisesCreated: 1 });
    expect(commandBusEmit).toHaveBeenCalledTimes(1);
  });

  test("happy path - idempotency", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.System.FileReaderJson, "read")).mockResolvedValue(catalog);
    const commandBusEmit = spies.use(spyOn(di.Tools.CommandBus, "emit"));
    spies.use(spyOn(di.Adapters.Exercises.ListExercisesQuery, "execute")).mockResolvedValue([mocks.exercise]);

    const result = await seeder.seed(path);

    expect(result).toEqual({ exercisesCreated: 0 });
    expect(commandBusEmit).not.toHaveBeenCalled();
  });
});
