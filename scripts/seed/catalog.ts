import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Auth from "+auth";
import * as Exercises from "+exercises";
import type { BootstrapType } from "+infra/bootstrap";
import { AdminAccountCreator } from "../admin-account-creator";
import * as fixtures from "./fixtures";

export async function seedCatalog(di: BootstrapType) {
  const deps = { ...di.Adapters.System, ...di.Tools };

  await new AdminAccountCreator({ ...deps, Auth: di.Tools.Auth.config }).create(
    v.parse(tools.Email, fixtures.admin.email),
    v.parse(bg.BasicAuthPassword, fixtures.password),
  );

  console.log(`[✓] ${fixtures.admin.email} created`);

  for (const category of Object.values(fixtures.categories)) {
    const command = bg.command(
      Exercises.Commands.ExerciseCategoryAddCommand,
      {
        payload: {
          id: v.parse(Exercises.VO.ExerciseCategoryId, category.id),
          name: v.parse(Exercises.VO.ExerciseCategoryName, category.name),
          userId: Auth.VO.ADMIN_USER_ID,
        },
      },
      deps,
    );

    await di.Tools.CommandBus.emit(command);
  }

  console.log(`[✓] ${Object.values(fixtures.categories).length} exercise categories added`);

  for (const exercise of Object.values(fixtures.exercises)) {
    const asset = await deps.FileReaderRaw.read(`${import.meta.dir}/assets/exercise.webp`);
    const filename = tools.Filename.fromParts(deps.IdProvider.generate(), "webp");
    const temporary = await deps.TemporaryFile.write(filename, new File([asset], "exercise.webp"));

    const command = bg.command(
      Exercises.Commands.ExerciseAddCommand,
      {
        payload: {
          id: v.parse(Exercises.VO.ExerciseId, exercise.id),
          absoluteFilePath: temporary.get(),
          name: v.parse(Exercises.VO.ExerciseName, exercise.name),
          description: v.parse(Exercises.VO.ExerciseDescription, exercise.description),
          resistance: v.parse(Exercises.VO.ExerciseResistance, exercise.resistance),
          laterality: v.parse(Exercises.VO.ExerciseLaterality, exercise.laterality),
          userId: Auth.VO.ADMIN_USER_ID,
        },
      },
      deps,
    );

    await di.Tools.CommandBus.emit(command);
  }

  console.log(`[✓] ${Object.values(fixtures.exercises).length} exercises added`);

  await di.Adapters.System.Sleeper.wait(tools.Duration.Ms(1));

  for (const exercise of Object.values(fixtures.exercises)) {
    for (const category of exercise.categories) {
      const command = bg.command(
        Exercises.Commands.ExerciseAssignCategoryCommand,
        {
          payload: {
            exerciseId: v.parse(Exercises.VO.ExerciseId, exercise.id),
            exerciseCategoryId: v.parse(Exercises.VO.ExerciseCategoryId, category.id),
            requesterId: Auth.VO.ADMIN_USER_ID,
          },
        },
        deps,
      );

      await di.Tools.CommandBus.emit(command);
    }
  }

  console.log("[✓] exercise categories assigned");
}
