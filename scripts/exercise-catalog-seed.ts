import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import { bootstrap } from "+infra/bootstrap";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import { CatalogSeeder } from "./catalog-seeder";

const EXERCISE_CATALOG_PATH = tools.FilePathRelative.fromString("infra/exercise-catalog.json");

void (async function main() {
  const di = await bootstrap();

  registerEventHandlers(di.Env, di);
  registerCommandHandlers(di);

  const correlationId = v.parse(bg.CorrelationId, di.Adapters.System.IdProvider.generate());

  await bg.CorrelationStorage.run(correlationId, async () => {
    di.Adapters.System.Logger.info({
      message: "Exercise catalog seeder attempt",
      component: "exercise_catalog_seeder",
      operation: "attempt",
      correlationId,
      metadata: { EXERCISE_CATALOG_PATH },
    });

    const seeder = new CatalogSeeder({
      ...di.Adapters.System,
      ...di.Tools,
      ListExerciseCategoriesQuery: di.Adapters.Exercises.ListExerciseCategoriesQuery,
      ListExercisesQuery: di.Adapters.Exercises.ListExercisesQuery,
      ListCategoriesAssignedToExerciseQuery: di.Adapters.Exercises.ListCategoriesAssignedToExerciseQuery,
    });

    const result = await seeder.seed(EXERCISE_CATALOG_PATH);

    di.Adapters.System.Logger.info({
      message: "Exercise catalog seeder summary",
      component: "exercise_catalog_seeder",
      operation: "result",
      correlationId,
      metadata: result,
    });

    await di.Adapters.System.Sleeper.wait(tools.Duration.Ms(10));

    process.exit(0);
  });
})();
