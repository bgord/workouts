// cSpell:ignore brzycki

import { createAuthAdapters } from "+infra/adapters/auth";
import { createExercisesAdapters } from "+infra/adapters/exercises";
import { createPlansAdapters } from "+infra/adapters/plans";
import { createPreferencesAdapters } from "+infra/adapters/preferences";
import { createStatsAdapters } from "+infra/adapters/stats";
import { createSystemAdapters } from "+infra/adapters/system";
import { createWorkoutsAdapters } from "+infra/adapters/workouts";
import { createEnvironmentLoader } from "+infra/env";
import { createTools } from "+infra/tools";
import { OneRepMaxEstimatorBrzycki } from "+stats/services";

export async function bootstrap() {
  const EnvironmentLoader = await createEnvironmentLoader();
  const Env = await EnvironmentLoader.load();

  const System = await createSystemAdapters(Env);
  const Tools = await createTools(Env, System);

  const Auth = createAuthAdapters();
  const Preferences = createPreferencesAdapters();
  const Exercises = createExercisesAdapters();
  const Stats = createStatsAdapters({ OneRepMaxEstimator: new OneRepMaxEstimatorBrzycki() });
  const Plans = createPlansAdapters({ ...System, ...Tools });
  const Workouts = createWorkoutsAdapters({ ...System, ...Tools });

  return {
    Env,
    Adapters: { Auth, Preferences, System, Exercises, Plans, Stats, Workouts },
    Tools: { ...Tools },
  };
}

export type BootstrapType = Awaited<ReturnType<typeof bootstrap>>;
